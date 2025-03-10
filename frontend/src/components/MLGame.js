// MLGame.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../pages/Game.css";
import { useNavigate } from "react-router-dom";
import { handleAnswer, nextQuestion } from "./gameLogic";

function MLGame() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [gameCount, setGameCount] = useState(0);
    const [modelResponse, setModelResponse] = useState(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log("Fetching user...");
        
        axios.get("http://localhost:8080/api/get-user", { withCredentials: true })
            .then(response => {
                console.log("Fetched user response:", response.data); // Log full response
                if (response.data.user) {
                    console.log("User found:", response.data.user);
                    setUser(response.data.user);  
                } else {
                    console.error("User data missing from response:", response.data);
                }
            })
            .catch(error => console.error("Error fetching user:", error));
    }, []);    


    useEffect(() => {
        axios.get("http://localhost:5000/api/initial-questions")
            .then(response => setQuestions(response.data))
            .catch(error => console.error("Error fetching questions:", error));
    }, []);

    if (!questions.length) return <p>Loading questions...</p>;

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
                    {questions.length > 0 ? (
                        <>
                            <div className="MLGame-question">{questions[currentIndex].question}</div>
                            <div className="MLGame-options-container">
                                {questions[currentIndex].options.map((option, index) => (
                                    <button 
                                        key={index} 
                                        className={`MLGame-option ${selectedAnswer !== null 
                                            ? (String(index) === String(questions[currentIndex].answer) ? "MLGame-correct" : "MLGame-incorrect") 
                                            : ""}`}
                                        onClick={() => {
                                            if (!user) {
                                                console.error("User not set yet, preventing answer submission.");
                                                return;
                                            }
                                            handleAnswer(index, questions, currentIndex, user, setFeedback, setSelectedAnswer, setGameCount)}}
                                        disabled={selectedAnswer !== null}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            <div className="MLGame-feedback">{feedback}</div>
                            {selectedAnswer !== null && (
                                <button className="MLGame-next-btn" onClick={() => nextQuestion(currentIndex, questions, gameCount, user, setCurrentIndex, setSelectedAnswer, setFeedback, setModelResponse)}>
                                    Next Question ➡️
                                </button>
                            )}
                        </>
                    ) : (
                        <p>Loading questions...</p>
                    )}
                </div>
                {modelResponse && (
                    <div className="MLGame-model-response">
                        <h3>Model Prediction:</h3>
                        <p>{JSON.stringify(modelResponse)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MLGame;
