import axios from "axios";

interface CodeforcesStats {
    rating: number;
    problemsSolved: number;
    contestRanks: number[];
}

const CF_API_BASE = "https://codeforces.com/api";

export async function fetchCodeforcesStats(handle: string): Promise<CodeforcesStats | null> {
    try {
        // Fetch user info for rating
        const userResponse = await axios.get(`${CF_API_BASE}/user.info`, {
            params: { handles: handle },
            timeout: 10000,
        });

        if (userResponse.data.status !== "OK") return null;
        const userInfo = userResponse.data.result[0];
        const rating = userInfo.rating || 0;

        // Fetch user submissions for problem count
        const submissionsResponse = await axios.get(`${CF_API_BASE}/user.status`, {
            params: { handle, from: 1, count: 10000 },
            timeout: 15000,
        });

        let problemsSolved = 0;
        if (submissionsResponse.data.status === "OK") {
            const solvedSet = new Set<string>();
            for (const sub of submissionsResponse.data.result) {
                if (sub.verdict === "OK") {
                    solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
                }
            }
            problemsSolved = solvedSet.size;
        }

        // Fetch contest history for ranks
        const ratingResponse = await axios.get(`${CF_API_BASE}/user.rating`, {
            params: { handle },
            timeout: 10000,
        });

        const contestRanks: number[] = [];
        if (ratingResponse.data.status === "OK") {
            for (const contest of ratingResponse.data.result.slice(-10)) {
                contestRanks.push(contest.rank);
            }
        }

        return { rating, problemsSolved, contestRanks };
    } catch (error) {
        console.error(`Codeforces fetch error for ${handle}:`, error instanceof Error ? error.message : error);
        return null;
    }
}

export async function fetchCodeforcesContestStandings(
    contestId: number,
    handles: string[]
): Promise<Map<string, { rank: number; score: number }>> {
    const results = new Map<string, { rank: number; score: number }>();
    try {
        const response = await axios.get(`${CF_API_BASE}/contest.standings`, {
            params: {
                contestId,
                handles: handles.join(";"),
                showUnofficial: false,
            },
            timeout: 15000,
        });

        if (response.data.status === "OK") {
            for (const row of response.data.result.rows) {
                const handle = row.party.members[0]?.handle;
                if (handle) {
                    results.set(handle.toLowerCase(), {
                        rank: row.rank,
                        score: row.points,
                    });
                }
            }
        }
    } catch (error) {
        console.error(`Codeforces standings error for contest ${contestId}:`, error instanceof Error ? error.message : error);
    }
    return results;
}

export interface CodeforcesProblem {
    contestId: number;
    index: string;
    name: string;
    rating: number;
    tags: string[];
    url: string;
}

/**
 * Fetch a random Codeforces problem.
 */
export async function fetchRandomCodeforcesProblem(): Promise<CodeforcesProblem | null> {
    try {
        const response = await axios.get(`${CF_API_BASE}/problemset.problems`, {
            timeout: 15000,
        });

        if (response.data.status !== "OK") return null;

        const problems = response.data.result.problems;
        // Filter to problems with a rating (difficulty) between 800-2000
        const suitable = problems.filter(
            (p: any) => p.rating && p.rating >= 800 && p.rating <= 2000 && p.contestId
        );

        if (suitable.length === 0) return null;

        const picked = suitable[Math.floor(Math.random() * suitable.length)];

        return {
            contestId: picked.contestId,
            index: picked.index,
            name: picked.name,
            rating: picked.rating || 0,
            tags: picked.tags || [],
            url: `https://codeforces.com/problemset/problem/${picked.contestId}/${picked.index}`,
        };
    } catch (error) {
        console.error("Failed to fetch random Codeforces problem:", error instanceof Error ? error.message : error);
        return null;
    }
}
