import axios from "axios";
import Contest from "../models/Contest.js";
import User from "../models/User.js";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Content-Type": "application/json"
};

/**
 * Fetch contests from Codeforces API.
 */
async function fetchCodeforcesContests() {
  try {
    const res = await axios.get("https://codeforces.com/api/contest.list", {
      timeout: 15000,
      headers: HEADERS
    });
    if (res.data.status !== "OK") return [];
    const contests = [];
    const now = new Date();
    for (const c of res.data.result) {
      if (!c.startTimeSeconds) continue;
      const startTime = new Date(c.startTimeSeconds * 1000);
      const endTime = new Date((c.startTimeSeconds + c.durationSeconds) * 1000);
      let status;
      if (c.phase === "BEFORE") status = "upcoming"; else if (c.phase === "CODING" || c.phase === "PENDING_SYSTEM_TEST") status = "active"; else status = "past";

      // Only include upcoming + recent past (within 30 days)
      const daysDiff = (now.getTime() - endTime.getTime()) / (1000 * 60 * 60 * 24);
      if (status === "past" && daysDiff > 30) continue;
      contests.push({
        name: c.name,
        platform: "codeforces",
        url: `https://codeforces.com/contest/${c.id}`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: c.durationSeconds,
        status
      });
    }
    console.log(`[Contests] Fetched ${contests.length} Codeforces contests (${contests.filter(c => c.status === "upcoming").length} upcoming)`);
    return contests;
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Fetch upcoming LeetCode contests using the official GraphQL API.
 */
async function fetchLeetCodeContests() {
  try {
    const query = {
      query: `
        query {
          topTwoContests {
            title
            titleSlug
            startTime
            duration
          }
        }
      `
    };
    const res = await axios.post("https://leetcode.com/graphql", query, {
      headers: HEADERS,
      timeout: 15000
    });
    const upcomingContests = res.data?.data?.topTwoContests || [];
    const now = new Date();
    const contests = [];
    for (const c of upcomingContests) {
      if (!c.startTime) continue;
      const startTime = new Date(c.startTime * 1000);
      const endTime = new Date((c.startTime + c.duration) * 1000);
      let status;
      if (startTime > now) status = "upcoming"; else if (endTime > now) status = "active"; else status = "past";
      contests.push({
        name: c.title,
        platform: "leetcode",
        url: `https://leetcode.com/contest/${c.titleSlug}/`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: c.duration,
        status
      });
    }
    console.log(`[Contests] Fetched ${contests.length} LeetCode contests`);
    return contests;
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Fetch CodeChef contests — uses Kontests /all endpoint (filtered) with clist.by as fallback.
 */
async function fetchCodeChefContests() {
  // Primary: Kontests /all endpoint filtered to CodeChef
  try {
    const res = await axios.get("https://kontests.net/api/v1/all", {
      timeout: 10000,
      headers: HEADERS
    });
    const now = new Date();
    const contests = [];
    for (const c of res.data || []) {
      const site = (c.site || "").toLowerCase();
      if (!site.includes("codechef") && !site.includes("code_chef")) continue;
      const startTime = new Date(c.start_time);
      const endTime = new Date(c.end_time);
      const duration = Math.max(0, Math.floor((endTime.getTime() - startTime.getTime()) / 1000));
      let status;
      if (c.status === "CODING") status = "active";
      else if (startTime > now) status = "upcoming";
      else status = "past";
      const daysDiff = (now.getTime() - endTime.getTime()) / (1000 * 60 * 60 * 24);
      if (status === "past" && daysDiff > 30) continue;
      contests.push({
        name: c.name,
        platform: "codechef",
        url: c.url || "https://www.codechef.com/",
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        status
      });
    }
    console.log(`[Contests] Fetched ${contests.length} CodeChef contests via Kontests /all`);
    return contests;
  } catch (err) {
    console.warn("[Contests] Kontests /all failed, trying clist.by fallback:", err.message);
  }

  // Fallback: clist.by public API
  try {
    const res = await axios.get(
      "https://clist.by/api/v1/contest/?resource__name=codechef.com&upcoming=true&order_by=start&format=json",
      { timeout: 10000, headers: HEADERS }
    );
    const now = new Date();
    const contests = [];
    for (const c of (res.data?.objects || [])) {
      const startTime = new Date(c.start);
      const endTime = new Date(c.end);
      const duration = Math.max(0, Math.floor((endTime.getTime() - startTime.getTime()) / 1000));
      let status;
      if (startTime > now) status = "upcoming";
      else if (endTime > now) status = "active";
      else status = "past";
      const daysDiff = (now.getTime() - endTime.getTime()) / (1000 * 60 * 60 * 24);
      if (status === "past" && daysDiff > 30) continue;
      contests.push({
        name: c.event,
        platform: "codechef",
        url: c.href || "https://www.codechef.com/",
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        status
      });
    }
    console.log(`[Contests] Fetched ${contests.length} CodeChef contests via clist.by`);
    return contests;
  } catch (error) {
    console.error("Error fetching CodeChef contests (all sources failed):", error.message);
    return [];
  }
}

// --- In-memory cache (60s TTL) ---
let _contestCache = null;
let _contestCacheAt = 0;
const CONTEST_CACHE_TTL_MS = 60 * 1000;

/**
 * GET /api/contests — Fetch upcoming, active, and recent past contests from external platforms.
 */
export const getContests = async (_req, res) => {
  try {
    const now = Date.now();
    if (_contestCache && (now - _contestCacheAt) < CONTEST_CACHE_TTL_MS) {
      console.log("[Contests] Returning cached contest data");
      return res.json(_contestCache);
    }
    // Fetch from all external APIs in parallel
    const [cfContests, lcContests, ccContests] = await Promise.all([fetchCodeforcesContests(), fetchLeetCodeContests(), fetchCodeChefContests()]);
    const allContests = [...cfContests, ...lcContests, ...ccContests];
    const upcoming = allContests.filter(c => c.status === "upcoming").sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).slice(0, 10);
    const active = allContests.filter(c => c.status === "active");
    const past = allContests.filter(c => c.status === "past").sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()).slice(0, 6);
    console.log(`[Contests] Returning ${upcoming.length} upcoming, ${active.length} active, ${past.length} past`);
    const result = { upcoming, active, past };
    _contestCache = result;
    _contestCacheAt = now;
    res.json(result);
  } catch (error) {
    console.error("Get contests error:", error);
    res.status(500).json({
      message: "Server error fetching contests"
    });
  }
};
export const getContestLeaderboard = async (req, res) => {
  try {
    const {
      contestId
    } = req.params;
    const contest = await Contest.findById(contestId).populate("leaderboard.userId", "name email");
    if (!contest) {
      res.status(404).json({
        message: "Contest not found"
      });
      return;
    }
    const sortedLeaderboard = contest.leaderboard.sort((a, b) => a.rank - b.rank);
    res.json({
      contest: {
        name: contest.name,
        platform: contest.platform,
        startTime: contest.startTime,
        endTime: contest.endTime
      },
      leaderboard: sortedLeaderboard
    });
  } catch (error) {
    console.error("Contest leaderboard error:", error);
    res.status(500).json({
      message: "Server error fetching contest leaderboard"
    });
  }
};

/**
 * GET /api/contests/member-count — Return total number of registered users.
 */
export const getMemberCount = async (_req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({
      memberCount: count
    });
  } catch (error) {
    console.error("Member count error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};