import { startStatsRefreshJob } from "./statsRefresh.js";
import { startContestRankFetcherJob } from "./contestRankFetcher.js";
import { startDailyQuestionJob } from "./dailyQuestionCron.js";

export function initCronJobs(): void {
    console.log("⏰ Initializing cron jobs...");
    startStatsRefreshJob();
    startContestRankFetcherJob();
    startDailyQuestionJob();
    console.log("✅ All cron jobs initialized");
}
