import mongoose, { Schema } from "mongoose";

const specialQuestionSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    platform: {
        type: String,
        required: true,
        enum: ["leetcode", "codeforces", "codechef", "hackerrank", "gfg", "other"]
    },
    problemLink: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 50
    },
    date: {
        type: Date,
        required: true
    },
    solvedUsers: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        solvedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

specialQuestionSchema.index({ date: -1 });

const SpecialQuestion = mongoose.model("SpecialQuestion", specialQuestionSchema);
export default SpecialQuestion;
