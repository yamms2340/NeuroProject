import dataset from './dataset.json' assert { type: 'json' };

const getRandomQuestionsByIQ = (iqScore) => {
    const iq = parseInt(iqScore);
    if (isNaN(iq)) {
        console.log("❌ Invalid IQ score:", iqScore);
        return null;
    }

    console.log(`📡 Fetching questions for IQ: ${iq}`);

    // Check dataset levels
    console.log("📊 Available IQ Ranges:", dataset.dataset.map(entry => entry.iq));

    // Find the matching IQ range object
    const level = dataset.dataset.find(entry => {
        const [low, high] = entry.iq.split('-').map(n => parseInt(n.trim()));
        return iq >= low && iq <= high;
    });

    if (!level) {
        console.log("❌ No matching level found for IQ:", iq);
        return null;
    }

    if (!level.questions || level.questions.length === 0) {
        console.log("❌ No questions available in this level:", level);
        return null;
    }

    // Shuffle and pick 10 random questions
    const shuffledQuestions = [...level.questions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 10);

    console.log(`✅ Found ${selectedQuestions.length} questions for IQ ${iq}`);
    return selectedQuestions;
};

export default getRandomQuestionsByIQ;
