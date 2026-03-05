import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import Quest from "../models/Quest.js";
import { addXp, XP_REWARDS } from "../utils/xp.js";

export const getQuests = async (_req: Request, res: Response): Promise<void> => {
    try {
        const quests = await Quest.find().populate("prerequisite", "title");

        res.json({ quests });
    } catch (error) {
        console.error("Get quests error:", error);
        res.status(500).json({ message: "Server error fetching quests" });
    }
};

export const completeQuest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { id } = req.params;

        const quest = await Quest.findById(id);
        if (!quest) {
            res.status(404).json({ message: "Quest not found" });
            return;
        }

        const userId = user._id as any;

        // Check if already completed
        if (quest.completedUsers.includes(userId)) {
            res.status(400).json({ message: "You have already completed this quest" });
            return;
        }

        // Check prerequisite
        if (quest.prerequisite) {
            const prereq = await Quest.findById(quest.prerequisite);
            if (prereq && !prereq.completedUsers.includes(userId)) {
                res.status(400).json({
                    message: `You must complete "${prereq.title}" first`,
                });
                return;
            }
        }

        // Mark as completed
        quest.completedUsers.push(userId);
        await quest.save();

        // Award XP
        const updatedUser = await addXp(
            userId.toString(),
            quest.xpReward || XP_REWARDS.QUEST_COMPLETED,
            `Quest completed: ${quest.title}`
        );

        res.json({
            message: `Quest "${quest.title}" completed!`,
            xpAwarded: quest.xpReward || XP_REWARDS.QUEST_COMPLETED,
            newXp: updatedUser?.xp,
            newLevel: updatedUser?.level,
        });
    } catch (error) {
        console.error("Complete quest error:", error);
        res.status(500).json({ message: "Server error completing quest" });
    }
};
