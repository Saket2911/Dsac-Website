import axios from "axios";

interface LeetCodeStats {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    contestRating: number;
    contestRanking: number;
}

export interface LeetCodeProblem {
    titleSlug: string;
    title: string;
    difficulty: string;
    content: string;
    hints: string[];
    topicTags: string[];
}

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
    try {
        // Fetch problem stats
        const problemQuery = {
            query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
            variables: { username },
        };

        const problemResponse = await axios.post(LEETCODE_GRAPHQL_URL, problemQuery, {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
        });

        const acStats = problemResponse.data?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
        if (!acStats) return null;

        const statsMap: Record<string, number> = {};
        for (const stat of acStats) {
            statsMap[stat.difficulty] = stat.count;
        }

        // Fetch contest stats
        const contestQuery = {
            query: `
        query getUserContestInfo($username: String!) {
          userContestRanking(username: $username) {
            rating
            globalRanking
          }
        }
      `,
            variables: { username },
        };

        let contestRating = 0;
        let contestRanking = 0;

        try {
            const contestResponse = await axios.post(LEETCODE_GRAPHQL_URL, contestQuery, {
                headers: { "Content-Type": "application/json" },
                timeout: 10000,
            });
            const contestData = contestResponse.data?.data?.userContestRanking;
            if (contestData) {
                contestRating = Math.round(contestData.rating || 0);
                contestRanking = contestData.globalRanking || 0;
            }
        } catch {
            // Contest data may not be available
        }

        return {
            totalSolved: statsMap["All"] || 0,
            easySolved: statsMap["Easy"] || 0,
            mediumSolved: statsMap["Medium"] || 0,
            hardSolved: statsMap["Hard"] || 0,
            contestRating,
            contestRanking,
        };
    } catch (error) {
        console.error(`LeetCode fetch error for ${username}:`, error instanceof Error ? error.message : error);
        return null;
    }
}

export async function checkLeetCodeProblemSolved(username: string, problemSlug: string): Promise<boolean> {
    try {
        // Use the recentAcSubmissionList query which only returns accepted submissions
        const query = {
            query: `
        query recentAcSubmissions($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            titleSlug
          }
        }
      `,
            variables: { username, limit: 50 },
        };

        const response = await axios.post(LEETCODE_GRAPHQL_URL, query, {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
        });

        const submissions = response.data?.data?.recentAcSubmissionList || [];
        return submissions.some((sub: any) => sub.titleSlug === problemSlug);
    } catch (error) {
        console.error(`LeetCode submission check error for ${username}:`, error instanceof Error ? error.message : error);
        return false;
    }
}

/**
 * Fetch total number of LeetCode problems.
 */
async function fetchLeetCodeProblemCount(): Promise<number> {
    try {
        const query = {
            query: `
        query problemsetQuestionList {
          problemsetQuestionList: questionList(
            categorySlug: "algorithms"
            limit: 1
            skip: 0
            filters: { status: "NOT_STARTED" }
          ) {
            total
          }
        }
      `,
        };

        const response = await axios.post(LEETCODE_GRAPHQL_URL, query, {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
        });

        const total = response.data?.data?.problemsetQuestionList?.total;
        return total || 3000; // fallback
    } catch {
        return 3000; // fallback count
    }
}

/**
 * Fetch a random LeetCode problem with full details (description, hints, topic tags).
 */
export async function fetchRandomLeetCodeProblem(): Promise<LeetCodeProblem | null> {
    try {
        const totalProblems = await fetchLeetCodeProblemCount();
        const randomSkip = Math.floor(Math.random() * Math.min(totalProblems, 2500));

        // Step 1: Get a random problem slug from the problem list
        const listQuery = {
            query: `
        query problemsetQuestionList($skip: Int!, $limit: Int!) {
          problemsetQuestionList: questionList(
            categorySlug: "algorithms"
            limit: $limit
            skip: $skip
            filters: {}
          ) {
            questions: data {
              titleSlug
              title
              difficulty
              topicTags {
                name
              }
              isPaidOnly
            }
          }
        }
      `,
            variables: { skip: randomSkip, limit: 5 },
        };

        const listResponse = await axios.post(LEETCODE_GRAPHQL_URL, listQuery, {
            headers: { "Content-Type": "application/json" },
            timeout: 15000,
        });

        const questions = listResponse.data?.data?.problemsetQuestionList?.questions || [];
        // Filter out premium-only problems
        const freeQuestions = questions.filter((q: any) => !q.isPaidOnly);

        if (freeQuestions.length === 0) {
            console.error("No free LeetCode questions found at offset", randomSkip);
            return null;
        }

        const picked = freeQuestions[0];

        // Step 2: Fetch full problem details (content + hints)
        const detailQuery = {
            query: `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            title
            titleSlug
            content
            difficulty
            hints
            topicTags {
              name
            }
          }
        }
      `,
            variables: { titleSlug: picked.titleSlug },
        };

        const detailResponse = await axios.post(LEETCODE_GRAPHQL_URL, detailQuery, {
            headers: { "Content-Type": "application/json" },
            timeout: 15000,
        });

        const problem = detailResponse.data?.data?.question;
        if (!problem) return null;

        return {
            titleSlug: problem.titleSlug,
            title: problem.title,
            difficulty: problem.difficulty,
            content: problem.content || "",
            hints: problem.hints || [],
            topicTags: (problem.topicTags || []).map((t: any) => t.name),
        };
    } catch (error) {
        console.error("Failed to fetch random LeetCode problem:", error instanceof Error ? error.message : error);
        return null;
    }
}
