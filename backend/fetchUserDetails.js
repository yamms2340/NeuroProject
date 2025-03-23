import express from "express";
import User from "./UserModel.js"; // Import the user model

const router = express.Router();


router.get("/get-user", async (req, res) => {
    try {
        console.log("Incoming cookies:", req.cookies);
  
        const email = req.cookies.user; 
        console.log("Extracted email from cookie:", email);
  
        if (!email) return res.status(404).json({ message: "User not found, no email in cookies" });
  
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found in database" });

        console.log("✅ Found user:", user);

        res.json({ user: { 
            _id: user._id,  // Explicitly returning _id 
            email: user.email,
            IQScore: user.IQScore,
            dataset: user.dataset
        }});
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});


export default router;


