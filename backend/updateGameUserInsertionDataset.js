import express from "express";
import User from "./UserModel.js";

const router = express.Router();

// ✅ Make sure this route matches your frontend request!
router.post("/update-user-dataset", async (req, res) => {
    try {
        const { email, dataset } = req.body;

        console.log("Incoming request data:", req.body); // Debugging log
        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (!dataset) {
            return res.status(400).json({ message: "Dataset is required!" });
        }

        console.log("Before update:", user.dataset); // Debugging log

        user.dataset.push(dataset);
        await user.save();

        console.log("After update:", user.dataset); // Debugging log

        res.json({ message: "✅ Dataset updated successfully!", dataset: user.dataset });
    } catch (error) {
        console.error("❌ Error updating dataset:", error);
        res.status(500).json({ message: "❌ Error updating dataset", error: error.message });
    }
});

export default router;
