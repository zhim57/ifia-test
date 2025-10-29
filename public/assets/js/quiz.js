/**
 * IFIA Exam Study App
 * Mobile-first quiz application with card flip animations
 */

// State Management
const QuizState = {
    correctAnswer: '',
    currentQuestion: null,
    correctNumber: parseInt(localStorage.getItem('quiz_game_correct')) || 0,
    incorrectNumber: parseInt(localStorage.getItem('quiz_game_incorrect')) || 0,
    nextQuestion: parseInt(localStorage.getItem('quiz_nextQuestion')) || 1,
    wrongAnswers: JSON.parse(localStorage.getItem('quiz_wrong_questions')) || [],
    isProcessing: false,
    totalQuestions: 514
};

// DOM Elements Cache
const Elements = {
    card: null,
    cardFront: null,
    cardBack: null,
    category: null,
    questionNumber: null,
    questionText: null,
    answersContainer: null,
    resultMessage: null,
    correctAnswerDisplay: null,
    progressBar: null,
    currentQuestionDisplay: null,
    totalQuestionsDisplay: null,
    correctCount: null,
    incorrectCount: null,
    percentage: null,
    showResultsBtn: null,
    clearStorageBtn: null,
    modal: null,
    closeModalBtn: null
};

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    cacheDOM();
    attachEventListeners();
    updateScoreDisplay();
    updateProgressBar();
    loadQuestion();
});

/**
 * Cache DOM elements for better performance
 */
function cacheDOM() {
    Elements.card = document.getElementById('card');
    Elements.cardFront = document.querySelector('.card-front');
    Elements.cardBack = document.querySelector('.card-back');
    Elements.category = document.getElementById('category');
    Elements.questionNumber = document.getElementById('question-number');
    Elements.questionText = document.getElementById('question-text');
    Elements.answersContainer = document.getElementById('answers-container');
    Elements.resultMessage = document.getElementById('result-message');
    Elements.correctAnswerDisplay = document.getElementById('correct-answer-display');
    Elements.progressBar = document.getElementById('progress-bar');
    Elements.currentQuestionDisplay = document.getElementById('current-question');
    Elements.totalQuestionsDisplay = document.getElementById('total-questions');
    Elements.correctCount = document.getElementById('correct-count');
    Elements.incorrectCount = document.getElementById('incorrect-count');
    Elements.percentage = document.getElementById('percentage');
    Elements.showResultsBtn = document.getElementById('show-results');
    Elements.clearStorageBtn = document.getElementById('clear-storage');
    Elements.modal = document.getElementById('results-modal');
    Elements.closeModalBtn = document.getElementById('close-modal');
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
    Elements.showResultsBtn.addEventListener('click', showResults);
    Elements.clearStorageBtn.addEventListener('click', confirmClearResults);
    Elements.closeModalBtn.addEventListener('click', closeModal);
    Elements.modal.addEventListener('click', function(e) {
        if (e.target === Elements.modal) {
            closeModal();
        }
    });
}

/**
 * Load question from API
 */
