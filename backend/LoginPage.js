import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import fetchUserRoutes from "./fetchUserDetails.js";
import updateUserDatasetInsertionRoutes from "./updateGameUserInsertionDataset.js";
import updateUserDatasetDeletionRoutes from "./updateGameUserDeletionDataset.js";
import getUserIQScoreRoutes from "./getUserIQScore.js";
import userDataRoutes from "./getuserdataemail.js";
import User from "./UserModel.js";
import Otp from "./OtpModel.js";
import Brevo from "@getbrevo/brevo";
import "dotenv/config";

// ===============================
// MongoDB
// ===============================
mongoose.connect(process.env.MONGO_URI);

// ===============================
// Brevo
// ===============================
const brevo = new Brevo.TransactionalEmailsApi();
brevo.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

const PORT = 8080;

// ===============================
// Modular routes
// ===============================
app.use("/api", fetchUserRoutes);
app.use("/api", updateUserDatasetInsertionRoutes);
app.use("/api", updateUserDatasetDeletionRoutes);
app.use("/api", getUserIQScoreRoutes);
app.use("/api", userDataRoutes);

// ===============================
// CORE CHILD CREATION (Single Source of Truth)
// ===============================
async function createChildForParent(parent, childEmail, childPassword) {
  const existing = await User.findOne({ email: childEmail });
  if (existing) throw new Error("Child already exists");

  const child = await User.create({
    name: "Child",
    email: childEmail,
    password: childPassword,
    role: "child",
    parent: parent._id,
    isLogin: false,
    IQScore: 0,
    TimeTaken: 0,
    AttemptedQuestions: 0,
    CorrectQuestions: 0,
    dataset: []
  });

  parent.children.push(child._id);
  await parent.save();

  return child;
}

// ===============================
// ADD CHILD (after login)
// ===============================
app.post("/add-child", async (req, res) => {
  try {
    const parentEmail = req.cookies.user;
    if (!parentEmail) return res.status(401).json({ message: "Not logged in" });

    const parent = await User.findOne({ email: parentEmail });
    if (!parent || parent.role !== "parent") {
      return res.status(403).json({ message: "Only parents can add children" });
    }

    const { childEmail, childPassword } = req.body;
    if (!childEmail || !childPassword) {
      return res.status(400).json({ message: "Child email and password required" });
    }

    const child = await createChildForParent(parent, childEmail, childPassword);
    res.status(201).json({ message: "Child added", child });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.get("/my-children", async (req, res) => {
  try {
    const parentEmail = req.cookies.user;
    if (!parentEmail) return res.status(401).json({ message: "Not logged in" });

    const parent = await User.findOne({ email: parentEmail }).populate("children");
    if (!parent || parent.role !== "parent") {
      return res.status(403).json({ message: "Only parents allowed" });
    }

    res.json({ children: parent.children });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch children" });
  }
});

// ===============================
// SIGNUP (Parent + optional first child)
// ===============================
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, isParent, childEmail, childPassword } = req.body;

    if (!isParent) {
      return res.status(400).json({ message: "Only parents can sign up" });
    }

    const otpRecord = await Otp.findOne({ email });
    if (otpRecord) return res.status(400).json({ message: "Verify email first" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Parent already exists" });

    const parent = await User.create({
      name,
      email,
      password,
      role: "parent",
      children: [],
      isLogin: false,
      IQScore: 0,
      TimeTaken: 0,
      AttemptedQuestions: 0,
      CorrectQuestions: 0,
      dataset: []
    });

    let child = null;
    if (childEmail && childPassword) {
      child = await createChildForParent(parent, childEmail, childPassword);
    }

    res.status(201).json({ message: "Signup successful", parent, child });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ===============================
// SEND OTP
// ===============================
app.post("/send-parent-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

    await brevo.sendTransacEmail({
      sender: { email: "yaminireddy2023@gmail.com", name: "NeuroProject" },
      to: [{ email }],
      subject: "Parent Email Verification OTP",
      htmlContent: `<h2>Your OTP: ${otp}</h2><p>Valid for 10 minutes</p>`
    });

    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ message: "OTP failed", error: err.message });
  }
});

// ===============================
// VERIFY OTP
// ===============================
app.post("/verify-parent-otp", async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email, otp });

  if (!record) return res.status(400).json({ message: "Invalid OTP" });
  if (record.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

  await Otp.deleteMany({ email });
  res.json({ message: "verified" });
});

// ===============================
// LOGIN
// ===============================
app.put("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate("parent children");

  if (!user) return res.status(400).json({ message: "User not found" });
  if (user.password !== password) return res.status(401).json({ message: "Invalid password" });

  user.isLogin = true;
  await user.save();
  res.cookie("user", email, { httpOnly: false, sameSite: "Lax" });

  res.json({
    message: "success",
    user: { name: user.name, email: user.email, role: user.role, parent: user.parent, children: user.children }
  });
});

// ===============================
// LOGOUT
// ===============================
app.post("/logout", async (req, res) => {
  const email = req.cookies.user;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Not logged in" });

  user.isLogin = false;
  await user.save();
  res.clearCookie("user");
  res.json({ message: "Logout successful" });
});

// ===============================
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
