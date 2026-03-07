import User from "../models/User.js";
import Resource from "../models/Resource.js";
import SpecialQuestion from "../models/SpecialQuestion.js";

// Get all users (admin only)
export const getAllUsers = async (_req, res) => {
    try {
        const users = await User.find()
            .select("name email college role xp level profileImage platformIds createdAt")
            .sort({ createdAt: -1 });
        res.json({ users });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Server error fetching users" });
    }
};

// Delete a user (admin only)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(400).json({ message: "Cannot delete another admin" });
        }
        await User.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Server error deleting user" });
    }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!role || !['student', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'student' or 'admin'" });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Prevent admin from changing their own role
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot change your own role" });
        }
        user.role = role;
        await user.save();
        res.json({ message: `User role updated to ${role}`, user: { _id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        console.error("Update user role error:", error);
        res.status(500).json({ message: "Server error updating role" });
    }
};

// Post a special question (admin only)
export const postSpecialQuestion = async (req, res) => {
    try {
        const { title, platform, problemLink, points, date } = req.body;
        if (!title || !platform || !problemLink) {
            return res.status(400).json({ message: "Title, platform, and problemLink are required" });
        }
        const question = new SpecialQuestion({
            title,
            platform,
            problemLink,
            points: points || 50,
            date: date || new Date()
        });
        await question.save();
        res.status(201).json({ message: "Special question created", question });
    } catch (error) {
        console.error("Post special question error:", error);
        res.status(500).json({ message: "Server error creating special question" });
    }
};

// Update a special question (admin only)
export const updateSpecialQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, platform, problemLink, points, date } = req.body;
        const question = await SpecialQuestion.findById(id);
        if (!question) {
            return res.status(404).json({ message: "Special question not found" });
        }
        if (title !== undefined) question.title = title;
        if (platform !== undefined) question.platform = platform;
        if (problemLink !== undefined) question.problemLink = problemLink;
        if (points !== undefined) question.points = points;
        if (date !== undefined) question.date = date;
        await question.save();
        res.json({ message: "Special question updated", question });
    } catch (error) {
        console.error("Update special question error:", error);
        res.status(500).json({ message: "Server error updating special question" });
    }
};

// Get all special questions
export const getSpecialQuestions = async (_req, res) => {
    try {
        const questions = await SpecialQuestion.find()
            .sort({ date: -1 })
            .limit(20);
        res.json({ questions });
    } catch (error) {
        console.error("Get special questions error:", error);
        res.status(500).json({ message: "Server error fetching special questions" });
    }
};

// Add a resource (admin only)
export const addResource = async (req, res) => {
    try {
        const { title, category, youtubeVideoId, gfgLink, difficulty, order } = req.body;
        if (!title || !category) {
            return res.status(400).json({ message: "Title and category are required" });
        }
        const resource = new Resource({
            title,
            category,
            youtubeVideoId: youtubeVideoId || "",
            gfgLink: gfgLink || "",
            difficulty: difficulty || "Easy",
            order: order || 0
        });
        await resource.save();
        res.status(201).json({ message: "Resource added", resource });
    } catch (error) {
        console.error("Add resource error:", error);
        res.status(500).json({ message: "Server error adding resource" });
    }
};

// Delete a resource (admin only)
export const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findById(id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        await Resource.findByIdAndDelete(id);
        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error("Delete resource error:", error);
        res.status(500).json({ message: "Server error deleting resource" });
    }
};
