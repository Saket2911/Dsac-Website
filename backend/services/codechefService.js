import axios from "axios";

/**
 * Fetch CodeChef stats by scraping the user profile page directly.
 * The previous community API (codechef-api.vercel.app) returned 402.
 */
export async function fetchCodeChefStats(username) {
  try {
    const response = await axios.get(`https://www.codechef.com/users/${username}`, {
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      }
    });
    const html = response.data;

    // Extract rating — look for multiple patterns CodeChef uses
    let rating = 0;
    const ratingPatterns = [
      /class="rating-number"[^>]*>(\d+)</, // rating-number class
      /"currentRating"\s*:\s*(\d+)/,         // JSON embedded in page
      /rating\s*:\s*(\d+)/i,                 // generic rating pattern
      /Current Rating\s*<\/div>\s*<div[^>]*>(\d+)/i, // Current Rating label
    ];
    for (const pattern of ratingPatterns) {
      const match = html.match(pattern);
      if (match) {
        rating = parseInt(match[1], 10);
        break;
      }
    }

    // Extract problems solved — multiple patterns
    let problemsSolved = 0;
    const solvedPatterns = [
      /Total Problems Solved\s*:\s*(\d+)/i,
      /"totalProblemsSolved"\s*:\s*(\d+)/,
      /problems\/solved\?[^"]*"[^>]*>\s*\((\d+)\)/,           // "(123)" next to problems/solved link
      /Fully Solved\s*<\/h5>\s*<\/div>\s*<div[^>]*>\s*(\d+)/i, // Fully Solved heading
      /totalSolved\s*[":]+\s*(\d+)/,
      /class="problems-solved"[^>]*>[\s\S]*?<h5[^>]*>[\s\S]*?<\/h5>\s*<\/div>\s*<div[^>]*>\s*(\d+)/i,
    ];
    for (const pattern of solvedPatterns) {
      const match = html.match(pattern);
      if (match) {
        problemsSolved = parseInt(match[1], 10);
        break;
      }
    }

    // If we still can't find problems solved, try counting the problems list
    if (problemsSolved === 0) {
      // Count unique problem links on the page
      const problemLinks = html.match(/\/problems\/[A-Z0-9_]+/gi);
      if (problemLinks) {
        const uniqueProblems = new Set(problemLinks.map(l => l.toLowerCase()));
        // Only use if we found a reasonable number (filter out nav links etc.)
        if (uniqueProblems.size > 2) {
          problemsSolved = uniqueProblems.size;
        }
      }
    }

    // Extract stars
    let stars = "";
    const starsMatch = html.match(/class="rating"[^>]*>\s*([\d★]+)/);
    if (starsMatch) {
      stars = starsMatch[1];
    }
    if (!stars || stars === "0") {
      stars = getStarsFromRating(rating);
    }
    if (!stars.includes("★")) {
      stars = stars + "★";
    }

    return { rating, problemsSolved, stars };
  } catch (error) {
    console.error(`CodeChef fetch error for ${username}:`, error instanceof Error ? error.message : error);
    return null;
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