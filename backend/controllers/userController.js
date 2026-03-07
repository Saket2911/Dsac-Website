import { fetchLeetCodeStats } from "../services/leetcodeService.js";
import { fetchCodeforcesStats } from "../services/codeforcesService.js";
import { fetchCodeChefStats } from "../services/codechefService.js";
import { fetchHackerRankStats } from "../services/hackerrankService.js";
import { xpToNextLevel, xpProgressPercent, addXp, XP_REWARDS } from "../utils/xp.js";
import User from "../models/User.js";
import SpecialQuestion from "../models/SpecialQuestion.js";
export const updatePlatformIds = async (req, res) => {
  try {
    const {
      leetcodeId,
      codeforcesId,
      codechefId,
      hackerrankId
    } = req.body;
    const user = req.user;
    user.platformIds = {
      leetcodeId: leetcodeId ?? user.platformIds.leetcodeId,
      codeforcesId: codeforcesId ?? user.platformIds.codeforcesId,
      codechefId: codechefId ?? user.platformIds.codechefId,
      hackerrankId: hackerrankId ?? user.platformIds.hackerrankId
    };
    await user.save();
    res.json({
      message: "Platform IDs updated successfully",
      platformIds: user.platformIds
    });
  } catch (error) {
    console.error("Update platform IDs error:", error);
    res.status(500).json({
      message: "Server error updating platform IDs"
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      college,
      leetcodeId,
      codeforcesId,
      codechefId,
      hackerrankId
    } = req.body;
    const user = req.user;
    if (name !== undefined) user.name = name.trim();
    if (college !== undefined) user.college = college.trim();
    user.platformIds = {
      leetcodeId: leetcodeId ?? user.platformIds.leetcodeId,
      codeforcesId: codeforcesId ?? user.platformIds.codeforcesId,
      codechefId: codechefId ?? user.platformIds.codechefId,
      hackerrankId: hackerrankId ?? user.platformIds.hackerrankId
    };
    await user.save();
    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Server error updating profile"
    });
  }
};
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user,
      xpToNext: xpToNextLevel(user.xp),
      xpProgress: xpProgressPercent(user.xp)
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Server error fetching profile"
    });
  }
};
export const getStats = async (req, res) => {
  try {
    const user = req.user;
    const stats = {};

    // Fetch live stats from each platform if ID is provided
    const promises = [];
    if (user.platformIds.leetcodeId) {
      promises.push(fetchLeetCodeStats(user.platformIds.leetcodeId).then(data => {
        if (data) stats.leetcode = data;
      }));
    }
    if (user.platformIds.codeforcesId) {
      promises.push(fetchCodeforcesStats(user.platformIds.codeforcesId).then(data => {
        if (data) stats.codeforces = data;
      }));
    }
    if (user.platformIds.codechefId) {
      promises.push(fetchCodeChefStats(user.platformIds.codechefId).then(data => {
        if (data) stats.codechef = data;
      }));
    }
    if (user.platformIds.hackerrankId) {
      promises.push(fetchHackerRankStats(user.platformIds.hackerrankId).then(data => {
        if (data) stats.hackerrank = data;
      }));
    }
    await Promise.allSettled(promises);

    // Update cache
    user.statsCache = {
      ...stats,
      lastUpdated: new Date()
    };
    await user.save();
    res.json({
      stats,
      cachedAt: new Date()
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      message: "Server error fetching stats"
    });
  }
};

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    const user = req.user;
    user.profileImage = "/uploads/" + req.file.filename;
    await user.save();
    res.json({
      message: "Profile image uploaded successfully",
      profileImage: user.profileImage,
      user
    });
  } catch (error) {
    console.error("Upload profile image error:", error);
    res.status(500).json({ message: "Server error uploading image" });
  }
};

// Get public profile by name
export const getPublicProfile = async (req, res) => {
  try {
    const { name } = req.params;
    const user = await User.findOne({
      name: { $regex: new RegExp("^" + name.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&") + "$", "i") }
    }).select("name email college xp level platformIds profileImage statsCache role createdAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      user,
      xpToNext: xpToNextLevel(user.xp),
      xpProgress: xpProgressPercent(user.xp)
    });
  } catch (error) {
    console.error("Get public profile error:", error);
    res.status(500).json({ message: "Server error fetching public profile" });
  }
};

// Solve special question — with platform verification
export const solveSpecialQuestion = async (req, res) => {
  try {
    const user = req.user;
    const { questionId } = req.body;
    if (!questionId) {
      return res.status(400).json({ message: "questionId is required" });
    }
    const question = await SpecialQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Special question not found" });
    }
    // Check if already solved
    const alreadySolved = question.solvedUsers.some(
      entry => entry.userId.toString() === user._id.toString()
    );
    if (alreadySolved) {
      return res.status(400).json({ message: "You have already solved this question" });
    }

    // Verify on platform
    let verified = false;
    if (question.platform === "leetcode" && user.platformIds?.leetcodeId) {
      // Extract problem slug from link (e.g., "https://leetcode.com/problems/two-sum/" => "two-sum")
      const match = question.problemLink.match(/problems\/([^/]+)/);
      const slug = match ? match[1] : null;
      if (slug) {
        const { checkLeetCodeProblemSolved } = await import("../services/leetcodeService.js");
        verified = await checkLeetCodeProblemSolved(user.platformIds.leetcodeId, slug);
      }
    }

    if (!verified) {
      return res.status(400).json({
        message: question.platform === "leetcode"
          ? "Could not verify your submission on LeetCode. Make sure you've solved the problem and your LeetCode username is correct in your profile."
          : "Could not verify your submission. Make sure you've solved the problem on the platform and your platform username is set in your profile."
      });
    }

    // Mark as solved
    question.solvedUsers.push({ userId: user._id, solvedAt: new Date() });
    await question.save();
    // Award XP
    const xpAmount = question.points || XP_REWARDS.SPECIAL_QUESTION;
    const updatedUser = await addXp(user._id.toString(), xpAmount, "Special question solved");
    res.json({
      message: "Special question solved!",
      xpAwarded: xpAmount,
      newXp: updatedUser?.xp,
      newLevel: updatedUser?.level
    });
  } catch (error) {
    console.error("Solve special question error:", error);
    res.status(500).json({ message: "Server error solving special question" });
  }
};