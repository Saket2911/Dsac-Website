import mongoose, { Schema, Document } from "mongoose";

export interface ILeaderboardEntry {
    userId: mongoose.Types.ObjectId;
    rank: number;
    score: number;
    username: string;
}

export interface IContest extends Document {
    platform: string;
    contestId: string;
    name: string;
    startTime: Date;
    endTime: Date;
    leaderboard: ILeaderboardEntry[];
    createdAt: Date;
}

const contestSchema = new Schema<IContest>(
    {
        platform: {
            type: String,
            required: true,
            enum: ["leetcode", "codeforces", "codechef", "hackerrank", "dsac"],
        },
        contestId: { type: String, required: true },
        name: { type: String, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        leaderboard: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User" },
                rank: { type: Number },
                score: { type: Number, default: 0 },
                username: { type: String },
            },
        ],
    },
    { timestamps: true }
);

contestSchema.index({ platform: 1, contestId: 1 }, { unique: true });
contestSchema.index({ startTime: -1 });

const Contest = mongoose.model<IContest>("Contest", contestSchema);
export default Contest;
