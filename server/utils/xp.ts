import User, { IUser } from "../models/User.js";

// XP reward constants
export const XP_REWARDS = {
    DAILY_QUESTION: 10,
    QUEST_COMPLETED: 15,
    CONTEST_PARTICIPATION: 20,
    TOP_CONTEST_RANK: 50,
} as const;

/**
 * Calculate user level from XP.
 * Level = floor(xp / 100) + 1
 * e.g., 0 XP = Level 1, 100 XP = Level 2, 350 XP = Level 4
 */
export function calculateLevel(xp: number): number {
    return Math.floor(xp / 100) + 1;
}

/**
 * Add XP to a user and recalculate their level.
 * Returns the updated user document.
 */
export async function addXp(userId: string, amount: number, reason?: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) return null;

    user.xp += amount;
    user.level = calculateLevel(user.xp);

    await user.save();

    console.log(
        `[XP] User ${user.name} (${user._id}): +${amount} XP (${reason || "unknown"}) → Total: ${user.xp} XP, Level ${user.level}`
    );

    return user;
}

/**
 * Get XP needed for next level.
 */
export function xpToNextLevel(currentXp: number): number {
    const currentLevel = calculateLevel(currentXp);
    const nextLevelXp = currentLevel * 100;
    return nextLevelXp - currentXp;
}

/**
 * Get XP progress percentage towards next level.
 */
export function xpProgressPercent(currentXp: number): number {
    const currentLevel = calculateLevel(currentXp);
    const levelBaseXp = (currentLevel - 1) * 100;
    const progressInLevel = currentXp - levelBaseXp;
    return Math.min(100, Math.round((progressInLevel / 100) * 100));
}
