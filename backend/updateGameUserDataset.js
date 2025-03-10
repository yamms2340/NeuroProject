// updateGameUserDataset.js
import express from "express";
import User from "./UserModel.js"; // Import the user model

const router = express.Router();

router.post("/update-user-dataset", async (req, res) => {
  try {
      const { email, dataset } = req.body;

      if (!email || !dataset) {
          return res.status(400).json({ error: "Missing email or dataset" });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Ensure dataset is an object with user's email as the key
      if (!user.dataset) {
          user.dataset = {};
      }

      // Initialize dataset array if it doesn't exist
      if (!user.dataset[email]) {
          user.dataset[email] = [];
      }

      // Append new dataset entry instead of replacing
      user.dataset[email].push(dataset);

      await user.save();
      res.json({ message: "Dataset updated successfully", dataset: user.dataset[email] });
  } catch (error) {
      console.error("Error updating dataset:", error);
      res.status(500).json({ error: "Error updating dataset" });
  }
});


export default router;
