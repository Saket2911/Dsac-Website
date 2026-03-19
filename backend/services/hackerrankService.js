import axios from "axios";

/**
 * Fetch HackerRank stats using the semi-public badges REST API.
 * The badges endpoint returns per-category data with a `solved` count,
 * which is the most accurate measure of unique problems solved.
 */
export async function fetchHackerRankStats(username) {
  try {
    const profileResponse = await axios.get(`https://www.hackerrank.com/rest/hackers/${username}/badges`, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json",
      }
    });

    const badges = [];
    let problemsSolved = 0;
    let totalScore = 0;

    if (profileResponse.data?.models) {
      for (const badge of profileResponse.data.models) {
        badges.push({
          name: badge.badge_name || badge.name || "Badge",
          stars: badge.stars || 0,
          solved: badge.solved || 0,
        });
        // Sum up the `solved` field from each badge category for accurate count
        problemsSolved += badge.solved || 0;
        totalScore += badge.current_points || 0;
      }
    }

    return {
      badges: badges.map(b => b.name),
      badgeDetails: badges,
      problemsSolved,
      totalScore: Math.round(totalScore),
    };
  } catch (error) {
    console.error(`HackerRank fetch error for ${username}:`, error instanceof Error ? error.message : error);
    return null;
  }
}