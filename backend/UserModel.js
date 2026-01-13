import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["parent", "child"],
    required: true
  },

  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ers"
    }
  ],

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ers",
    default: null
  },

  isLogin: { type: Boolean, default: false },

  IQScore: { type: Number, default: 0 },
  TimeTaken: { type: Number, default: 0 },
  AttemptedQuestions: { type: Number, default: 0 },
  CorrectQuestions: { type: Number, default: 0 },

  dataset: {
    type: [Object],
    default: []
  }
});

const User = mongoose.model("ers", userSchema);
export default User;
