import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import DailyQuestion from "../models/DailyQuestion.js";
import User from "../models/User.js";

// ============ DAILY QUESTION MANAGEMENT ============

export const createDailyQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { questionId, title, platform, difficulty, description, hints, date, xpReward, topicTags } = req.body;

        if (!questionId || !title || !platform || !difficulty || !date) {
            res.status(400).json({ message: "questionId, title, platform, difficulty, and date are required" });
            return;
        }

        const question = new DailyQuestion({
            questionId,
            title,
            platform,
            difficulty,
            description: description || "",
            hints: hints || [],
            date: new Date(date),
            xpReward: xpReward || 10,
            topicTags: topicTags || [],
        });

        await question.save();
        res.status(201).json({ message: "Daily question created successfully", question });
    } catch (error: any) {
        console.error("Create daily question error:", error);
        if (error.code === 11000) {
            res.status(400).json({ message: "A daily question already exists for this date" });
            return;
        }
        res.status(500).json({ message: "Server error creating daily question" });
    }
};

export const updateDailyQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const question = await DailyQuestion.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!question) {
            res.status(404).json({ message: "Daily question not found" });
            return;
        }

        res.json({ message: "Daily question updated successfully", question });
    } catch (error) {
        console.error("Update daily question error:", error);
        res.status(500).json({ message: "Server error updating daily question" });
    }
};

export const deleteDailyQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const question = await DailyQuestion.findByIdAndDelete(id);
        if (!question) {
            res.status(404).json({ message: "Daily question not found" });
            return;
        }

        res.json({ message: "Daily question deleted successfully" });
    } catch (error) {
        console.error("Delete daily question error:", error);
        res.status(500).json({ message: "Server error deleting daily question" });
    }
};

export const getAllDailyQuestions = async (_req: Request, res: Response): Promise<void> => {
    try {
        const questions = await DailyQuestion.find().sort({ date: -1 }).limit(50);
        res.json({ questions });
    } catch (error) {
        console.error("Get all daily questions error:", error);
        res.status(500).json({ message: "Server error fetching daily questions" });
    }
};

// ============ USER MANAGEMENT ============

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find()
                .select("name email role college profilePicture xp level platformIds createdAt")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(),
        ]);

        res.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Server error fetching users" });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (req.user!._id.toString() === id) {
            res.status(400).json({ message: "You cannot delete your own account from admin panel" });
            return;
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Server error deleting user" });
    }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !["student", "admin"].includes(role)) {
            res.status(400).json({ message: "Valid role (student or admin) is required" });
            return;
        }

        // Prevent admin from changing their own role
        if (req.user!._id.toString() === id) {
            res.status(400).json({ message: "You cannot change your own role" });
            return;
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "User role updated successfully", user });
    } catch (error) {
        console.error("Update user role error:", error);
        res.status(500).json({ message: "Server error updating user role" });
    }
};
