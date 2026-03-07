import "dotenv/config";
import mongoose from "mongoose";
import Resource from "./models/Resource.js";
import connectDB from "./config/db.js";

const resources = [
    // ===== DATA STRUCTURES > ARRAYS =====
    { title: "Arrays Explained - Full Tutorial", category: "Data Structures > Arrays", youtubeVideoId: "QJNwK2uJyGs", gfgLink: "https://www.geeksforgeeks.org/array-data-structure/", difficulty: "Easy", order: 1 },
    { title: "Kadane's Algorithm - Maximum Subarray", category: "Data Structures > Arrays", youtubeVideoId: "VMtyGnNcdNw", gfgLink: "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/", difficulty: "Medium", order: 2 },
    { title: "Rotate Array - Multiple Approaches", category: "Data Structures > Arrays", youtubeVideoId: "BHr381Guz3Y", gfgLink: "https://www.geeksforgeeks.org/array-rotation/", difficulty: "Easy", order: 3 },
    { title: "Merge Sorted Arrays", category: "Data Structures > Arrays", youtubeVideoId: "P1Ic85RarKY", gfgLink: "https://www.geeksforgeeks.org/merge-two-sorted-arrays/", difficulty: "Medium", order: 4 },

    // ===== DATA STRUCTURES > TWO POINTER =====
    { title: "Two Pointer Technique Explained", category: "Data Structures > Two Pointer", youtubeVideoId: "On03HWe2tZM", gfgLink: "https://www.geeksforgeeks.org/two-pointers-technique/", difficulty: "Easy", order: 1 },
    { title: "Two Sum Problem - Optimal Solution", category: "Data Structures > Two Pointer", youtubeVideoId: "KLlXCFG5TnA", gfgLink: "https://www.geeksforgeeks.org/given-an-array-a-and-a-number-x-check-for-pair-in-a-with-sum-as-x/", difficulty: "Easy", order: 2 },
    { title: "Container With Most Water", category: "Data Structures > Two Pointer", youtubeVideoId: "UuiTKBwPgAo", gfgLink: "https://www.geeksforgeeks.org/container-with-most-water/", difficulty: "Medium", order: 3 },
    { title: "3Sum Problem - Find Triplets", category: "Data Structures > Two Pointer", youtubeVideoId: "jzZsG8n2R9A", gfgLink: "https://www.geeksforgeeks.org/find-a-triplet-that-sum-to-a-given-value/", difficulty: "Medium", order: 4 },

    // ===== DATA STRUCTURES > LINKED LIST =====
    { title: "Linked List Full Course", category: "Data Structures > Linked List", youtubeVideoId: "Hj_rA0dhr2I", gfgLink: "https://www.geeksforgeeks.org/data-structures/linked-list/", difficulty: "Easy", order: 1 },
    { title: "Reverse a Linked List", category: "Data Structures > Linked List", youtubeVideoId: "G0_I-ZF0S38", gfgLink: "https://www.geeksforgeeks.org/reverse-a-linked-list/", difficulty: "Easy", order: 2 },
    { title: "Detect Cycle in Linked List", category: "Data Structures > Linked List", youtubeVideoId: "gBTe7lFR3vc", gfgLink: "https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/", difficulty: "Medium", order: 3 },
    { title: "Merge Two Sorted Linked Lists", category: "Data Structures > Linked List", youtubeVideoId: "XIdigk956u0", gfgLink: "https://www.geeksforgeeks.org/merge-two-sorted-linked-lists/", difficulty: "Medium", order: 4 },

    // ===== DATA STRUCTURES > STACKS & QUEUES =====
    { title: "Stack Data Structure Tutorial", category: "Data Structures > Stacks & Queues", youtubeVideoId: "bxRVz8zklWM", gfgLink: "https://www.geeksforgeeks.org/stack-data-structure/", difficulty: "Easy", order: 1 },
    { title: "Queue Data Structure Explained", category: "Data Structures > Stacks & Queues", youtubeVideoId: "W81jJBkFSGo", gfgLink: "https://www.geeksforgeeks.org/queue-data-structure/", difficulty: "Easy", order: 2 },
    { title: "Next Greater Element using Stack", category: "Data Structures > Stacks & Queues", youtubeVideoId: "68a1Dc_qVq4", gfgLink: "https://www.geeksforgeeks.org/next-greater-element/", difficulty: "Medium", order: 3 },

    // ===== DATA STRUCTURES > TREES =====
    { title: "Binary Tree Bootcamp - Full Course", category: "Data Structures > Trees", youtubeVideoId: "fAAZixBzIAI", gfgLink: "https://www.geeksforgeeks.org/binary-tree-data-structure/", difficulty: "Medium", order: 1 },
    { title: "Binary Search Tree (BST) Complete", category: "Data Structures > Trees", youtubeVideoId: "cySVml6e_Fc", gfgLink: "https://www.geeksforgeeks.org/binary-search-tree-data-structure/", difficulty: "Medium", order: 2 },
    { title: "Tree Traversals (Inorder, Preorder, Postorder)", category: "Data Structures > Trees", youtubeVideoId: "BHB0B1jFKQo", gfgLink: "https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/", difficulty: "Easy", order: 3 },

    // ===== ALGORITHMS > SORTING =====
    { title: "Sorting Algorithms Visualized", category: "Algorithms > Sorting", youtubeVideoId: "pkkFqlG0Hds", gfgLink: "https://www.geeksforgeeks.org/sorting-algorithms/", difficulty: "Easy", order: 1 },
    { title: "Merge Sort Algorithm", category: "Algorithms > Sorting", youtubeVideoId: "4VqmGXwpLqc", gfgLink: "https://www.geeksforgeeks.org/merge-sort/", difficulty: "Medium", order: 2 },
    { title: "Quick Sort Algorithm", category: "Algorithms > Sorting", youtubeVideoId: "Hoixgm4-P4M", gfgLink: "https://www.geeksforgeeks.org/quick-sort/", difficulty: "Medium", order: 3 },

    // ===== ALGORITHMS > BINARY SEARCH =====
    { title: "Binary Search Complete Tutorial", category: "Algorithms > Binary Search", youtubeVideoId: "f6UU7V3szVw", gfgLink: "https://www.geeksforgeeks.org/binary-search/", difficulty: "Easy", order: 1 },
    { title: "Binary Search on Answer Concept", category: "Algorithms > Binary Search", youtubeVideoId: "W9QJ8HaRvJQ", gfgLink: "https://www.geeksforgeeks.org/binary-search-on-answer-tutorial-with-practice-problems/", difficulty: "Medium", order: 2 },
    { title: "Search in Rotated Sorted Array", category: "Algorithms > Binary Search", youtubeVideoId: "U8XENwh8Oy8", gfgLink: "https://www.geeksforgeeks.org/search-an-element-in-a-sorted-and-pivoted-array/", difficulty: "Hard", order: 3 },

    // ===== ALGORITHMS > DYNAMIC PROGRAMMING =====
    { title: "Dynamic Programming for Beginners", category: "Algorithms > Dynamic Programming", youtubeVideoId: "oBt53YbR9Kk", gfgLink: "https://www.geeksforgeeks.org/dynamic-programming/", difficulty: "Medium", order: 1 },
    { title: "0/1 Knapsack Problem", category: "Algorithms > Dynamic Programming", youtubeVideoId: "8LusJS5-AGo", gfgLink: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/", difficulty: "Medium", order: 2 },
    { title: "Longest Common Subsequence", category: "Algorithms > Dynamic Programming", youtubeVideoId: "sSno9rV8Rhg", gfgLink: "https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/", difficulty: "Medium", order: 3 },
    { title: "Coin Change Problem", category: "Algorithms > Dynamic Programming", youtubeVideoId: "H9bfqozjoqs", gfgLink: "https://www.geeksforgeeks.org/coin-change-dp-7/", difficulty: "Medium", order: 4 },

    // ===== ALGORITHMS > GRAPHS =====
    { title: "Graph Theory Full Course", category: "Algorithms > Graphs", youtubeVideoId: "tWVWeAqZ0WU", gfgLink: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/", difficulty: "Medium", order: 1 },
    { title: "BFS and DFS Traversal", category: "Algorithms > Graphs", youtubeVideoId: "pcKY4hjDrxk", gfgLink: "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/", difficulty: "Medium", order: 2 },
    { title: "Dijkstra's Shortest Path Algorithm", category: "Algorithms > Graphs", youtubeVideoId: "pSqmAO-m7Lk", gfgLink: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/", difficulty: "Hard", order: 3 },

    // ===== ALGORITHMS > RECURSION & BACKTRACKING =====
    { title: "Recursion Full Course for Beginners", category: "Algorithms > Recursion & Backtracking", youtubeVideoId: "IJDJ0kBx2LM", gfgLink: "https://www.geeksforgeeks.org/introduction-to-recursion-data-structure-and-algorithm-tutorials/", difficulty: "Easy", order: 1 },
    { title: "N-Queens Problem - Backtracking", category: "Algorithms > Recursion & Backtracking", youtubeVideoId: "i05Ju7AftcM", gfgLink: "https://www.geeksforgeeks.org/n-queen-problem-backtracking-3/", difficulty: "Hard", order: 2 },
    { title: "Subsets and Permutations", category: "Algorithms > Recursion & Backtracking", youtubeVideoId: "REOH22Xwdkk", gfgLink: "https://www.geeksforgeeks.org/write-a-c-program-to-print-all-permutations-of-a-given-string/", difficulty: "Medium", order: 3 },

    // ===== COMPETITIVE PROGRAMMING > TIPS =====
    { title: "How to Start Competitive Programming", category: "Competitive Programming > Getting Started", youtubeVideoId: "bVKHRtafgPc", gfgLink: "https://www.geeksforgeeks.org/how-to-begin-with-competitive-programming/", difficulty: "Easy", order: 1 },
    { title: "Top 10 CP Tricks You Must Know", category: "Competitive Programming > Getting Started", youtubeVideoId: "y7169jEvb-Y", gfgLink: "https://www.geeksforgeeks.org/tips-and-tricks-for-competitive-programmers/", difficulty: "Easy", order: 2 },
];

async function seedResources() {
    await connectDB();

    // Clear existing resources
    await Resource.deleteMany({});
    console.log("🗑️  Cleared existing resources");

    // Insert all
    await Resource.insertMany(resources);
    console.log(`✅ Seeded ${resources.length} resources across ${new Set(resources.map(r => r.category.split(" > ")[0])).size} categories`);

    // Show summary
    const grouped = {};
    for (const r of resources) {
        const [top, sub] = r.category.split(" > ");
        if (!grouped[top]) grouped[top] = {};
        if (!grouped[top][sub]) grouped[top][sub] = 0;
        grouped[top][sub]++;
    }
    for (const [top, subs] of Object.entries(grouped)) {
        console.log(`\n📂 ${top}`);
        for (const [sub, count] of Object.entries(subs)) {
            console.log(`   └── ${sub}: ${count} resources`);
        }
    }

    await mongoose.disconnect();
    process.exit(0);
}

seedResources().catch(err => {
    console.error("❌ Error seeding resources:", err.message);
    process.exit(1);
});
