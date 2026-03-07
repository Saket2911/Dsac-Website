import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import leaderboardRoutes from "./leaderboardRoutes.js";
import contestRoutes from "./contestRoutes.js";
import dailyQuestionRoutes from "./dailyQuestionRoutes.js";
import questRoutes from "./questRoutes.js";
import adminRoutes from "./adminRoutes.js";
import resourceRoutes from "./resourceRoutes.js";
const router = Router();
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/contests", contestRoutes);
router.use("/daily-question", dailyQuestionRoutes);
router.use("/quests", questRoutes);
router.use("/admin", adminRoutes);
router.use("/resources", resourceRoutes);

// Health check
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});
export default router;