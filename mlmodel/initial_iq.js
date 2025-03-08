const fs = require('fs').promises;
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Load questions from JSON file
async function loadQuestions(filename) {
    try {
        const data = await fs.readFile(filename, 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData.assessment_questions;
    } catch (error) {
        console.error("Error loading file:", error);
        return [];
    }
}

// Calculate standard deviation
function calculateStandardDeviation(data) {
    if (data.length < 2) return 0; // Avoid division by zero
    let mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    let variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
}

// Calculate consistency score from last 7 records
function calculateConsistencyScore(recentAccuracy, recentTime) {
    if (recentAccuracy.length < 2) {
        return 0; // First response gets a consistency score of 0
    }
    let sigmaAccuracy = calculateStandardDeviation(recentAccuracy);
    let sigmaTime = calculateStandardDeviation(recentTime);
    let score = 1 - ((sigmaAccuracy + sigmaTime) / 2);
    return parseFloat(score.toFixed(2));
}

// Ask user questions and store results
async function askQuestions(questions) {
    let responseData = [];

    for (const q of questions) {
        console.log("\n" + q.question);
        q.options.forEach(opt => console.log(opt));

        let startTime = new Date().getTime();
        let userAnswer = await askUser("Enter your choice (1-4): ");
        let endTime = new Date().getTime();

        let userChoice = userAnswer.trim();
        let isCorrect = userChoice === q.answer; // Compare option number (e.g., "3")

        let accuracy = isCorrect ? 1 : 0;
        let timeTaken = parseFloat(((endTime - startTime) / 1000).toFixed(2)); // Convert to seconds (2 decimal places)

        // Extract last 7 responses
        let lastResponses = responseData.slice(-7);
        let lastAccuracies = lastResponses.map(r => r.accuracy);
        let lastTimes = lastResponses.map(r => r.timeTaken);

        // Compute consistency score
        let consistencyScore = calculateConsistencyScore([...lastAccuracies, accuracy], [...lastTimes, timeTaken]);

        responseData.push({ accuracy, timeTaken, consistencyScore });

        console.log(`Accuracy: ${accuracy}, Time Taken: ${timeTaken}s, Consistency Score: ${consistencyScore.toFixed(2)}`);
    }

    console.log("\nFinal User Responses:", responseData);
    await saveResultsToCSV(responseData);
}

// Save results to CSV file
async function saveResultsToCSV(results) {
    try {
        let csvContent = "accuracy,timeTaken,consistencyScore\n"; // CSV Header
        
        results.forEach(row => {
            csvContent += `${row.accuracy},${row.timeTaken},${row.consistencyScore}\n`;
        });

        await fs.writeFile('quiz_results.csv', csvContent, 'utf-8');
        console.log("Results saved to quiz_results.csv successfully!");
    } catch (error) {
        console.error("Error saving CSV:", error);
    }
}

// Helper function for user input
function askUser(question) {
    return new Promise(resolve => {
        rl.question(question, answer => resolve(answer));
    });
}

// Main function
async function main() {
    const filename = 'questions.json';
    const questions = await loadQuestions(filename);

    if (questions.length === 0) {
        console.log("No questions found!");
        rl.close();
        return;
    }

    await askQuestions(questions);
    rl.close();
}

main();
