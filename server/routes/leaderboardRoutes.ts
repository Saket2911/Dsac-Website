import { Router } from "express";
import {
    getXpLeaderboard,
    getDailyLeaderboard,
    getContestLeaderboard,
} from "../controllers/leaderboardController.js";

const router = Router();

router.get("/xp", getXpLeaderboard);
router.get("/daily", getDailyLeaderboard);
router.get("/contest", getContestLeaderboard);

export default router;
