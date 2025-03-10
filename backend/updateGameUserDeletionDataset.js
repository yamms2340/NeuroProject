import express from "express";
import User from "./UserModel.js";

const router = express.Router();

router.post("/update-user-dataset-deletion", async (req, res) => {
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

        // ✅ Fix: Use 'email' instead of 'userEmail'
        const updatedUser = await User.findOneAndUpdate(
            { email },  // Corrected
            { $set: { dataset } }, 
            { new: true }
        );

        res.json({ message: "✅ Dataset updated successfully!", dataset: updatedUser.dataset });
    } catch (error) {
        console.error("❌ Error updating dataset:", error);
        res.status(500).json({ message: "❌ Error updating dataset", error: error.message });
    }
});

export default router;
