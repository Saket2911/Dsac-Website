import { Router } from "express";
import {
    getXpLeaderboard,
    getDailyLeaderboard,
    getContestLeaderboard,
    getPlatformLeaderboard,
    getLiveContestRankings,
    getDailyQuestionTracker,
} from "../controllers/leaderboardController.js";

const router = Router();

router.get("/xp", getXpLeaderboard);
router.get("/daily", getDailyLeaderboard);
router.get("/contest", getContestLeaderboard);
router.get("/platform", getPlatformLeaderboard);
router.get("/live-contests", getLiveContestRankings);
router.get("/daily-tracker", getDailyQuestionTracker);

export default router;
