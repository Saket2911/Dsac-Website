import mongoose, { Schema } from "mongoose";

const resourceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    youtubeVideoId: {
        type: String,
        default: ""
    },
    gfgLink: {
        type: String,
        default: ""
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Easy"
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

resourceSchema.index({ category: 1, order: 1 });

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
