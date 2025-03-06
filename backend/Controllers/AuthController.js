const UserModel =require("../Models/Auser");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken')
const login = async (req, res) => {
    try {
        const {email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(403).json({ 
                message: "Email or pwd is wrong", 
                success: false 
            });
        }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {  
    return res.status(403).json({
        message: "Invalid credentials",  // 
        success: false
     });
  }
    const jwt = require("jsonwebtoken");

   const jwtToken = jwt.sign(
    { email: user.email, _id: user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' }
);
        res.status(201).json({
            message: "login successfully",
            success: true,
            jwtToken,
            email,
            user:user.name,
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal server error in login",
            success: false,

             error:err.message,
            
        });
    }
};
const signup = async (req, res) => {
    try {
        const { name, email, password,isparent } = req.body; // Extract isparent from request body
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ 
                message: "User already exists,U can login", 
                success: false 
            });
        }

        // Create a new user
        const userModel = new UserModel({ name, email, password,isparent});
        userModel.password = await bcrypt.hash(password, 10); // Hash password
        await userModel.save();

        res.status(201).json({
            message: "Signup successfully",
            success: true,

        });

    } catch (err) {
        res.status(500).json({
            message: "Internal.. server error",
            success: false,

             error:err.message,
            
        });
    }
};

module.exports = { signup ,login};
