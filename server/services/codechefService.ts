import axios from "axios";

interface CodeChefStats {
    rating: number;
    problemsSolved: number;
    stars: string;
}

export async function fetchCodeChefStats(username: string): Promise<CodeChefStats | null> {
    try {
        // CodeChef doesn't have a stable public API.
        // We use the unofficial user details endpoint.
        const response = await axios.get(`https://www.codechef.com/users/${username}`, {
            timeout: 15000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });

        const html = response.data as string;

        // Extract rating from HTML
        const ratingMatch = html.match(/rating\D*?(\d{1,4})/i);
        const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 0;

        // Extract problems solved 
        const solvedMatch = html.match(/Problems Solved.*?(\d+)/s);
        const problemsSolved = solvedMatch ? parseInt(solvedMatch[1], 10) : 0;

        // Extract star rating
        const starsMatch = html.match(/rating-star[^>]*>([^<]*)</);
        let stars = "0★";
        if (starsMatch) {
            stars = starsMatch[1].trim() || "0★";
        } else if (rating > 0) {
            // Determine stars from rating
            if (rating >= 2500) stars = "7★";
            else if (rating >= 2200) stars = "6★";
            else if (rating >= 2000) stars = "5★";
            else if (rating >= 1800) stars = "4★";
            else if (rating >= 1600) stars = "3★";
            else if (rating >= 1400) stars = "2★";
            else stars = "1★";
        }

        return { rating, problemsSolved, stars };
    } catch (error) {
        console.error(`CodeChef fetch error for ${username}:`, error instanceof Error ? error.message : error);
        return null;
    }
}
