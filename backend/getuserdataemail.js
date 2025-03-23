// userDataRoutes.js
import express from "express";
import User from "./UserModel.js";

const router = express.Router();

router.get("/user-data/email", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Email parameter is missing." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user by email:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
