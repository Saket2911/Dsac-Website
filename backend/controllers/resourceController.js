import Resource from "../models/Resource.js";

// Get all resources (public)
export const getAllResources = async (_req, res) => {
    try {
        const resources = await Resource.find().sort({ category: 1, order: 1 });

        // Group by category
        const grouped = {};
        for (const resource of resources) {
            if (!grouped[resource.category]) {
                grouped[resource.category] = [];
            }
            grouped[resource.category].push(resource);
        }

        res.json({ resources, grouped });
    } catch (error) {
        console.error("Get all resources error:", error);
        res.status(500).json({ message: "Server error fetching resources" });
    }
};

// Get resources by category (public)
export const getResourcesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const resources = await Resource.find({ category })
            .sort({ order: 1 });
        res.json({ resources });
    } catch (error) {
        console.error("Get resources by category error:", error);
        res.status(500).json({ message: "Server error fetching resources" });
    }
};
