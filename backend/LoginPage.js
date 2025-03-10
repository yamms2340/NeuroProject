import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import updateUserDatasetInsertionRoutes from "./updateGameUserInsertionDataset.js";
import updateUserDatasetDeletionRoutes from "./updateGameUserDeletionDataset.js";
import fetchUserRoutes from "./fetchUserDetails.js";
import User from "./UserModel.js";

mongoose.connect("mongodb+srv://yaminireddy2023:LAKvtqcdAilizfhk@neurocluster0.utmzr.mongodb.net/");

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",  // Allow only frontend origin
  credentials: true                 // Allow cookies/auth headers
}));
app.use(cookieParser());

const PORT = 8080;


// ✅ Use modularized routes
app.use("/api", fetchUserRoutes);
app.use("/api", updateUserDatasetInsertionRoutes);
app.use("/api", updateUserDatasetDeletionRoutes);

app.post("/signup", async (req, res) => {
  try {
    console.log("Entered signup...");
    const { name, email, password, isLogin, isParent, childEmail, childPassword } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: "already" });

    let mailMapped = email;
    if (isParent === true) {
      if (!childEmail || !childPassword) {
        return res.status(400).json({ message: "Child email and password are required" });
      }
      const existingChild = await User.findOne({ email: childEmail });
      if (existingChild) return res.status(400).json({ message: "Child already has an account" });
      mailMapped = email;
    } else {
      return res.status(400).json({ message: "in" });
    }

    // // ✅ Initialize dataset properly
    // const dataset = {
    //   iqScore: 0,
    //   accuracy: 0,
    //   timeTaken: 0,
    //   consistencyScore: 0,
    //   levelProgressionScore: 0,
    //   seenColumn: 1,
    // };

    const newUser = new User({ 
      name,
      email, 
      password, 
      isLogin: false, 
      isParent, 
      mailMapped,
      IQScore: 0,
      TimeTaken: 0,
      AttemptedQuestions: 0,
      CorrectQuestions: 0,
      dataset: [],
    });
    await newUser.save();

    let childUser = null;
    if (isParent === true) {
      childUser = new User({
        name: "Child",
        email: childEmail,
        password: childPassword,
        isLogin: false,
        isParent: false,
        mailMapped: email,
        IQScore: 0,
        TimeTaken: 0,
        AttemptedQuestions: 0,
        CorrectQuestions: 0,
        dataset: [],
      });
      await childUser.save();
    }

    res.status(201).json({
      message: "✅ User registered successfully!",
      user: newUser,
      child: childUser || null,
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "❌ Error signing up", error: error.message });
  }
});

app.put("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found!" });
    if (user.password !== password) return res.status(401).json({ message: "Invalid.. password!" });

    user.isLogin = true;
    await user.save();

     // ✅ Set user email in cookie
    res.cookie("user", email, {
      httpOnly: true,   // Prevents client-side access (security)
      secure: false,    // Change to true if using HTTPS
      sameSite: "Lax",  // Controls cross-site behavior
    });

    res.json({
      message: "success",
      user: {
        name: user.name,
        email: user.email,
        isParent: user.isParent,
        mailMapped: user.mailMapped,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Error logging in", error: error.message });
  }
});

app.put("/logout", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found!" });

    user.isLogin = false;
    await user.save();

    res.json({ message: "✅ Logout successful!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error logging out", error: error.message });
  }
});

app.get("/check-user", async (req, res) => {
  try {
    const { email, password } = req.query;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required!" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found!" });
    if (user.password !== password) return res.status(401).json({ message: "Invalid credentials!" });

    res.json({ message: "✅ User exists & credentials matched!", user });
  } catch (error) {
    res.status(500).json({ message: "❌ Error checking user", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}...`);
});
