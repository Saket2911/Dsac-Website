import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import DailyQuestion from "../models/DailyQuestion.js";
import { checkLeetCodeProblemSolved } from "../services/leetcodeService.js";
import { addXp, XP_REWARDS } from "../utils/xp.js";
import { generateDailyQuestion } from "../cronJobs/dailyQuestionCron.js";

export const getDailyQuestion = async (_req: Request, res: Response): Promise<void> => {
    try {
        // Get today's question (match by date, ignoring time)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let question = await DailyQuestion.findOne({
            date: { $gte: today, $lt: tomorrow },
        });

        // If no question for today, auto-generate one
        if (!question) {
            question = await generateDailyQuestion();
        }

        // Fallback to most recent question
        if (!question) {
            question = await DailyQuestion.findOne().sort({ date: -1 });
        }

        if (!question) {
            res.status(404).json({ message: "No daily question available" });
            return;
        }

        // Build the platform URL
        let platformUrl = "";
        if (question.platform === "leetcode") {
            platformUrl = `https://leetcode.com/problems/${question.questionId}/`;
        } else if (question.platform === "codeforces") {
            platformUrl = `https://codeforces.com/problemset/problem/${question.questionId}`;
        } else if (question.platform === "codechef") {
            platformUrl = `https://www.codechef.com/problems/${question.questionId}`;
        } else if (question.platform === "hackerrank") {
            platformUrl = `https://www.hackerrank.com/challenges/${question.questionId}`;
        }

        res.json({
            question: {
                id: question._id,
                questionId: question.questionId,
                title: question.title,
                platform: question.platform,
                difficulty: question.difficulty,
                description: question.description,
                hints: question.hints,
                xpReward: question.xpReward,
                topicTags: question.topicTags,
                solvedCount: question.solvedUsers.length,
                date: question.date,
                platformUrl,
            },
        });
    } catch (error) {
        console.error("Get daily question error:", error);
        res.status(500).json({ message: "Server error fetching daily question" });
    }
};

export const submitDailyQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { questionId } = req.body;

        if (!questionId) {
            res.status(400).json({ message: "questionId is required" });
            return;
        }

        const question = await DailyQuestion.findById(questionId);
        if (!question) {
            res.status(404).json({ message: "Question not found" });
            return;
        }

        // Check if already solved
        const userId = user._id as any;
        if (question.solvedUsers.includes(userId)) {
            res.status(400).json({ message: "You have already solved this question" });
            return;
        }

        // Verify on platform if possible
        let verified = false;

        if (question.platform === "leetcode" && user.platformIds.leetcodeId) {
            verified = await checkLeetCodeProblemSolved(
                user.platformIds.leetcodeId,
                question.questionId
            );
        } else {
            // For other platforms or if no platform ID is set, accept the submission
            verified = true;
        }

        if (!verified) {
            res.status(400).json({
                message: "Could not verify your submission. Make sure you've solved the problem on the platform.",
            });
            return;
        }

        // Mark as solved
        question.solvedUsers.push(userId);
        await question.save();

        // Add to user's solved list
        user.solvedDailyQuestions.push(question._id as any);
        await user.save();

        // Award XP
        const updatedUser = await addXp(
            userId.toString(),
            question.xpReward || XP_REWARDS.DAILY_QUESTION,
            "Daily question solved"
        );

        res.json({
            message: "Question solved successfully!",
            xpAwarded: question.xpReward || XP_REWARDS.DAILY_QUESTION,
            newXp: updatedUser?.xp,
            newLevel: updatedUser?.level,
        });
    } catch (error) {
        console.error("Submit daily question error:", error);
        res.status(500).json({ message: "Server error submitting daily question" });
    }
};

/**
 * Check if the authenticated user has already solved today's daily question on LeetCode.
 * If yes, auto-award XP and mark as solved.
 */
export const checkSolvedStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const userId = user._id as any;

        // Get today's question
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const question = await DailyQuestion.findOne({
            date: { $gte: today, $lt: tomorrow },
        });

        if (!question) {
            res.json({ solved: false, message: "No daily question for today" });
            return;
        }

        // Already marked as solved in our DB
        if (question.solvedUsers.includes(userId)) {
            res.json({ solved: true, alreadyAwarded: true, message: "Already solved and XP awarded" });
            return;
        }

        // Check on LeetCode
        if (question.platform === "leetcode" && user.platformIds.leetcodeId) {
            const solved = await checkLeetCodeProblemSolved(
                user.platformIds.leetcodeId,
                question.questionId
            );

            if (solved) {
                // Auto-award XP
                question.solvedUsers.push(userId);
                await question.save();

                user.solvedDailyQuestions.push(question._id as any);
                await user.save();

                const updatedUser = await addXp(
                    userId.toString(),
                    question.xpReward || XP_REWARDS.DAILY_QUESTION,
                    "Daily question auto-verified"
                );

                res.json({
                    solved: true,
                    alreadyAwarded: false,
                    xpAwarded: question.xpReward || XP_REWARDS.DAILY_QUESTION,
                    newXp: updatedUser?.xp,
                    newLevel: updatedUser?.level,
                    message: "Problem solved! XP awarded automatically.",
                });
                return;
            }
        }

        res.json({ solved: false, message: "Not solved yet" });
    } catch (error) {
        console.error("Check solved status error:", error);
        res.status(500).json({ message: "Server error checking solved status" });
    }
};
