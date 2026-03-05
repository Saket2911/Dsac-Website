import { Request, Response } from "express";
import User from "../models/User.js";

export const getXpLeaderboard = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find()
            .select("name email xp level college platformIds statsCache")
            .sort({ xp: -1 })
            .limit(50);

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            name: user.name,
            email: user.email,
            xp: user.xp,
            level: user.level,
            college: user.college,
            solvedCount: user.statsCache?.leetcode?.totalSolved || 0,
        }));

        res.json({ leaderboard });
    } catch (error) {
        console.error("XP leaderboard error:", error);
        res.status(500).json({ message: "Server error fetching XP leaderboard" });
    }
};

export const getDailyLeaderboard = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find()
            .select("name email xp level solvedDailyQuestions")
            .sort({ "solvedDailyQuestions": -1 })
            .limit(50);

        const leaderboard = users
            .sort((a, b) => b.solvedDailyQuestions.length - a.solvedDailyQuestions.length)
            .map((user, index) => ({
                rank: index + 1,
                name: user.name,
                email: user.email,
                xp: user.xp,
                level: user.level,
                dailySolved: user.solvedDailyQuestions.length,
            }));

        res.json({ leaderboard });
    } catch (error) {
        console.error("Daily leaderboard error:", error);
        res.status(500).json({ message: "Server error fetching daily leaderboard" });
    }
};

export const getContestLeaderboard = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find()
            .select("name email xp level contestsParticipated")
            .sort({ "contestsParticipated": -1 })
            .limit(50);

        const leaderboard = users
            .sort((a, b) => b.contestsParticipated.length - a.contestsParticipated.length)
            .map((user, index) => ({
                rank: index + 1,
                name: user.name,
                email: user.email,
                xp: user.xp,
                level: user.level,
                contestsCount: user.contestsParticipated.length,
            }));

        res.json({ leaderboard });
    } catch (error) {
        console.error("Contest leaderboard error:", error);
        res.status(500).json({ message: "Server error fetching contest leaderboard" });
    }
};
