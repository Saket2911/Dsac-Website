import axios from "axios";

interface HackerRankStats {
    badges: string[];
    problemsSolved: number;
}

export async function fetchHackerRankStats(username: string): Promise<HackerRankStats | null> {
    try {
        // HackerRank has some semi-public REST endpoints
        const profileResponse = await axios.get(
            `https://www.hackerrank.com/rest/hackers/${username}/badges`,
            {
                timeout: 10000,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            }
        );

        const badges: string[] = [];
        if (profileResponse.data?.models) {
            for (const badge of profileResponse.data.models) {
                badges.push(badge.badge_name || badge.name || "Badge");
            }
        }

        // Fetch submission count
        let problemsSolved = 0;
        try {
            const submissionResponse = await axios.get(
                `https://www.hackerrank.com/rest/hackers/${username}/submission_histories`,
                {
                    timeout: 10000,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    },
                }
            );

            if (submissionResponse.data) {
                // Each key is a month, value is count of submissions
                for (const count of Object.values(submissionResponse.data)) {
                    problemsSolved += (count as number) || 0;
                }
            }
        } catch {
            // submissions endpoint may not be available
        }

        return { badges, problemsSolved };
    } catch (error) {
        console.error(`HackerRank fetch error for ${username}:`, error instanceof Error ? error.message : error);
        return null;
    }
}
