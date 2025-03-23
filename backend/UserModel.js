// userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isLogin: { type: Boolean, default: false },
  isParent: { type: Boolean, default: false },
  mailMapped: { type: String, default: "" },
  IQScore: { type: Number, default: 0 },
  TimeTaken: { type: Number, default: 0 },
  AttemptedQuestions: { type: Number, default: 0 },
  CorrectQuestions: { type: Number, default: 0 },
  dataset: {
    type: [Object],
    default: []
    // default: {
    //   iqScore: 0,
    //   accuracy: 0,
    //   timeTaken: 0,
    //   consistencyScore: 0,
    //   levelProgressionScore: 0,
    //   seenColumn: 1, // ✅ Initialize seenColumn as 1
    // },
  },
});

const User = mongoose.model("ers", userSchema);

export default User;
