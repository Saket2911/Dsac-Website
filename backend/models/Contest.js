import mongoose, { Schema } from "mongoose";
const contestSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ["leetcode", "codeforces", "codechef", "hackerrank", "dsac"],
    },
    contestId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    leaderboard: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        rank: {
          type: Number,
        },
        score: {
          type: Number,
          default: 0,
        },
        username: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);
contestSchema.index(
  {
    platform: 1,
    contestId: 1,
  },
  {
    unique: true,
  },
);
contestSchema.index({
  startTime: -1,
});
const Contest = mongoose.model("Contest", contestSchema);
export default Contest;
