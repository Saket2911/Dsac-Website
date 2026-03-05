import cron from "node-cron";
import DailyQuestion from "../models/DailyQuestion.js";
import { fetchRandomLeetCodeProblem } from "../services/leetcodeService.js";
import { fetchRandomCodeforcesProblem } from "../services/codeforcesService.js";

/**
 * Generate today's daily question by fetching a random problem from a rotating platform.
 * Called by cron job and also as a fallback when no question exists for today.
 */
export async function generateDailyQuestion() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if today's question already exists
    const existing = await DailyQuestion.findOne({
        date: { $gte: today, $lt: tomorrow },
    });

    if (existing) {
        console.log(`📝 Daily question already exists for today: "${existing.title}" (${existing.platform})`);
        return existing;
    }

    // Rotate platforms based on day of year: LeetCode 60%, Codeforces 40%
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const platforms = ["leetcode", "leetcode", "leetcode", "codeforces", "codeforces"];
    const selectedPlatform = platforms[dayOfYear % platforms.length];

    console.log(`🔍 Fetching random ${selectedPlatform} problem for daily question...`);

    let questionData: {
        questionId: string;
        title: string;
        platform: string;
        difficulty: string;
        description: string;
        hints: string[];
        topicTags: string[];
        xpReward: number;
    } | null = null;

    if (selectedPlatform === "leetcode") {
        const problem = await fetchRandomLeetCodeProblem();
        if (problem) {
            const xpMap: Record<string, number> = { Easy: 10, Medium: 20, Hard: 40 };
            questionData = {
                questionId: problem.titleSlug,
                title: problem.title,
                platform: "leetcode",
                difficulty: problem.difficulty,
                description: problem.content,
                hints: problem.hints,
                topicTags: problem.topicTags,
                xpReward: xpMap[problem.difficulty] || 10,
            };
        }
    } else if (selectedPlatform === "codeforces") {
        const problem = await fetchRandomCodeforcesProblem();
        if (problem) {
            // Map Codeforces rating to difficulty
            let difficulty = "Medium";
            if (problem.rating <= 1000) difficulty = "Easy";
            else if (problem.rating >= 1600) difficulty = "Hard";

            const xpMap: Record<string, number> = { Easy: 10, Medium: 20, Hard: 40 };
            questionData = {
                questionId: `${problem.contestId}/${problem.index}`,
                title: problem.name,
                platform: "codeforces",
                difficulty,
                description: `<p>This is a Codeforces problem rated <strong>${problem.rating}</strong>.</p>
<p>Click <strong>"Solve on Platform"</strong> to view the full problem statement on Codeforces and solve it there.</p>
<h3>Problem Details</h3>
<ul>
<li><strong>Contest:</strong> ${problem.contestId}</li>
<li><strong>Problem:</strong> ${problem.index} - ${problem.name}</li>
<li><strong>Rating:</strong> ${problem.rating}</li>
</ul>`,
                hints: [
                    `This problem has a difficulty rating of ${problem.rating} on Codeforces.`,
                    problem.tags.length > 0 ? `Related topics: ${problem.tags.join(", ")}` : "Try breaking the problem into smaller subproblems.",
                ],
                topicTags: problem.tags,
                xpReward: xpMap[difficulty] || 10,
            };
        }
    }

    // Fallback: if selected platform failed, try LeetCode
    if (!questionData && selectedPlatform !== "leetcode") {
        console.log("⚠️ Falling back to LeetCode...");
        const problem = await fetchRandomLeetCodeProblem();
        if (problem) {
            const xpMap: Record<string, number> = { Easy: 10, Medium: 20, Hard: 40 };
            questionData = {
                questionId: problem.titleSlug,
                title: problem.title,
                platform: "leetcode",
                difficulty: problem.difficulty,
                description: problem.content,
                hints: problem.hints,
                topicTags: problem.topicTags,
                xpReward: xpMap[problem.difficulty] || 10,
            };
        }
    }

    if (!questionData) {
        console.error("❌ Failed to fetch a problem for daily question from any platform");
        return null;
    }

    try {
        const question = await DailyQuestion.create({
            ...questionData,
            date: today,
            solvedUsers: [],
        });

        console.log(`✅ Daily question created: "${questionData.title}" (${questionData.platform}, ${questionData.difficulty}, +${questionData.xpReward} XP)`);
        return question;
    } catch (error: any) {
        // Handle duplicate key error (race condition)
        if (error.code === 11000) {
            console.log("📝 Daily question was already created (race condition), fetching existing...");
            return DailyQuestion.findOne({ date: { $gte: today, $lt: tomorrow } });
        }
        console.error("❌ Error creating daily question:", error.message);
        return null;
    }
}

/**
 * Cron job that runs at midnight IST (18:30 UTC) to generate the daily question.
 */
export function startDailyQuestionJob(): void {
    // Run at 00:00 IST = 18:30 UTC previous day
    cron.schedule("30 18 * * *", async () => {
        console.log("⏰ Daily question cron job triggered");
        await generateDailyQuestion();
    });

    console.log("📅 Daily question cron job scheduled (midnight IST)");

    // Also generate immediately if none exists for today
    generateDailyQuestion().catch((err) =>
        console.error("Error generating initial daily question:", err)
    );
}
