import mongoose, { Schema, Document } from "mongoose";

export interface IQuestModule {
    title: string;
    description: string;
    completed: boolean;
}

export interface IQuest extends Document {
    title: string;
    description: string;
    xpReward: number;
    category: string;
    icon: string;
    modules: IQuestModule[];
    completedUsers: mongoose.Types.ObjectId[];
    prerequisite?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const questSchema = new Schema<IQuest>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        xpReward: { type: Number, required: true, default: 15 },
        category: {
            type: String,
            required: true,
            enum: ["Frontend", "Backend", "DSA", "DevOps", "General"],
        },
        icon: { type: String, default: "🎯" },
        modules: [
            {
                title: { type: String, required: true },
                description: { type: String, default: "" },
                completed: { type: Boolean, default: false },
            },
        ],
        completedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        prerequisite: { type: Schema.Types.ObjectId, ref: "Quest", default: null },
    },
    { timestamps: true }
);

const Quest = mongoose.model<IQuest>("Quest", questSchema);
export default Quest;
