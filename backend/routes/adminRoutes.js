import { Router } from "express";
import auth from "../middleware/auth.js";
import checkAdmin from "../middleware/checkAdmin.js";
import {
    getAllUsers,
    deleteUser,
    updateUserRole,
    postSpecialQuestion,
    updateSpecialQuestion,
    getSpecialQuestions,
    addResource,
    deleteResource
} from "../controllers/adminController.js";

const router = Router();

// All admin routes require auth + admin role
router.get("/users", auth, checkAdmin, getAllUsers);
router.delete("/users/:id", auth, checkAdmin, deleteUser);
router.put("/users/:id/role", auth, checkAdmin, updateUserRole);

// Special questions
router.get("/special-questions", getSpecialQuestions); // Public read
router.post("/special-question", auth, checkAdmin, postSpecialQuestion);
router.put("/special-question/:id", auth, checkAdmin, updateSpecialQuestion);

// Resources
router.post("/resources", auth, checkAdmin, addResource);
router.delete("/resources/:id", auth, checkAdmin, deleteResource);

export default router;
