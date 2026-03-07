import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  college: {
    type: String,
    default: ""
  },
  platformIds: {
    leetcodeId: {
      type: String,
      default: ""
    },
    codeforcesId: {
      type: String,
      default: ""
    },
    codechefId: {
      type: String,
      default: ""
    },
    hackerrankId: {
      type: String,
      default: ""
    }
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  solvedDailyQuestions: [{
    type: Schema.Types.ObjectId,
    ref: "DailyQuestion"
  }],
  contestsParticipated: [{
    type: Schema.Types.ObjectId,
    ref: "Contest"
  }],
  statsCache: {
    type: Schema.Types.Mixed,
    default: {}
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  },
  profileImage: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  }
});
const User = mongoose.model("User", userSchema);
export default User;