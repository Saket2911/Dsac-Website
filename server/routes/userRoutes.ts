import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { updatePlatformIds, updateProfile, getProfile, getStats, getPublicProfile } from "../controllers/userController.js";

const router = Router();

router.put("/platform-ids", auth, updatePlatformIds);
router.put("/profile", auth, upload.single("profilePicture"), updateProfile);
router.get("/profile", auth, getProfile);
router.get("/profile/:id", getPublicProfile);
router.get("/stats", auth, getStats);

export default router;
