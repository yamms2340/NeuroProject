// getUserIQScore.js
import express from "express";
import mongoose from "mongoose";
import User from "./UserModel.js";

const router = express.Router();

// GET /api/user-iqscore/:userId
router.get("/user-iqscore/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate the userId format
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    // Fetch only the IQScore field for the user
    const user = await User.findById(userId).select("IQScore");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ IQScore: user.IQScore });
  } catch (error) {
    console.error("Error fetching user IQ Score:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
