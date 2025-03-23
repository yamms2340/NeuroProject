import express from "express";
import User from "./UserModel.js";

const router = express.Router();

// ✅ Make sure this route matches your frontend request!
router.post("/update-user-dataset", async (req, res) => {
    try {
        console.log("📡 Incoming request to update dataset:", req.body); // Log request body

        const { email, newEntry } = req.body;

        if (!email || !newEntry) {
            console.log("⚠️ Missing email or newEntry in request body.");
            return res.status(400).json({ message: "Missing email or newEntry" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            console.log("⚠️ User not found:", email);
            return res.status(404).json({ message: "User not found" });
        }

        user.dataset.push(newEntry);
        if (user.dataset.length > 30) {
            user.dataset = user.dataset.slice(-30);  
        }

        await user.save();
        console.log("✅ Dataset updated successfully!");

        res.status(200).json({ message: "Dataset updated successfully!", dataset: user.dataset });
    } catch (error) {
        console.error("❌ Error updating dataset:", error);
        res.status(500).json({ message: "Server error" });
    }
});


export default router;
