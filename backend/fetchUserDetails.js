import express from "express";
import User from "./UserModel.js"; // Import the user model

const router = express.Router();

router.get("/get-user", async (req, res) => {
    try {
        console.log("Incoming cookies:", req.cookies); // Debugging cookies
  
        const email = req.cookies.user; 
        console.log("Extracted email from cookie:", email); // Debug extracted email
  
        if (!email) return res.status(404).json({ message: "User not found, no email in cookies" });
  
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found in database" });
  
        res.json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
  });
  

export default router;
