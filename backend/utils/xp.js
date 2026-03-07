import User from "../models/User.js";

// XP reward constants
export const XP_REWARDS = {
  DAILY_QUESTION: 20,
  SPECIAL_QUESTION: 50,
  QUEST_COMPLETED: 15,
  CONTEST_PARTICIPATION: 30,
  TOP_CONTEST_RANK: 50
};

/**
 * Calculate user level from XP.
 * Level = floor(xp / 100) + 1
 * e.g., 0 XP = Level 1, 100 XP = Level 2, 350 XP = Level 4
 */
export function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

/**
 * Add XP to a user and recalculate their level.
 * Returns the updated user document.
 */
export async function addXp(userId, amount, reason) {
  const user = await User.findById(userId);
  if (!user) return null;
  user.xp += amount;
  user.level = calculateLevel(user.xp);
  await user.save();
  console.log(`[XP] User ${user.name} (${user._id}): +${amount} XP (${reason || "unknown"}) → Total: ${user.xp} XP, Level ${user.level}`);
  return user;
}

/**
 * Get XP needed for next level.
 */
export function xpToNextLevel(currentXp) {
  const currentLevel = calculateLevel(currentXp);
  const nextLevelXp = currentLevel * 100;
  return nextLevelXp - currentXp;
}

/**
 * Get XP progress percentage towards next level.
 */
export function xpProgressPercent(currentXp) {
  const currentLevel = calculateLevel(currentXp);
  const levelBaseXp = (currentLevel - 1) * 100;
  const progressInLevel = currentXp - levelBaseXp;
  return Math.min(100, Math.round(progressInLevel / 100 * 100));
}