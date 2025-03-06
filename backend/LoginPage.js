const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://yaminireddy2023:LAKvtqcdAilizfhk@neurocluster0.utmzr.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // No bcrypt, storing as plain text
  isLogin: { type: String, default:"false"}, 
});
const User = mongoose.model("ers", userSchema);
app.post("/signup", async (req, res) => {
  try {
    console.log("entered..to signup")
    const { name, email, password ,isLogin} = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) return res.status(400).json({ message: "User already exists!" });
    const newUser = new User({ name, email, password,isLogin }); // Directly storing password
    await newUser.save();
    console.log(newUser);

    console.log("added")

    res.status(201).json({ message: "✅ User registered successfully!", user: newUser });
  } catch (error) {
    console.log("found wroro")
    res.status(500).json({ message: "❌ Error signing up", error: error.message });
  }
});
app.put("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(400).json({ message: "User not found!" });
  
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password!" });
      }
  
      user.isLogin ="true";
      await user.save();
  
      res.json({ message: "✅ Login successful!", user });
    } catch (error) {
      res.status(500).json({ message: "❌ Error logging in", error: error.message });
    }
  });
  
app.put("/logout", async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(400).json({ message: "User not found!" });
  
      user.isLogin = "false";
      await user.save();
  
      res.json({ message: "✅ Logout successful!" });
    } catch (error) {
      res.status(500).json({ message: "❌ Error logging out", error: error.message });
    }
  });

  // Check if User Exists & Match Credentials
app.get("/check-user", async (req, res) => {
    try {
      const { email, password } = req.query; // Get email & password from query params
      if (!email || !password) return res.status(400).json({ message: "Email and password are required!" });
  
      const user = await User.findOne({ email });
  
      if (!user) return res.status(404).json({ message: "User not found!" });
  
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials!" });
      }
  
      res.json({ message: "✅ User exists & credentials matched!", user });
    } catch (error) {
      res.status(500).json({ message: "❌ Error checking user", error: error.message });
    }
  });
  
  
app.listen(8080, () => {
    console.log("🚀 Backend LoginPage running..");
  });
