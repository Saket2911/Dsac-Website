import cron from "node-cron";
import User from "../models/User.js";
import { fetchLeetCodeStats } from "../services/leetcodeService.js";
import { fetchCodeforcesStats } from "../services/codeforcesService.js";
import { fetchCodeChefStats } from "../services/codechefService.js";
import { fetchHackerRankStats } from "../services/hackerrankService.js";

/**
 * Refresh platform stats for all users with platform IDs.
 * Runs every 10 minutes.
 */
export function startStatsRefreshJob(): void {
    cron.schedule("*/10 * * * *", async () => {
        console.log("[CRON] Starting stats refresh...");
        try {
            const users = await User.find({
                $or: [
                    { "platformIds.leetcodeId": { $ne: "" } },
                    { "platformIds.codeforcesId": { $ne: "" } },
                    { "platformIds.codechefId": { $ne: "" } },
                    { "platformIds.hackerrankId": { $ne: "" } },
                ],
            });

            console.log(`[CRON] Refreshing stats for ${users.length} users`);

            for (const user of users) {
                const stats: Record<string, any> = {};

                try {
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

                    if (Object.keys(stats).length > 0) {
                        user.statsCache = { ...stats, lastUpdated: new Date() };
                        await user.save();
                    }
                } catch (err) {
                    console.error(`[CRON] Error refreshing stats for user ${user.name}:`, err);
                }

                // Small delay between users to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            console.log("[CRON] Stats refresh complete");
        } catch (error) {
            console.error("[CRON] Stats refresh job error:", error);
        }
    });

    console.log("📊 Stats refresh cron job scheduled (every 10 minutes)");
}
