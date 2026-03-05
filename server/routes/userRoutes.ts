import { Router } from "express";
import auth from "../middleware/auth.js";
import { updatePlatformIds, updateProfile, getProfile, getStats } from "../controllers/userController.js";

const router = Router();

router.put("/platform-ids", auth, updatePlatformIds);
router.put("/profile", auth, updateProfile);
router.get("/profile", auth, getProfile);
router.get("/stats", auth, getStats);

export default router;
