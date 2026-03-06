import { Request, Response } from "express";
import axios from "axios";
import ResourcePath from "../models/ResourcePath.js";

/**
 * Get all resource paths (learning paths) with their topics.
 */
export const getResourcePaths = async (_req: Request, res: Response): Promise<void> => {
    try {
        const paths = await ResourcePath.find().sort({ createdAt: 1 });
        res.json({ paths });
    } catch (error) {
        console.error("Get resource paths error:", error);
        res.status(500).json({ message: "Server error fetching resource paths" });
    }
};

/**
 * Get a single resource path by ID.
 */
export const getResourcePath = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const path = await ResourcePath.findById(id);
        if (!path) {
            res.status(404).json({ message: "Resource path not found" });
            return;
        }
        res.json({ path });
    } catch (error) {
        console.error("Get resource path error:", error);
        res.status(500).json({ message: "Server error fetching resource path" });
    }
};

/**
 * Fetch YouTube videos for a topic's playlist using YouTube Data API v3.
 * Falls back to a direct playlist link if no API key is configured.
 */
export const getTopicVideos = async (req: Request, res: Response): Promise<void> => {
    try {
        const { playlistId } = req.params;

        if (!playlistId) {
            res.status(400).json({ message: "playlistId is required" });
            return;
        }

        const apiKey = process.env.YOUTUBE_API_KEY;

        if (!apiKey) {
            // Fallback: return direct link to playlist
            res.json({
                videos: [],
                playlistUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
                message: "YouTube API key not configured. Use the playlist link directly.",
            });
            return;
        }

        const response = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
            params: {
                part: "snippet,contentDetails",
                playlistId,
                maxResults: 25,
                key: apiKey,
            },
        });

        const videos = response.data.items?.map((item: any) => ({
            title: item.snippet?.title || "",
            description: item.snippet?.description?.substring(0, 200) || "",
            thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || "",
            videoId: item.contentDetails?.videoId || "",
            videoUrl: `https://www.youtube.com/watch?v=${item.contentDetails?.videoId}`,
            publishedAt: item.snippet?.publishedAt || "",
            position: item.snippet?.position || 0,
        })) || [];

        res.json({
            videos,
            playlistUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
            totalResults: response.data.pageInfo?.totalResults || videos.length,
        });
    } catch (error: any) {
        console.error("Get topic videos error:", error.response?.data || error.message);

        // If YouTube API error, return fallback
        if (error.response?.status === 403 || error.response?.status === 400) {
            const { playlistId } = req.params;
            res.json({
                videos: [],
                playlistUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
                message: "YouTube API quota exceeded or invalid request. Use the playlist link directly.",
            });
            return;
        }

        res.status(500).json({ message: "Server error fetching videos" });
    }
};
