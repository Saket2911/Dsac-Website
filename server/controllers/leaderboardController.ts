import { Request, Response } from "express";
import User from "../models/User.js";
import Contest from "../models/Contest.js";
import DailyQuestion from "../models/DailyQuestion.js";

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

/**
 * Platform-wise problems solved leaderboard.
 * Returns users ranked by total problems solved across LeetCode, Codeforces, and CodeChef.
 */
export const getPlatformLeaderboard = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find()
            .select("name email xp level college platformIds statsCache")
            .limit(100);

        const leaderboard = users
            .map((user) => {
                const lc = user.statsCache?.leetcode?.totalSolved || 0;
                const cf = user.statsCache?.codeforces?.problemsSolved || 0;
                const cc = user.statsCache?.codechef?.problemsSolved || 0;
                const total = lc + cf + cc;

                return {
                    name: user.name,
                    email: user.email,
                    xp: user.xp,
                    level: user.level,
                    college: user.college || "",
                    leetcode: lc,
                    codeforces: cf,
                    codechef: cc,
                    total,
                    platformIds: {
                        leetcodeId: user.platformIds?.leetcodeId || "",
                        codeforcesId: user.platformIds?.codeforcesId || "",
                        codechefId: user.platformIds?.codechefId || "",
                    },
                };
            })
            .filter((u) => u.total > 0)
            .sort((a, b) => b.total - a.total)
            .map((entry, index) => ({
                rank: index + 1,
                ...entry,
            }));

        res.json({ leaderboard });
    } catch (error) {
        console.error("Platform leaderboard error:", error);
        res.status(500).json({ message: "Server error fetching platform leaderboard" });
    }
};

/**
 * Live contest rankings — returns contests from today with their member leaderboards.
 */
export const getLiveContestRankings = async (_req: Request, res: Response): Promise<void> => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Find contests that started today (either active or just finished today)
        const todayContests = await Contest.find({
            $or: [
                { startTime: { $gte: today, $lt: tomorrow } },
                { endTime: { $gte: today, $lt: tomorrow } },
                { startTime: { $lte: today }, endTime: { $gte: today } },
            ],
        }).sort({ startTime: -1 });

        const contests = todayContests.map((contest) => {
            const now = new Date();
            let status: "upcoming" | "active" | "past" = "past";
            if (contest.startTime > now) status = "upcoming";
            else if (contest.endTime > now) status = "active";

            return {
                id: contest._id,
                name: contest.name,
                platform: contest.platform,
                contestId: contest.contestId,
                startTime: contest.startTime,
                endTime: contest.endTime,
                status,
                leaderboard: contest.leaderboard
                    .sort((a, b) => a.rank - b.rank)
                    .map((entry) => ({
                        rank: entry.rank,
                        username: entry.username,
                        score: entry.score,
                    })),
            };
        });

        res.json({ contests });
    } catch (error) {
        console.error("Live contest rankings error:", error);
        res.status(500).json({ message: "Server error fetching live contest rankings" });
    }
};

/**
 * Daily question tracking leaderboard.
 * Shows today's daily question and who solved it, with timestamps.
 */
export const getDailyQuestionTracker = async (_req: Request, res: Response): Promise<void> => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get today's daily question with solved entries populated
        const question = await DailyQuestion.findOne({
            date: { $gte: today, $lt: tomorrow },
        });

        if (!question) {
            res.json({ question: null, solvers: [] });
            return;
        }

        // Get all registered users to show who solved and who didn't
        const allUsers = await User.find()
            .select("name email platformIds")
            .limit(100);

        const solvedSet = new Set(
            question.solvedEntries.map((e) => e.userId.toString())
        );

        // Also check legacy solvedUsers in case entries existed before solvedEntries was added
        for (const uid of question.solvedUsers) {
            solvedSet.add(uid.toString());
        }

        // Build a map of userId -> solvedAt timestamp
        const solvedAtMap = new Map<string, Date>();
        for (const entry of question.solvedEntries) {
            solvedAtMap.set(entry.userId.toString(), entry.solvedAt);
        }

        const solvers = allUsers.map((user) => {
            const uid = (user._id as any).toString();
            const solved = solvedSet.has(uid);
            const solvedAt = solvedAtMap.get(uid) || null;

            return {
                name: user.name,
                email: user.email,
                solved,
                solvedAt,
            };
        });

        // Sort: solved users first (by earliest solve time), unsolved at the end
        solvers.sort((a, b) => {
            if (a.solved && !b.solved) return -1;
            if (!a.solved && b.solved) return 1;
            if (a.solved && b.solved) {
                const aTime = a.solvedAt ? new Date(a.solvedAt).getTime() : Infinity;
                const bTime = b.solvedAt ? new Date(b.solvedAt).getTime() : Infinity;
                return aTime - bTime;
            }
            return 0;
        });

        res.json({
            question: {
                id: question._id,
                title: question.title,
                platform: question.platform,
                difficulty: question.difficulty,
                date: question.date,
                totalSolvers: solvedSet.size,
            },
            solvers,
        });
    } catch (error) {
        console.error("Daily question tracker error:", error);
        res.status(500).json({ message: "Server error fetching daily question tracker" });
    }
};
