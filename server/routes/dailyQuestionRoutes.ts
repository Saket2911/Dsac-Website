import { Router } from "express";
import auth from "../middleware/auth.js";
import { getDailyQuestion, submitDailyQuestion, checkSolvedStatus } from "../controllers/dailyQuestionController.js";

const router = Router();

router.get("/", getDailyQuestion);
router.post("/submit", auth, submitDailyQuestion);
router.get("/check-solved", auth, checkSolvedStatus);

export default router;
