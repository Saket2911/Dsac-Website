import { Router } from "express";
import auth from "../middleware/auth.js";
import { getQuests, completeQuest } from "../controllers/questController.js";

const router = Router();

router.get("/", getQuests);
router.post("/:id/complete", auth, completeQuest);

export default router;
