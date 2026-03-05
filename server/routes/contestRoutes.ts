import { Router } from "express";
import { getContests, getContestLeaderboard, getMemberCount } from "../controllers/contestController.js";

const router = Router();

router.get("/", getContests);
router.get("/member-count", getMemberCount);
router.get("/leaderboard/:contestId", getContestLeaderboard);

export default router;
