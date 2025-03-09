import axios from "axios";
import fs from "fs";
import gameDataFile from "./userdata.json" assert { type: "json" };

// Function to call Google Colab model
const callModel = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const colabEndpoint = "https://your-colab-notebook-url"; // Replace with actual Colab API URL
        let gameData = gameDataFile; // Load user data

        if (!gameData[userId]) {
            throw new Error("User data not found");
        }

        // Send user data to Google Colab model
        const response = await axios.post(colabEndpoint, { userData: gameData[userId] });

        console.log("Model Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error calling Google Colab:", error);
        throw new Error("Failed to call the model");
    }
};

export default callModel; // ✅ Use ES module export
