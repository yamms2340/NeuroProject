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
    let mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    let variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
}

// Calculate consistency score
function calculateConsistencyScore(accuracy, timeTaken) {
    if (accuracy.length < 8) {
        console.log("Not enough data for consistency score calculation.");
        return -1;
    }
    let sigmaAccuracy = calculateStandardDeviation(accuracy);
    let sigmaTime = calculateStandardDeviation(timeTaken);
    return 1 - ((sigmaAccuracy + sigmaTime)/2);
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
        let timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds (2 decimal places)

        responseData.push({ accuracy, timeTaken });
    }

    console.log("\nUser Responses:", responseData);

    let accuracyList = responseData.map(item => item.accuracy);
    let timeList = responseData.map(item => parseFloat(item.timeTaken)); // Convert string to float

    let consistencyScore = calculateConsistencyScore(accuracyList, timeList);
    if (consistencyScore !== -1) {
        console.log("Consistency Score:", consistencyScore.toFixed(2));
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
