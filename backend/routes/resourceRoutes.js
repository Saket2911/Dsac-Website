import { Router } from "express";
import { getAllResources, getResourcesByCategory } from "../controllers/resourceController.js";

const router = Router();

router.get("/", getAllResources);
router.get("/category/:category", getResourcesByCategory);

export default router;
