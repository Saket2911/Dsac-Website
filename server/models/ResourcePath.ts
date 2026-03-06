import mongoose, { Schema, Document } from "mongoose";

export interface ITopic {
    title: string;
    youtubePlaylistId: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    order: number;
    gfgArticleUrl?: string;
    documentationLinks?: string[];
}

export interface IResourcePath extends Document {
    title: string;
    description: string;
    topics: ITopic[];
    createdAt: Date;
}

const topicSchema = new Schema<ITopic>(
    {
        title: { type: String, required: true },
        youtubePlaylistId: { type: String, default: "" },
        difficulty: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner",
        },
        order: { type: Number, default: 0 },
        gfgArticleUrl: { type: String, default: "" },
        documentationLinks: [{ type: String }],
    },
    { _id: true }
);

const resourcePathSchema = new Schema<IResourcePath>(
    {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        topics: [topicSchema],
    },
    { timestamps: true }
);

const ResourcePath = mongoose.model<IResourcePath>("ResourcePath", resourcePathSchema);
export default ResourcePath;
