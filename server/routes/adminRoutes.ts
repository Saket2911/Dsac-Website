import { Router } from "express";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
    createDailyQuestion,
    updateDailyQuestion,
    deleteDailyQuestion,
    getAllDailyQuestions,
    getAllUsers,
    deleteUser,
    updateUserRole,
} from "../controllers/adminController.js";

const router = Router();

// All admin routes require authentication + admin role
router.use(auth, adminAuth);

// Daily Question management
router.get("/daily-questions", getAllDailyQuestions);
router.post("/daily-question", createDailyQuestion);
router.put("/daily-question/:id", updateDailyQuestion);
router.delete("/daily-question/:id", deleteDailyQuestion);

// User management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUserRole);

export default router;
