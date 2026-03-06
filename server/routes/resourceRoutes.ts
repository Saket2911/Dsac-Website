import { Router } from "express";
import {
    getResourcePaths,
    getResourcePath,
    getTopicVideos,
} from "../controllers/resourceController.js";

const router = Router();

// Public routes — no auth required
router.get("/", getResourcePaths);
router.get("/:id", getResourcePath);
router.get("/topic/:playlistId/videos", getTopicVideos);

export default router;
