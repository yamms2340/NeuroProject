// gameLogic.js
import axios from "axios";

const calculateStandardDeviation = (data) => {
    if (data.length < 2) return 0;
    let mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    let variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
};

const calculateConsistencyScore = (recentAccuracy, recentTime) => {
    if (recentAccuracy.length < 2) return 0;
    let sigmaAccuracy = calculateStandardDeviation(recentAccuracy);
    let sigmaTime = calculateStandardDeviation(recentTime);
    let score = 1 - ((sigmaAccuracy + sigmaTime) / 2);
    return parseFloat(score.toFixed(2));
};

const calculateAverageIQ = (iqRange) => {
    const [low, high] = iqRange.split('-').map(Number);
    return (low + high) / 2;
};

export const handleAnswer = async (index, questions, currentIndex, user, setFeedback, setSelectedAnswer, setGameCount) => {
    if (!user || !user.email) {
        console.error("User data is missing.", user);
        return;
    }
    console.log("✅ User available:", user);

    const currentQuestion = questions[currentIndex];
    let isCorrect = String(index) === String(currentQuestion.answer);
    const accuracy = isCorrect ? 1 : 0;
    // if (!startTime) {
    //     console.error("⚠️ Start time not found! Defaulting to random time.");
    // }
    const endTime = Date.now();
    // const timeTaken = startTime ? ((endTime - startTime) / 1000).toFixed(2) : (Math.random() * 5).toFixed(2);
    const timeTaken = (Math.random() *2).toFixed(2);
    const iqScore = isCorrect ? calculateAverageIQ(currentQuestion.iq) : 0;

    let userData = await axios.get(`http://localhost:5000/api/user-data/${user.email}`);
    let lastResponses = userData.data || [];
    let lastAccuracies = lastResponses.map(r => r.accuracy);
    let lastTimes = lastResponses.map(r => r.timeTaken);
    
    let consistencyScore = calculateConsistencyScore([...lastAccuracies, accuracy], [...lastTimes, timeTaken]);

    let updatedDataset = {
        iqScore, // Example scoring
        accuracy,
        timeTaken,
        consistencyScore,  
        levelProgressionScore: 0,  // Placeholder value
        seenColumn: 0, // Increment question counter
    };

    try {
        const response = await axios.post("http://localhost:8080/api/update-user-dataset", {
            email: user.email, 
            dataset: updatedDataset
        });

        console.log("✅ Dataset sent successfully:", response.data);

        setFeedback(isCorrect ? "Correct! 🎉" : "Wrong answer. Try again!");
        setSelectedAnswer(index);
        setGameCount(prev => prev + 1);
    } catch (error) {
        console.error("Error updating dataset:", error);
    }
};

export const nextQuestion = async (currentIndex, questions, gameCount, user, setCurrentIndex, setSelectedAnswer, setFeedback, setModelResponse) => {
    if (gameCount === 8) {
        try {
            const response = await axios.post("http://localhost:5000/api/call-model", { user });
            setModelResponse(response.data);
        } catch (error) {
            console.error("Error calling ML model:", error);
        }
    }

    if (currentIndex < questions.length - 1) {
        // setStartTime(Date.now());  // ✅ Store the start time when the question is loaded
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setFeedback("");
    } else {
        setFeedback("Quiz completed! 🎊");
    }
};

