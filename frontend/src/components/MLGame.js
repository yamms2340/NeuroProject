import React, { useState, useEffect } from "react";
import axios from "axios";
import "../pages/Game.css";
import { useNavigate } from "react-router-dom";

function MLGame() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [userId] = useState("user123"); // Mock user ID
    const [gameCount, setGameCount] = useState(0);
    const [modelResponse, setModelResponse] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        // Fetch initial questions
        axios.get("http://localhost:3016/api/initial-questions")
            .then(response => setQuestions(response.data))
            .catch(error => console.error("Error fetching questions:", error));
    }, []);

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

    const handleAnswer = async (index) => {
        const currentQuestion = questions[currentIndex];
        let isCorrect = false;
        if (String(index) === String(currentQuestion.answer)){
          isCorrect = true;
        }
        const accuracy = isCorrect ? 1 : 0;
        const timeTaken = (Math.random() * 5).toFixed(2); // Simulate response time
        const iqScore = isCorrect ? calculateAverageIQ(currentQuestion.iq) : 0;

        // Fetch last 8 user responses
        let userData = await axios.get(`http://localhost:3016/api/user-data/${userId}`);
        let lastResponses = userData.data || [];
        let lastAccuracies = lastResponses.map(r => r.accuracy);
        let lastTimes = lastResponses.map(r => r.timeTaken);

        // Calculate consistency
        let consistencyScore = calculateConsistencyScore([...lastAccuracies, accuracy], [...lastTimes, timeTaken]);
        let levelProgressionScore = 0;
        let seenColumn = 0;

        // Send response to backend
        axios.post("http://localhost:3016/api/submit-response", {
            userId,
            iqScore,
            accuracy,
            timeTaken,
            consistencyScore,
            levelProgressionScore,
            seenColumn
        });

        setFeedback(isCorrect ? "Correct! 🎉" : "Wrong answer. Try again!");
        console.log("Selected Option:", index);
        console.log("Correct Answer:", currentQuestion.answer);
        setSelectedAnswer(index);
        setGameCount(prev => prev + 1);
    };

    const nextQuestion = async () => {
        if (gameCount === 8) {
            console.log("Trial games completed. Calling ML model...");

            try {
                const response = await axios.post("http://localhost:3016/api/call-model", { userId });
                setModelResponse(response.data);
            } catch (error) {
                console.error("Error calling ML model:", error);
            }
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setFeedback("");
        } else {
            setFeedback("Quiz completed! 🎊");
        }
    };

    if (!questions.length) return <p>Loading questions...</p>;

    
    return (
      <div className="app">
          {/* Sidebar */}
          <div className="sidebar">
              <div className="sidebar-item"><div className="sidebar-icon">🏠</div> Home</div>
              <div className="sidebar-item"><div className="sidebar-icon">📝</div> Tasks</div>
              <div className="sidebar-item active"><div className="sidebar-icon">🎮</div> Games</div>
              <div className="sidebar-item"><div className="sidebar-icon">📅</div> Calendar</div>
              <div className="sidebar-item"><div className="sidebar-icon">🏆</div> Rewards</div>
          </div>

          {/* Main Content */}
          <div className="main-content">
              <h1>Let's Play a Game!</h1>

              <div className="game-container">
                  {questions.length > 0 ? (
                      <>
                          <div className="question">{questions[currentIndex].question}</div>
                          <div className="options-container">
                              {questions[currentIndex].options.map((option, index) => (
                                  <button 
                                      key={index} 
                                      className={`option ${selectedAnswer !== null 
                                          ? (String(index) === String(questions[currentIndex].answer) ? "correct" : "incorrect") 
                                          : ""}`}
                                      onClick={() => handleAnswer(index)}
                                      disabled={selectedAnswer !== null} // Disable after selection
                                  >
                                      {option}
                                  </button>
                              ))}
                          </div>
                          <div className="feedback">{feedback}</div>
                          
                          {/* Next Question Button (only shown after an answer is selected) */}
                          {selectedAnswer !== null && (
                              <button className="next-btn" onClick={nextQuestion}>
                                  Next Question ➡️
                              </button>
                          )}
                      </>
                  ) : (
                      <p>Loading questions...</p>
                  )}
              </div>

              {/* Display model response after calling ML */}
              {modelResponse && (
                    <div className="model-response">
                        <h3>Model Prediction:</h3>
                        <p>{JSON.stringify(modelResponse)}</p>
                    </div>
                )}
          </div>
      </div>
  );
}

export default MLGame;
