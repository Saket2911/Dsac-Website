import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
    updatePlatformIds,
    updateProfile,
    getProfile,
    getStats,
    uploadProfileImage,
    getPublicProfile,
    solveSpecialQuestion
} from "../controllers/userController.js";

const router = Router();
router.put("/platform-ids", auth, updatePlatformIds);
router.put("/profile", auth, updateProfile);
router.get("/profile", auth, getProfile);
router.get("/stats", auth, getStats);
router.post("/profile/upload-image", auth, upload.single("profileImage"), uploadProfileImage);
router.get("/public/:name", getPublicProfile);
router.post("/solve-special", auth, solveSpecialQuestion);

export default router;