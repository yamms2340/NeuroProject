// DOM Elements
const questionEl = document.getElementById('question');
const optionsContainerEl = document.getElementById('options-container');
const feedbackEl = document.getElementById('feedback');
const nextBtnEl = document.getElementById('next-btn');
const waitingContainerEl = document.getElementById('waiting-container');
const celebrationEl = document.getElementById('celebration');

// Game variables
let currentQuestion = null;
let hasAnswered = false;

// Show waiting state initially
function showWaitingState() {
    questionEl.textContent = "Waiting for question...";
    optionsContainerEl.innerHTML = '';
    feedbackEl.textContent = '';
    nextBtnEl.style.display = 'none';
    waitingContainerEl.style.display = 'block';
}

// Load question function
function loadQuestion(questionData) {
    // Hide waiting state
    waitingContainerEl.style.display = 'none';
    
    // Reset state
    hasAnswered = false;
    currentQuestion = questionData;
    
    // Clear previous options and feedback
    optionsContainerEl.innerHTML = '';
    feedbackEl.textContent = '';
    nextBtnEl.style.display = 'none';
    
    // Set question text
    questionEl.textContent = currentQuestion.question;
    
    // Create option buttons
    currentQuestion.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.classList.add('option');
        optionEl.textContent = option;
        optionEl.addEventListener('click', () => checkAnswer(index));
        optionsContainerEl.appendChild(optionEl);
    });
}

// Check answer function
function checkAnswer(selectedIndex) {
    if (hasAnswered || !currentQuestion) return;
    
    const options = document.querySelectorAll('.option');
    
    // Highlight correct and incorrect answers
    options.forEach((option, index) => {
        if (index === currentQuestion.correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    // Update feedback
    if (selectedIndex === currentQuestion.correctIndex) {
        feedbackEl.textContent = "Great job! 🎉";
        
        // Simple animation for correct answer
        const correctOption = options[currentQuestion.correctIndex];
        correctOption.style.transform = 'scale(1.1)';
        setTimeout(() => {
            correctOption.style.transform = 'scale(1)';
        }, 300);
        
        // Show celebration effect
        celebrate();
        
        // Show next button after a delay
        setTimeout(() => {
            nextBtnEl.style.display = 'inline-block';
        }, 1500);
    } else {
        feedbackEl.textContent = "Try again! 💪";
    }
    
    hasAnswered = true;
}

// Celebration effect
function celebrate() {
    celebrationEl.style.display = 'block';
    
    // Create confetti
    for (let i = 0; i < 50; i++) {
        createConfetti();
    }
    
    setTimeout(() => {
        celebrationEl.style.display = 'none';
        celebrationEl.innerHTML = '';
    }, 3000);
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    
    // Random position, color, and animation
    const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const size = Math.random() * 10 + 5;
    
    confetti.style.backgroundColor = randomColor;
    confetti.style.left = `${left}%`;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.opacity = '1';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    celebrationEl.appendChild(confetti);
    
    // Animate
    const animationDuration = Math.random() * 2 + 1;
    confetti.style.animation = `fall ${animationDuration}s linear forwards`;
    
    // Remove after animation
    setTimeout(() => {
        confetti.remove();
    }, animationDuration * 1000);
}

// Event listeners
nextBtnEl.addEventListener('click', () => {
    // Show waiting state when user clicks "Get Next Question"
    showWaitingState();
    
    // Notify parent frame that we need a new question
    if (window.parent) {
        try {
            window.parent.postMessage({ type: 'requestNextQuestion' }, '*');
        } catch (e) {
            console.error('Could not send message to parent frame:', e);
        }
    }
});

// Listen for new questions from parent frame
window.addEventListener('message', (event) => {
    // Check if the message contains a question
    if (event.data && event.data.type === 'newQuestion' && event.data.question) {
        loadQuestion(event.data.question);
    }
});

// Function to set a question directly (for testing or API calls)
window.setQuestion = function(questionData) {
    loadQuestion(questionData);
};

// Show waiting state on load
showWaitingState();

// For testing purposes, load a sample question
setTimeout(() => {
    const sampleQuestion = {
        question: "What color is an apple?",
        options: ["Red", "Blue", "Purple", "Orange"],
        correctIndex: 0
    };
    loadQuestion(sampleQuestion);
}, 1000);