function loadQuestion() {
    if (QuizState.isProcessing) return;

    // Check if quiz is complete
    if (QuizState.nextQuestion > QuizState.totalQuestions) {
        showCompletionScreen();
        return;
    }

    const requestData = {
        table: 'questions',
        condition: `id = ${QuizState.nextQuestion}`,
        culprit: 'quiz.js'
    };

    fetch(`/api/questions01/?${new URLSearchParams(requestData)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                displayQuestion(data[0]);
            } else {
                console.error('No question data received');
            }
        })
        .catch(error => {
            console.error('Error loading question:', error);
            showError('Failed to load question. Please try again.');
        });
}

/**
 * Display question on the card
 */
function displayQuestion(questionData) {
    QuizState.currentQuestion = questionData;
    QuizState.correctAnswer = questionData.answer_correct;

    // Reset card state
    Elements.card.classList.remove('flipped', 'correct', 'incorrect');

    // Update question info
    Elements.category.textContent = questionData.section || 'General';
    Elements.questionNumber.textContent = questionData.ifia_number || `Q${QuizState.nextQuestion}`;
    Elements.questionText.textContent = questionData.question;

    // Create answer options
    const answers = [
        questionData.answer_a,
        questionData.answer_b,
        questionData.answer_c,
        questionData.answer_d
    ];

    Elements.answersContainer.innerHTML = '';

    answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-option';
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(button, answer));
        Elements.answersContainer.appendChild(button);
    });

    // Update displays
    updateProgressBar();
    updateScoreDisplay();
}

/**
 * Handle answer selection
 */
function selectAnswer(button, answer) {
    if (QuizState.isProcessing) return;

    // Remove previous selection
    document.querySelectorAll('.answer-option').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Mark as selected
    button.classList.add('selected');

    // Small delay for visual feedback
    setTimeout(() => {
        checkAnswer(button, answer);
    }, 200);
}

/**
 * Check if answer is correct
 */
function checkAnswer(button, userAnswer) {
    QuizState.isProcessing = true;

    const isCorrect = userAnswer === QuizState.correctAnswer;

    // Get all answer buttons
    const answerButtons = document.querySelectorAll('.answer-option');

    // Highlight correct and incorrect answers
    answerButtons.forEach(btn => {
        if (btn.textContent === QuizState.correctAnswer) {
            btn.classList.add('correct');
        }
        if (btn === button && !isCorrect) {
            btn.classList.add('incorrect');
        }
        // Disable all buttons
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
    });

    // Update score
    if (isCorrect) {
        QuizState.correctNumber++;
        Elements.card.classList.add('correct');
        Elements.resultMessage.innerHTML = '✓ Correct!';
    } else {
        QuizState.incorrectNumber++;
        QuizState.wrongAnswers.push(QuizState.currentQuestion);
        Elements.card.classList.add('incorrect');
        Elements.resultMessage.innerHTML = '✗ Incorrect';
    }

    // Display correct answer on card back
    Elements.correctAnswerDisplay.innerHTML = `
        <strong>Correct Answer:</strong>
        ${QuizState.correctAnswer}
    `;

    // Update displays
    updateScoreDisplay();

    // Save progress
    saveProgress();

    // Flip card with delay for memorization (2.5 seconds)
    setTimeout(() => {
        Elements.card.classList.add('flipped');

        // Load next question after additional delay (2.5 seconds on back)
        setTimeout(() => {
            QuizState.nextQuestion++;
            QuizState.isProcessing = false;
            saveProgress();
            loadQuestion();
        }, 2500);
    }, 500);
}

/**
 * Update score display
 */
function updateScoreDisplay() {
    Elements.correctCount.textContent = QuizState.correctNumber;
    Elements.incorrectCount.textContent = QuizState.incorrectNumber;

    const answered = QuizState.correctNumber + QuizState.incorrectNumber;
    const percentageValue = answered > 0
        ? ((QuizState.correctNumber / answered) * 100).toFixed(1)
        : 0;

    Elements.percentage.textContent = `${percentageValue}%`;
}

/**
 * Update progress bar
 */
function updateProgressBar() {
    const progress = (QuizState.nextQuestion / QuizState.totalQuestions) * 100;
    Elements.progressBar.style.width = `${progress}%`;
    Elements.currentQuestionDisplay.textContent = QuizState.nextQuestion;
    Elements.totalQuestionsDisplay.textContent = QuizState.totalQuestions;
}

/**
 * Save progress to localStorage
 */
function saveProgress() {
    localStorage.setItem('quiz_game_correct', QuizState.correctNumber);
    localStorage.setItem('quiz_game_incorrect', QuizState.incorrectNumber);
    localStorage.setItem('quiz_nextQuestion', QuizState.nextQuestion);
    localStorage.setItem('quiz_wrong_questions', JSON.stringify(QuizState.wrongAnswers));
}

/**
 * Show results modal
 */
function showResults() {
    const answered = QuizState.correctNumber + QuizState.incorrectNumber;
    const remaining = QuizState.totalQuestions - answered;
    const percentageValue = answered > 0
        ? ((QuizState.correctNumber / answered) * 100).toFixed(1)
        : 0;

    // Update modal content
    document.getElementById('modal-answered').textContent = answered;
    document.getElementById('modal-correct').textContent = QuizState.correctNumber;
    document.getElementById('modal-incorrect').textContent = QuizState.incorrectNumber;
    document.getElementById('modal-percentage').textContent = `${percentageValue}%`;

    // Display wrong answers
    const wrongAnswersList = document.getElementById('wrong-answers-list');

    if (QuizState.wrongAnswers.length > 0) {
        wrongAnswersList.innerHTML = '<h3>Questions to Review:</h3>';

        QuizState.wrongAnswers.forEach((question) => {
            const item = document.createElement('div');
            item.className = 'wrong-answer-item';
            item.innerHTML = `
                <div class="question-id">${question.ifia_number}</div>
                <div class="correct-ans">✓ ${question.answer_correct}</div>
            `;
            wrongAnswersList.appendChild(item);
        });
    } else {
        wrongAnswersList.innerHTML = '<p style="text-align: center; color: #4CAF50; font-weight: 600;">Perfect! No wrong answers yet! 🎉</p>';
    }

    // Show modal
    Elements.modal.classList.add('show');
}

/**
 * Close results modal
 */
function closeModal() {
    Elements.modal.classList.remove('show');
}

/**
 * Confirm before clearing results
 */
function confirmClearResults() {
    if (confirm('Are you sure you want to restart the quiz? All progress will be lost.')) {
        clearResults();
    }
}

/**
 * Clear all results and restart
 */
function clearResults() {
    QuizState.correctNumber = 0;
    QuizState.incorrectNumber = 0;
    QuizState.nextQuestion = 1;
    QuizState.wrongAnswers = [];
    QuizState.isProcessing = false;

    saveProgress();

    // Smooth reload
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.reload();
    }, 300);
}

/**
 * Show completion screen
 */
function showCompletionScreen() {
    const percentageValue = QuizState.totalQuestions > 0
        ? ((QuizState.correctNumber / QuizState.totalQuestions) * 100).toFixed(1)
        : 0;

    Elements.cardFront.innerHTML = `
        <div class="completion-screen">
            <h1>🎉 Quiz Complete!</h1>
            <div class="final-score">${percentageValue}%</div>
            <div class="message">
                <p>You answered all ${QuizState.totalQuestions} questions!</p>
                <p><strong>${QuizState.correctNumber}</strong> correct, <strong>${QuizState.incorrectNumber}</strong> incorrect</p>
                <p style="margin-top: 20px;">
                    ${percentageValue >= 90 ? 'Outstanding! You\'re ready for the exam! 🌟' :
                      percentageValue >= 75 ? 'Great job! Keep reviewing to perfect your knowledge. 💪' :
                      percentageValue >= 60 ? 'Good effort! Review the questions you missed. 📚' :
                      'Keep studying! Practice makes perfect. 💡'}
                </p>
            </div>
        </div>
    `;
}

/**
 * Show error message
 */
function showError(message) {
    alert(message);
}

// Add touch event handling for better mobile experience
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    // Swipe gestures can be used for future features
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        // Future: Add swipe to skip or go back functionality
    }
}
