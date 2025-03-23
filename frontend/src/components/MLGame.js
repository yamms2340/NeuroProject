// MLGame.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../pages/Game.css";
import { fetchUserData } from "./UserGameDataUtils"; // Import function
import { useNavigate } from "react-router-dom";
// Import functions for initial trial questions
import { handleAnswer, nextQuestion } from "./gameLogicaftertrial"; // Import updated logic

function MLGame() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [gameCount, setGameCount] = useState(0);
    const [IQScore, setIQScore] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); 

    // ✅ Fetch user data when component loads
    useEffect(() => {
        fetchUserData(setUser, setIQScore);
    }, []);

    console.log("IQScore" , IQScore);

    // ✅ Fetch a question based on IQScore
    useEffect(() => {
        if (IQScore === null) return; // Wait until IQScore is fetched

        axios.get(`http://localhost:3016/api/ml-random-questions/${IQScore}`)
            .then(response => {
                if (!response.data || response.data.length === 0) {
                    console.warn("⚠️ No questions received from API!");
                }
                setQuestions(response.data || []);
            })
            .catch(error => console.error("❌ Error fetching random question:", error));
    }, [IQScore]);

    if (!questions.length) return <p>Loading questions...</p>;

    const currentQuestion = questions[currentIndex];

    // ✅ Handle answer click
    const handleAnswerClick = (index) => {
        if (!user) {
            console.error("❌ User not set yet, preventing answer submission.");
            return;
        }
        handleAnswer(index, questions, currentIndex, user, setFeedback, setSelectedAnswer, setGameCount, startTime);
    };

    const handleNextQuestion = async () => {
        setFeedback(""); // Clear feedback
        setSelectedAnswer(null); // Reset selected answer

        nextQuestion(
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
        );

        // Call ML model to update IQ after 10 games
        if (gameCount + 1 === 10) {
            try {
                console.log("📡 Calling ML Model to update IQ...");
                const response = await axios.post(
                    "http://localhost:3016/api/call-model",
                    { userId: user._id?.toString() },
                    { headers: { "Content-Type": "application/json" }, withCredentials: true }
                );

                console.log("✅ ML Model Response:", response.data);
                setIQScore(response.data.user.IQScore); // Update IQScore

            } catch (error) {
                console.error("❌ Error updating IQ:", error.response?.data || error.message);
            }
        }
    };   

    return (
        <div className="MLGame-app">
            <div className="MLGame-sidebar">
                <div className="MLGame-sidebar-item"><div className="MLGame-sidebar-icon">🏠</div> Home</div>
                <div className="MLGame-sidebar-item"><div className="MLGame-sidebar-icon">📝</div> Tasks</div>
                <div className="MLGame-sidebar-item active"><div className="MLGame-sidebar-icon">🎮</div> Games</div>
                <div className="MLGame-sidebar-item"><div className="MLGame-sidebar-icon">📅</div> Calendar</div>
                <div className="MLGame-sidebar-item"><div className="MLGame-sidebar-icon">🏆</div> Rewards</div>
            </div>

            <div className="MLGame-main-content">
                <h1>Let's Play a Game!</h1>
                <div className="MLGame-game-container">
                    {questions.length > 0 && questions[currentIndex] ? (
                        <>
                            <div className="MLGame-question">{questions[currentIndex].question}</div>
                            <div className="MLGame-options-container">
                                {questions[currentIndex].options?.map((option, index) => (
                                    <button 
                                        key={index} 
                                        className={`MLGame-option ${selectedAnswer !== null 
                                            ? (String(index) === String(questions[currentIndex].answer) ? "MLGame-correct" : "MLGame-incorrect") 
                                            : ""}`}
                                        onClick={() => handleAnswerClick(index)}
                                        disabled={selectedAnswer !== null}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            <div className="MLGame-feedback">{feedback}</div>
                            {selectedAnswer !== null && (
                                <button className="MLGame-next-btn" onClick={handleNextQuestion}>
                                    Next Question ➡️
                                </button>
                            )}
                        </>
                    ) : (
                        <p>Loading questions...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MLGame;
