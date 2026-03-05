import cron from "node-cron";
import Contest from "../models/Contest.js";
import User from "../models/User.js";
import { fetchCodeforcesContestStandings } from "../services/codeforcesService.js";
import { addXp, XP_REWARDS } from "../utils/xp.js";

/**
 * Fetch contest ranks during active contests.
 * Runs every 2 minutes.
 */
export function startContestRankFetcherJob(): void {
    cron.schedule("*/2 * * * *", async () => {
        try {
            const now = new Date();

            // Find active contests
            const activeContests = await Contest.find({
                startTime: { $lte: now },
                endTime: { $gte: now },
            });

            if (activeContests.length === 0) return;

            console.log(`[CRON] Fetching ranks for ${activeContests.length} active contest(s)`);

            for (const contest of activeContests) {
                try {
                    if (contest.platform === "codeforces") {
                        // Get all users with codeforces IDs
                        const users = await User.find({
                            "platformIds.codeforcesId": { $ne: "" },
                        });

                        const handles = users
                            .map((u) => u.platformIds.codeforcesId)
                            .filter((h): h is string => !!h);

                        if (handles.length === 0) continue;

                        const standings = await fetchCodeforcesContestStandings(
                            parseInt(contest.contestId),
                            handles
                        );

                        // Update contest leaderboard
                        const leaderboard: any[] = [];

                        for (const user of users) {
                            const handle = user.platformIds.codeforcesId?.toLowerCase();
                            if (!handle) continue;

                            const standing = standings.get(handle);
                            if (standing) {
                                leaderboard.push({
                                    userId: user._id,
                                    rank: standing.rank,
                                    score: standing.score,
                                    username: user.name,
                                });

                                // Track contest participation
                                const userId = user._id as any;
                                if (!user.contestsParticipated.includes(contest._id as any)) {
                                    user.contestsParticipated.push(contest._id as any);
                                    await user.save();

                                    // Award participation XP
                                    await addXp(userId.toString(), XP_REWARDS.CONTEST_PARTICIPATION, "Contest participation");

                                    // Award bonus for top rank
                                    if (standing.rank <= 10) {
                                        await addXp(userId.toString(), XP_REWARDS.TOP_CONTEST_RANK, "Top contest rank");
                                    }
                                }
                            }
                        }

                        if (leaderboard.length > 0) {
                            contest.leaderboard = leaderboard.sort((a, b) => a.rank - b.rank);
                            await contest.save();
                            console.log(`[CRON] Updated leaderboard for ${contest.name}: ${leaderboard.length} entries`);
                        }
                    }

                    // Add more platform handlers here (leetcode, codechef, etc.)
                } catch (err) {
                    console.error(`[CRON] Error fetching ranks for contest ${contest.name}:`, err);
                }
            }
        } catch (error) {
            console.error("[CRON] Contest rank fetcher error:", error);
        }
    });

    console.log("🏆 Contest rank fetcher cron job scheduled (every 2 minutes)");
}
