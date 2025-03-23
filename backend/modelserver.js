import express from "express";
import cors from "cors";
import fs from "fs";
import mongoose from "mongoose"; 
import User from "./UserModel.js";  // ✅ Ensure correct import
import callModel from "./callmlmodel.js"; // Ensure this file also uses ES modules

const modelApp = express();


modelApp.use(express.json());
// const PORT = 5000;

// //if want to mount on different port, for now it is working on 3016, i.e main servers prt,
// //if want to change change everywhere, down

// Load questions and game data
import questions from "./questions.json" assert { type: "json" };
import gameDataFile from "./userdata.json" assert { type: "json" };
import getRandomQuestionsByIQ from './giverandquesgame.js';

let gameData = gameDataFile;

// API: Get Initial Questions
modelApp.get('/api/initial-questions', (req, res) => {
    res.json(questions.assessment_questions);
});

// API: Handle game responses
modelApp.post('/api/submit-response', (req, res) => {
    const { userId, iqScore, accuracy, timeTaken, consistencyScore, levelProgressionScore, seenColumn } = req.body;

    if (!gameData[userId]) {
        gameData[userId] = [];
    }

    if (gameData[userId].length >= 8) {
        gameData[userId].shift();
    }

    gameData[userId].push({ iqScore, accuracy, timeTaken, consistencyScore, levelProgressionScore, seenColumn });

    fs.writeFileSync("./userdata.json", JSON.stringify(gameData, null, 2));

    res.json({ message: "Response saved!", userData: gameData[userId] });
});


// API: Get User's Last 8 Games
modelApp.get('/api/user-data/:userId', (req, res) => {
    const userId = req.params.userId;
    res.json(gameData[userId] || []);
});



modelApp.post('/api/call-model', async (req, res) => {
    try {
        const { userId } = req.body;

        if ( !userId ||!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid User ID format" });
        }

        const user = await User.findById(String(userId));
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log("📡 Calling ML Model for user:", userId);
        const mlResponse = await callModel(userId);

        if (!mlResponse || mlResponse.error) {
            return res.status(500).json({ error: "ML model failed", details: mlResponse?.error });
        }

        // ✅ Ensure values are numbers
        const IQScore = !isNaN(mlResponse.resultantIQ) ? mlResponse.resultantIQ : 0;
        const TimeTaken = !isNaN(mlResponse.TimeTaken) ? mlResponse.TimeTaken : 0;
        const AttemptedQuestions = !isNaN(mlResponse.AttemptedQuestions) ? mlResponse.AttemptedQuestions : 0;
        const CorrectQuestions = !isNaN(mlResponse.CorrectQuestions) ? mlResponse.CorrectQuestions : 0;

        user.IQScore = IQScore;
        user.TimeTaken = TimeTaken;
        user.AttemptedQuestions = AttemptedQuestions;
        user.CorrectQuestions = CorrectQuestions;

        await user.save();
        console.log("✅ User Updated Successfully:", user); //Debug

        console.log("✅ User Updated Successfully:", user);
        res.json({ message: "User updated successfully", user });

    } catch (err) {
        console.error("❌ Server Error:", err);
        res.status(500).json({ error: err.message });
    }
});


modelApp.get('/api/ml-random-questions/:iqScore', (req, res) => {
    console.time("🔹 Question Fetch Time"); // Start timing

    const { iqScore } = req.params;
    const parsedIQ = parseInt(iqScore);

    console.log(`📡 Received IQ request: ${iqScore}`);

    // Validate IQ Score
    if (isNaN(parsedIQ)) {
        console.log("❌ Invalid IQ score received.");
        console.timeEnd("🔹 Question Fetch Time");
        return res.status(400).json({ error: "Invalid IQ score. Must be a number." });
    }

    // Fetch questions based on IQ Score
    const questions = getRandomQuestionsByIQ(parsedIQ);

    if (!questions || questions.length === 0) {
        console.log("❌ No questions found for this IQ range.");
        console.timeEnd("🔹 Question Fetch Time");
        return res.status(404).json({ error: "No questions available for this IQ score." });
    }

    console.log(`✅ Questions sent: ${questions.length}`);
    console.timeEnd("🔹 Question Fetch Time");

    res.json(questions);
});


modelApp.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});


// Start Server
//use this if want to run on another port
// modelApp.listen(PORT, () => {
//    console.log(`Server running on http://localhost:${PORT}`);
// });


export default modelApp; // ✅ Export the Express app correctly
