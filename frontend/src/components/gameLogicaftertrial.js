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

export const handleAnswer = async (index, questions, currentIndex, user, setFeedback, setSelectedAnswer, setGameCount, startTime) => {
    if (!user || !user.email) {
        console.error("User data is missing:", user);
        return;
    }

    const currentQuestion = questions[currentIndex];
    let isCorrect = String(index) === String(currentQuestion.answer);
    const accuracy = isCorrect ? 1 : 0;

    const endTime = Date.now();
    const timeTaken = startTime ? ((endTime - startTime) / 1000).toFixed(2) : (Math.random() * 5).toFixed(2);

    const iqScore = isCorrect ? calculateAverageIQ(currentQuestion.iq) : user.IQScore;

    let newResponse = {
        iqScore,
        accuracy,
        timeTaken,
        consistencyScore: 0,
        levelProgressionScore: 0,
        seenColumn: 0,
    };

    try {
        const response = await axios.post("http://localhost:8080/api/update-user-dataset", {
            email: user.email,
            newEntry: newResponse
        });

        console.log("✅ New dataset entry sent successfully:", response.data);
        setFeedback(isCorrect ? "Correct! 🎉" : "Wrong answer. Try again!");
        setSelectedAnswer(index);
        setGameCount(prev => prev + 1);
    } catch (error) {
        console.error("❌ Error updating dataset:", error.response?.data || error.message);
    }
};

export const nextQuestion = async (
    currentIndex,
    questions,
    gameCount,
    user,
    setCurrentIndex,
    setSelectedAnswer,
    setFeedback,
    setStartTime,
    setGameCount,
    setQuestions
) => {
    if (currentIndex >= questions.length - 1) {
        try {
            console.log("📡 Calling ML model for user:", user._id);
            const response = await axios.post(
                "http://localhost:3016/api/call-model",
                { userId: user._id?.toString() },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );
            console.log("✅ ML Model Response:", response.data);
            setFeedback("Today's Quiz completed! 🎊");
        } catch (error) {
            console.error("❌ Error calling ML model:", error.response?.data || error.message);
            setFeedback("Error updating IQ");
        }
        return;
    }

    setStartTime(Date.now());
    setCurrentIndex(currentIndex + 1);
    setSelectedAnswer(null);
    setFeedback("");
};
