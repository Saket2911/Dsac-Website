import mongoose, { Schema, Document } from "mongoose";

export interface IDailyQuestion extends Document {
    questionId: string;
    title: string;
    platform: string;
    difficulty: string;
    description: string;
    hints: string[];
    date: Date;
    solvedUsers: mongoose.Types.ObjectId[];
    xpReward: number;
    topicTags: string[];
    createdAt: Date;
}

const dailyQuestionSchema = new Schema<IDailyQuestion>(
    {
        questionId: { type: String, required: true },
        title: { type: String, required: true },
        platform: {
            type: String,
            required: true,
            enum: ["leetcode", "codeforces", "codechef", "hackerrank"],
        },
        difficulty: {
            type: String,
            required: true,
            enum: ["Easy", "Medium", "Hard"],
        },
        description: { type: String, default: "" },
        hints: [{ type: String }],
        date: { type: Date, required: true },
        solvedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        xpReward: { type: Number, default: 10 },
        topicTags: [{ type: String }],
    },
    { timestamps: true }
);

dailyQuestionSchema.index({ date: -1 }, { unique: true });

const DailyQuestion = mongoose.model<IDailyQuestion>("DailyQuestion", dailyQuestionSchema);
export default DailyQuestion;
