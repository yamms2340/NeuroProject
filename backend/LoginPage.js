import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://yaminireddy2023:LAKvtqcdAilizfhk@neurocluster0.utmzr.mongodb.net/");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isLogin: { type: Boolean, default: false },
  isParent: { type: Boolean, default: false },
  mailMapped: { type: String, default: "" }
});

const User = mongoose.model("ers", userSchema);

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

    const newUser = new User({ name, email, password, isLogin, isParent, mailMapped });
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
