import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IPlatformIds {
    leetcodeId?: string;
    codeforcesId?: string;
    codechefId?: string;
    hackerrankId?: string;
}

export interface IStatsCache {
    leetcode?: {
        totalSolved: number;
        easySolved: number;
        mediumSolved: number;
        hardSolved: number;
        contestRating: number;
        contestRanking: number;
    };
    codeforces?: {
        rating: number;
        problemsSolved: number;
        contestRanks: number[];
    };
    codechef?: {
        rating: number;
        problemsSolved: number;
        stars: string;
    };
    hackerrank?: {
        badges: string[];
        problemsSolved: number;
    };
    lastUpdated?: Date;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    college: string;
    platformIds: IPlatformIds;
    xp: number;
    level: number;
    solvedDailyQuestions: mongoose.Types.ObjectId[];
    contestsParticipated: mongoose.Types.ObjectId[];
    statsCache: IStatsCache;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
        college: { type: String, default: "" },
        platformIds: {
            leetcodeId: { type: String, default: "" },
            codeforcesId: { type: String, default: "" },
            codechefId: { type: String, default: "" },
            hackerrankId: { type: String, default: "" },
        },
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        solvedDailyQuestions: [{ type: Schema.Types.ObjectId, ref: "DailyQuestion" }],
        contestsParticipated: [{ type: Schema.Types.ObjectId, ref: "Contest" }],
        statsCache: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON
userSchema.set("toJSON", {
    transform: (_doc, ret) => {
        delete ret.password;
        return ret;
    },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
