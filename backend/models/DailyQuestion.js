import mongoose, { Schema } from "mongoose";
const dailyQuestionSchema = new Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
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
    description: {
      type: String,
      default: "",
    },
    hints: [
      {
        type: String,
      },
    ],
    date: {
      type: Date,
      required: true,
    },
    solvedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    solvedEntries: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        solvedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    xpReward: {
      type: Number,
      default: 10,
    },
    topicTags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);
dailyQuestionSchema.index(
  {
    date: -1,
  },
  {
    unique: true,
  },
);
const DailyQuestion = mongoose.model("DailyQuestion", dailyQuestionSchema);
export default DailyQuestion;
