import express from "express";
import cors from "cors";
import fs from "fs";
import callModel from "./callmlmodel.js"; // Ensure this file also uses ES modules

const modelApp = express();
modelApp.use(cors());
modelApp.use(express.json());
const PORT = 5000;
// //if want to mount on different port, for now it is working on 3016, i.e main servers prt,
// //if want to change change everywhere, down

// Load questions and game data
import questions from "./questions.json" assert { type: "json" };
import gameDataFile from "./userdata.json" assert { type: "json" };

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

// 🔥 NEW API: Call Google Colab Model using `callModel.js`
modelApp.post('/api/call-model', async (req, res) => {
    const { userId } = req.body;

    try {
        const modelResponse = await callModel(userId);
        res.json(modelResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
modelApp.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


export default modelApp; // ✅ Export the Express app correctly
