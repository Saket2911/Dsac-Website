import axios from "axios";

/**
 * Fetch CodeChef stats. Uses an unofficial JSON API that some community
 * scrapers use (codechef-api.com), which is more stable than HTML parsing.
 */
export async function fetchCodeChefStats(username) {
  try {
    // Try the unofficial community API first (most reliable)
    const response = await axios.get(
      `https://codechef-api.vercel.app/handle/${username}`,
      {
        timeout: 12000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
    );
    const data = response.data;
    if (!data || data.status === "Failed")
      throw new Error("API returned failure");

    const rating = data.currentRating || 0;
    const stars = data.stars
      ? data.stars.replace("★", "")
      : getStarsFromRating(rating);
    const problemsSolved = data.totalSolved || 0;

    return {
      rating,
      problemsSolved,
      stars: stars + "★",
    };
  } catch {
    // Fallback: try direct HTML scraping with strict regex
    try {
      const response = await axios.get(
        `https://www.codechef.com/users/${username}`,
        {
          timeout: 15000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml",
          },
        },
      );
      const html = response.data;

      // Extract rating
      const ratingMatch = html.match(/"currentRating"\s*:\s*(\d+)/);
      const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 0;

      // Extract problems solved from JSON-LD or page data
      const solvedMatch = html.match(/"totalSolved"\s*:\s*(\d+)/);
      const problemsSolved = solvedMatch ? parseInt(solvedMatch[1], 10) : 0;

      const stars = getStarsFromRating(rating);
      return { rating, problemsSolved, stars };
    } catch (error) {
      console.error(
        `CodeChef fetch error for ${username}:`,
        error instanceof Error ? error.message : error,
      );
      return null;
    }
  }
}

function getStarsFromRating(rating) {
  if (rating >= 2500) return "7★";
  if (rating >= 2200) return "6★";
  if (rating >= 2000) return "5★";
  if (rating >= 1800) return "4★";
  if (rating >= 1600) return "3★";
  if (rating >= 1400) return "2★";
  if (rating > 0) return "1★";
  return "0★";
}
