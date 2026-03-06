import "dotenv/config";
import mongoose from "mongoose";
import ResourcePath from "../models/ResourcePath.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dsac";

const defaultPaths = [
    {
        title: "Data Structures",
        description: "Master fundamental data structures used in competitive programming and technical interviews.",
        topics: [
            {
                title: "Arrays & Strings",
                youtubePlaylistId: "PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9",
                difficulty: "beginner",
                order: 1,
                gfgArticleUrl: "https://www.geeksforgeeks.org/array-data-structure/",
                documentationLinks: [
                    "https://www.geeksforgeeks.org/string-data-structure/",
                    "https://leetcode.com/explore/learn/card/array-and-string/",
                ],
            },
            {
                title: "Linked Lists",
                youtubePlaylistId: "PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU",
                difficulty: "beginner",
                order: 2,
                gfgArticleUrl: "https://www.geeksforgeeks.org/data-structures/linked-list/",
                documentationLinks: [
                    "https://leetcode.com/explore/learn/card/linked-list/",
                ],
            },
            {
                title: "Stacks & Queues",
                youtubePlaylistId: "PLgUwDviBIf0oSO572kQ7KCSvCUh1AdILj",
                difficulty: "beginner",
                order: 3,
                gfgArticleUrl: "https://www.geeksforgeeks.org/stack-data-structure/",
                documentationLinks: [
                    "https://www.geeksforgeeks.org/queue-data-structure/",
                ],
            },
            {
                title: "Trees & Binary Trees",
                youtubePlaylistId: "PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk",
                difficulty: "intermediate",
                order: 4,
                gfgArticleUrl: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
                documentationLinks: [
                    "https://www.geeksforgeeks.org/binary-search-tree-data-structure/",
                    "https://leetcode.com/explore/learn/card/data-structure-tree/",
                ],
            },
            {
                title: "Heaps & Priority Queues",
                youtubePlaylistId: "PLgUwDviBIf0oSO572kQ7KCSvCUh1AdILj",
                difficulty: "intermediate",
                order: 5,
                gfgArticleUrl: "https://www.geeksforgeeks.org/heap-data-structure/",
                documentationLinks: [],
            },
            {
                title: "Graphs",
                youtubePlaylistId: "PLgUwDviBIf0oE3Xc5Dv_UG3l_Rp2inqVs",
                difficulty: "advanced",
                order: 6,
                gfgArticleUrl: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
                documentationLinks: [
                    "https://leetcode.com/explore/learn/card/graph/",
                ],
            },
            {
                title: "Hash Maps & Sets",
                youtubePlaylistId: "PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9",
                difficulty: "beginner",
                order: 7,
                gfgArticleUrl: "https://www.geeksforgeeks.org/hashing-data-structure/",
                documentationLinks: [],
            },
            {
                title: "Tries",
                youtubePlaylistId: "PLgUwDviBIf0pcIDCZnMoB_sg_QqDEhXwR",
                difficulty: "advanced",
                order: 8,
                gfgArticleUrl: "https://www.geeksforgeeks.org/trie-insert-and-search/",
                documentationLinks: [],
            },
        ],
    },
    {
        title: "Algorithms",
        description: "Learn essential algorithms from sorting basics to advanced dynamic programming and graph algorithms.",
        topics: [
            {
                title: "Sorting Algorithms",
                youtubePlaylistId: "PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9",
                difficulty: "beginner",
                order: 1,
                gfgArticleUrl: "https://www.geeksforgeeks.org/sorting-algorithms/",
                documentationLinks: [
                    "https://www.geeksforgeeks.org/merge-sort/",
                    "https://www.geeksforgeeks.org/quick-sort/",
                ],
            },
            {
                title: "Searching & Binary Search",
                youtubePlaylistId: "PLgUwDviBIf0pMFMWuuvDNMAkoQFi-h0ZF",
                difficulty: "beginner",
                order: 2,
                gfgArticleUrl: "https://www.geeksforgeeks.org/binary-search/",
                documentationLinks: [],
            },
            {
                title: "Recursion & Backtracking",
                youtubePlaylistId: "PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9",
                difficulty: "intermediate",
                order: 3,
                gfgArticleUrl: "https://www.geeksforgeeks.org/recursion/",
                documentationLinks: [
                    "https://www.geeksforgeeks.org/backtracking-algorithms/",
                ],
            },
            {
                title: "Dynamic Programming",
                youtubePlaylistId: "PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY",
                difficulty: "advanced",
                order: 4,
                gfgArticleUrl: "https://www.geeksforgeeks.org/dynamic-programming/",
                documentationLinks: [
                    "https://leetcode.com/explore/learn/card/dynamic-programming/",
                ],
            },
            {
                title: "Greedy Algorithms",
                youtubePlaylistId: "PLgUwDviBIf0rF1w2Koyh78zafB0cz7tea",
                difficulty: "intermediate",
                order: 5,
                gfgArticleUrl: "https://www.geeksforgeeks.org/greedy-algorithms/",
                documentationLinks: [],
            },
            {
                title: "Graph Algorithms",
                youtubePlaylistId: "PLgUwDviBIf0oE3Xc5Dv_UG3l_Rp2inqVs",
                difficulty: "advanced",
                order: 6,
                gfgArticleUrl: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
                documentationLinks: [
                    "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",
                    "https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/",
                ],
            },
            {
                title: "Bit Manipulation",
                youtubePlaylistId: "PLgUwDviBIf0rnqh8QsJaHyIGhUiMARUAS",
                difficulty: "intermediate",
                order: 7,
                gfgArticleUrl: "https://www.geeksforgeeks.org/bitwise-algorithms/",
                documentationLinks: [],
            },
        ],
    },
    {
        title: "Competitive Programming",
        description: "Advanced topics and strategies for excelling in competitive programming contests.",
        topics: [
            {
                title: "Number Theory",
                youtubePlaylistId: "PLgUwDviBIf0oE3Xc5Dv_UG3l_Rp2inqVs",
                difficulty: "advanced",
                order: 1,
                gfgArticleUrl: "https://www.geeksforgeeks.org/number-theory-competitive-programming/",
                documentationLinks: [],
            },
            {
                title: "Segment Trees",
                youtubePlaylistId: "PLgUwDviBIf0oE3Xc5Dv_UG3l_Rp2inqVs",
                difficulty: "advanced",
                order: 2,
                gfgArticleUrl: "https://www.geeksforgeeks.org/segment-tree-data-structure/",
                documentationLinks: [],
            },
            {
                title: "String Algorithms",
                youtubePlaylistId: "PLgUwDviBIf0pcIDCZnMoB_sg_QqDEhXwR",
                difficulty: "advanced",
                order: 3,
                gfgArticleUrl: "https://www.geeksforgeeks.org/string-data-structure/",
                documentationLinks: [
                    "https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/",
                ],
            },
            {
                title: "Two Pointers & Sliding Window",
                youtubePlaylistId: "PLgUwDviBIf0q7vrFA_HEWcqRqMpCXzYAL",
                difficulty: "intermediate",
                order: 4,
                gfgArticleUrl: "https://www.geeksforgeeks.org/two-pointers-technique/",
                documentationLinks: [
                    "https://www.geeksforgeeks.org/window-sliding-technique/",
                ],
            },
        ],
    },
];

async function seedResources() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing resources
        await ResourcePath.deleteMany({});
        console.log("🗑️  Cleared existing resource paths");

        // Insert default paths
        await ResourcePath.insertMany(defaultPaths);
        console.log(`✅ Seeded ${defaultPaths.length} resource paths with topics`);

        for (const p of defaultPaths) {
            console.log(`   📚 ${p.title}: ${p.topics.length} topics`);
        }

        await mongoose.disconnect();
        console.log("✅ Done. Database disconnected.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed error:", error);
        process.exit(1);
    }
}

seedResources();
