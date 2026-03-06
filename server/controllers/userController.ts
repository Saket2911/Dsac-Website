import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import User from "../models/User.js";
import { fetchLeetCodeStats } from "../services/leetcodeService.js";
import { fetchCodeforcesStats } from "../services/codeforcesService.js";
import { fetchCodeChefStats } from "../services/codechefService.js";
import { fetchHackerRankStats } from "../services/hackerrankService.js";
import { xpToNextLevel, xpProgressPercent } from "../utils/xp.js";

export const updatePlatformIds = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { leetcodeId, codeforcesId, codechefId, hackerrankId } = req.body;
        const user = req.user!;

        user.platformIds = {
            leetcodeId: leetcodeId ?? user.platformIds.leetcodeId,
            codeforcesId: codeforcesId ?? user.platformIds.codeforcesId,
            codechefId: codechefId ?? user.platformIds.codechefId,
            hackerrankId: hackerrankId ?? user.platformIds.hackerrankId,
        };

        await user.save();

        res.json({
            message: "Platform IDs updated successfully",
            platformIds: user.platformIds,
        });
    } catch (error) {
        console.error("Update platform IDs error:", error);
        res.status(500).json({ message: "Server error updating platform IDs" });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, college, leetcodeId, codeforcesId, codechefId, hackerrankId } = req.body;
        const user = req.user!;

        if (name !== undefined) user.name = name.trim();
        if (college !== undefined) user.college = college.trim();

        // Handle profile picture upload
        const multerReq = req as any;
        if (multerReq.file) {
            user.profilePicture = `/uploads/${multerReq.file.filename}`;
        }

        user.platformIds = {
            leetcodeId: leetcodeId ?? user.platformIds.leetcodeId,
            codeforcesId: codeforcesId ?? user.platformIds.codeforcesId,
            codechefId: codechefId ?? user.platformIds.codechefId,
            hackerrankId: hackerrankId ?? user.platformIds.hackerrankId,
        };

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server error updating profile" });
    }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        res.json({
            user,
            xpToNext: xpToNextLevel(user.xp),
            xpProgress: xpProgressPercent(user.xp),
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};

export const getPublicProfile = async (req: import("express").Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("name email college profilePicture platformIds xp level statsCache solvedDailyQuestions contestsParticipated createdAt");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const totalSolved = (user.statsCache?.leetcode?.totalSolved || 0) +
            (user.statsCache?.codeforces?.problemsSolved || 0) +
            (user.statsCache?.codechef?.problemsSolved || 0) +
            (user.statsCache?.hackerrank?.problemsSolved || 0);

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                college: user.college,
                profilePicture: user.profilePicture,
                platformIds: user.platformIds,
                xp: user.xp,
                level: user.level,
                totalSolved,
                dailyQuestionsSolved: user.solvedDailyQuestions.length,
                contestsParticipated: user.contestsParticipated.length,
                statsCache: user.statsCache,
                joinedAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Get public profile error:", error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const stats: Record<string, any> = {};

        // Fetch live stats from each platform if ID is provided
        const promises: Promise<void>[] = [];

        if (user.platformIds.leetcodeId) {
            promises.push(
                fetchLeetCodeStats(user.platformIds.leetcodeId).then((data) => {
                    if (data) stats.leetcode = data;
                })
            );
        }

        if (user.platformIds.codeforcesId) {
            promises.push(
                fetchCodeforcesStats(user.platformIds.codeforcesId).then((data) => {
                    if (data) stats.codeforces = data;
                })
            );
        }

        if (user.platformIds.codechefId) {
            promises.push(
                fetchCodeChefStats(user.platformIds.codechefId).then((data) => {
                    if (data) stats.codechef = data;
                })
            );
        }

        if (user.platformIds.hackerrankId) {
            promises.push(
                fetchHackerRankStats(user.platformIds.hackerrankId).then((data) => {
                    if (data) stats.hackerrank = data;
                })
            );
        }

        await Promise.allSettled(promises);

        // Update cache
        user.statsCache = { ...stats, lastUpdated: new Date() };
        await user.save();

        res.json({ stats, cachedAt: new Date() });
    } catch (error) {
        console.error("Get stats error:", error);
        res.status(500).json({ message: "Server error fetching stats" });
    }
};
