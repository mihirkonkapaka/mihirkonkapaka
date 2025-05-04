import checkAnswer from 'https://cdn.jsdelivr.net/npm/qb-answer-checker@1.1.7/dist/main.mjs';
let questionWords = [];
let currentWordIndex = 0;
let readingInterval;
let hasBuzzed = false;
let answeringBonus = false;
let score = 0;
let readyForNext = false;
let wasReading = false; // New flag
let buzzTimerInterval;
let buzzTimeLeft = 0;
let isPaused = false; // NEW
const TOSSUP_TIME_LIMIT = 20; // seconds
const BONUS_TIME_LIMIT = 40; // seconds
var time = 0;
let regularBuzzTime = 0;
let tossupsSeen = 0;
let tossupsCorrect = 0;
let bonusesCorrect = 0;
let negs = 0;

let currentQuestion = {};

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

function blurAll() {
    var tmp = document.createElement("input");
    document.body.appendChild(tmp);
    tmp.focus();
    document.body.removeChild(tmp);
}

document.getElementById('start-button').addEventListener('click', loadAndStartQuestion);
document.getElementById('pause-button').addEventListener('click', pauseReading);
document.getElementById('skip-button').addEventListener('click', handleSkipOrNext);
document.getElementById('buzz-button').addEventListener('click', buzz);
document.getElementById('reset-statistics').addEventListener('click', resetStats);
document.getElementById('submit-answer-button').addEventListener('click', submitAnswer);
document.getElementById('readingSlider').addEventListener('oninput', outputUpdate);

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggle-panel-button");
    const rightPanel = document.getElementById("right-panel");

    toggleButton.addEventListener("click", () => {
        rightPanel.classList.toggle("hidden");
    });
});




async function loadAndStartQuestion() {
    tossupsSeen++;
    document.getElementById('pause-button').textContent = 'Pause';
    readyForNext = false;
    document.getElementById('skip-button').textContent = 'Skip Question';

    clearTimers();

    try {
        const selectedCategory = document.getElementById('category-select').value;
        let questionsPool;

        if (selectedCategory == "any") {
            questionsPool = JSON['questions'];
        } else {
            console.log(selectedCategory.toLowerCase);
            questionsPool = JSON['questions'].filter(q => q.category.toLowerCase() == selectedCategory.toLowerCase());
        }

        if (questionsPool.length === 0) {
            alert(`No questions found for category: ${selectedCategory}`);
            return;
        }

        currentQuestion = questionsPool.random();
        document.getElementById('question-type').textContent = "TOSSUP " + currentQuestion.tossup_format + " " + currentQuestion.category;
        startQuestion(false);
    } catch (error) {
        console.error('Error fetching question:', error);
        alert('Failed to load question. Please try again.');
    }
}


let buzzTimeout;  // ⬅️ new global
const BUZZ_TIME_LIMIT = 10; // seconds to buzz in after tossup starts

function startQuestion(isBonus) {
    answeringBonus = isBonus;
    hasBuzzed = false;
    isPaused = false;

    document.getElementById('answer-result').innerHTML = '';
    document.getElementById('correction-button').classList.add('hidden');
    document.getElementById('answer-section').classList.add('hidden');
    document.getElementById('answer-input').value = '';
    document.getElementById('buzz-button').disabled = false;

    const questionType = isBonus ? 'BONUS' : 'TOSSUP';
    const format = isBonus ? currentQuestion.bonus_format : currentQuestion.tossup_format;
    const category = currentQuestion.category;
    const questionText = isBonus ? currentQuestion.bonus_question : currentQuestion.tossup_question;

    document.getElementById('question-type').textContent = `${questionType} ${format} ${category}`;
    document.getElementById('question-text').textContent = '';

    updateTimerBar(0);
    clearTimers();

    questionWords = questionText.split(' ');
    currentWordIndex = 0;


    let readingDelay = 700 - 6.9 * document.getElementById('readingSlider').value;
    readingInterval = setInterval(() => {
        if (currentWordIndex < questionWords.length) {
            document.getElementById('question-text').textContent += questionWords[currentWordIndex] + ' ';
            currentWordIndex++;
        } else {
            clearInterval(readingInterval);
            startBuzzTimer();
        }
    }, readingDelay);

    hideAnswerResult();
}

function clearTimers() {

    // Clear reading interval (question text reading)
    clearInterval(readingInterval);

    // Clear buzz timer (for the tossup/bonus)
    clearInterval(buzzTimerInterval);

    // Reset the buzz time left
    buzzTimeLeft = 0;

    // Reset question word index
    currentWordIndex = 0;

    // Clear the displayed question text
    document.getElementById('question-text').textContent = '';

    // Reset the timer bar
    updateTimerBar(0);
}

function startBuzzTimer(time = null) {
    regularBuzzTime = answeringBonus ? BONUS_TIME_LIMIT : TOSSUP_TIME_LIMIT;
    let totalBuzzTime;
    if (!time) {
        totalBuzzTime = answeringBonus ? BONUS_TIME_LIMIT : TOSSUP_TIME_LIMIT;
    } else{
        totalBuzzTime = time
    }
    // ✅ Only set if timer hasn't already started
    if (buzzTimeLeft === 0) {
        buzzTimeLeft = totalBuzzTime;
    }

    updateTimerBar(buzzTimeLeft / regularBuzzTime, Math.ceil(buzzTimeLeft));
    clearInterval(buzzTimerInterval);

    buzzTimerInterval = setInterval(() => {
        if (!isPaused) {
            buzzTimeLeft -= 0.1;
            if (buzzTimeLeft <= 0) {
                clearInterval(buzzTimerInterval);
                buzzTimeLeft = 0;
                handleSkipOrNext();
            }
            updateTimerBar(buzzTimeLeft / regularBuzzTime, Math.ceil(buzzTimeLeft));
        }
    }, 100);
}



function handleSkipOrNext() {
    // If it's not ready for the next question, skip the current question
    clearTimers(); // Ensure no timers are running when skipping or passing
    document.getElementById('buzz-button').disabled = false; // Enable buzzing for the next question
    const correctAnswer = answeringBonus ? currentQuestion.bonus_answer : currentQuestion.tossup_answer;
    document.getElementById('question-text').textContent = answeringBonus ? currentQuestion.bonus_question : currentQuestion.tossup_question;

    if (!readyForNext) {
        showAnswerResult(correctAnswer, true);
    }
    // If ready for the next question, load and start the next question
    readyForNext = false; // Reset ready for next state
    loadAndStartQuestion(); // Load a new question
}



function pauseReading() {
    isPaused = !isPaused;
    time = buzzTimeLeft;
    const pauseButton = document.getElementById('pause-button');
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';

    if (isPaused) {
        if (readingInterval) {
            clearInterval(readingInterval);
            wasReading = true;
        } else {
            wasReading = false;
        }
    } else {
        if (wasReading && !hasBuzzed) {
            readingInterval = setInterval(() => {
                if (currentWordIndex < questionWords.length) {
                    document.getElementById('question-text').textContent += questionWords[currentWordIndex] + ' ';
                    currentWordIndex++;
                } else {
                    clearInterval(readingInterval);
                    startBuzzTimer(time);
                }
            }, 300);
        }
    }
}


function buzz() {
    if (hasBuzzed) return;
    hasBuzzed = true;
    document.getElementById('answer-section').classList.remove('hidden');
    document.getElementById('answer-input').focus();

    clearInterval(readingInterval); // ✅ Stop reading if user buzzes early
    clearInterval(buzzTimerInterval); // ✅ Stop buzz timer if it started
    document.getElementById('buzz-button').disabled = true;
    hideAnswerResult();

    startAnswerTimer(); // ✅ Start 5s answer timer
}



function startAnswerTimer() {
    buzzTimeLeft = 5;
    updateTimerBar(1);

    // Clear any existing timer before starting the new one
    clearInterval(buzzTimerInterval);

    buzzTimerInterval = setInterval(() => {
        if (!isPaused) {
            buzzTimeLeft -= 0.1;
            updateTimerBar(buzzTimeLeft / 5);

            if (buzzTimeLeft <= 0) {
                clearInterval(buzzTimerInterval);
                if (!readyForNext) {
                    submitAnswer();
                }
            }
        }
    }, 100);
}



function submitAnswer() {
    document.getElementById('answer-section').classList.add('hidden');
    let finishedTossup = (currentWordIndex == questionWords.length);
    clearInterval(buzzTimerInterval);
    updateTimerBar(0); // Clear timer bar

    const playerAnswer = document.getElementById('answer-input').value.trim();
    const correctAnswer = answeringBonus ? currentQuestion.bonus_answer : currentQuestion.tossup_answer;
    const isCorrect = validateAnswer(playerAnswer, correctAnswer);

    document.getElementById('answer-input').value = ""

    showAnswerResult(correctAnswer, isCorrect);

    if (isCorrect) {
        if (answeringBonus) {
            score += 10;
            bonusesCorrect++;
        } else {
            score += 4;
            tossupsCorrect++;
        }
    } else {
        if (!answeringBonus && !finishedTossup){ 
            score -= 4;
            negs++;
        }
    }

    document.getElementById('correction-button').innerHTML = `<button onclick="correctScore(${isCorrect})" class="btn ${isCorrect ? 'red' : 'green'}-btn">${isCorrect ? 'I was wrong' : 'I was correct'}</button>`;
    document.getElementById('correction-button').classList.remove('hidden');

    readyForNext = true;
    document.getElementById('skip-button').textContent = 'Next Question';

    if (!answeringBonus && isCorrect) {
        answeringBonus = true;
        setTimeout(() => startQuestion(true), Math.min(5000, (500 + 75 * currentQuestion.tossup_answer.split(' ').length)));
    }

    updateScore();
}


function validateAnswer(playerAnswer, correctAnswer) {
    playerAnswer = sanitizeResponse(playerAnswer.trim()).toUpperCase();
    correctAnswer = sanitizeResponse(correctAnswer.trim()).toUpperCase();
    const cleanedCorrectAnswer = correctAnswer.replace(/\(.*?\)/g, '').trim();

    const format = answeringBonus ? currentQuestion.bonus_format : currentQuestion.tossup_format;

    if (format === "Short Answer") {
        return (checkAnswer(correctAnswer, playerAnswer).directive == 'accept');
    } else {
        const correctLetter = cleanedCorrectAnswer.charAt(0);
        const correctLabel = cleanedCorrectAnswer.slice(3).trim().toUpperCase();

        return playerAnswer === correctLetter || playerAnswer === correctLabel;
    }
}


function similarity(s1, s2) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    const costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function correctScore(wasCorrect) {
    if (wasCorrect) {
        score -= answeringBonus ? 10 : 8;
    } else {
        score += answeringBonus ? 10 : 8;
        if (!answeringBonus) {
            setTimeout(() => startQuestion(true), 1000);
        }
    }
    updateScore();
    document.getElementById('correction-button').classList.add('hidden');
}

function updateScore() {
    document.getElementById('score-display').textContent = `${bonusesCorrect}/${tossupsCorrect}/${negs} with ${tossupsSeen} tossups seen`;
}

function showAnswerResult(correctAnswer, isCorrect) {
    const resultDiv = document.getElementById('answer-result');
    resultDiv.textContent = `Correct Answer: ${correctAnswer}`;

    if (answeringBonus) {
        document.getElementById("question-text").textContent = currentQuestion.bonus_question;
    } else {
        document.getElementById("question-text").textContent = currentQuestion.tossup_question;
    }

    resultDiv.className = isCorrect ? 'correct' : 'incorrect';
}


function hideAnswerResult() {
    document.getElementById('answer-result').innerHTML = '';
    document.getElementById('answer-result').className = 'hidden';
    document.getElementById('correction-button').classList.add('hidden');
}

function sanitizeMathBackticks(text) {
    return text.replace(/`([^`]+)`/g, (match, p1) => {
        const escaped = p1
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        return '`' + escaped + '`';
    });
}

function displayQuestion(text) {
    const questionSection = document.getElementById('question-section');
    const sanitizedText = sanitizeMathBackticks(text);
    questionSection.innerHTML = sanitizedText;
    if (window.MathJax) {
        MathJax.typesetPromise([questionSection]);
    }
}

function startTimerBar(durationSeconds) {
    const bar = document.getElementById('timer-bar');
    bar.style.transition = 'none';
    bar.style.width = '100%';
    setTimeout(() => {
        bar.style.transition = `width ${durationSeconds}s linear`;
        bar.style.width = '0%';
    }, 50);
}

function updateTimerBar(progress, timeLeftSeconds = null) {
    const timerBar = document.getElementById('timer-bar');
    const timerText = document.getElementById('timer-text');

    timerBar.style.width = `${progress * 100}%`;

    if (timeLeftSeconds !== null) {
        timerText.textContent = Math.ceil(timeLeftSeconds);
    } else {
        timerText.textContent = "";
    }
}

document.addEventListener("keydown", function (event) {
    // Check if the user is focused on the answer input field
    const isAnswerInputFocused = document.getElementById('answer-input') === document.activeElement;

    // If the user is focused on the answer input field, don't process keybinds
    if (isAnswerInputFocused) {
        switch (event.key) {
            case "Enter":
                if (!document.getElementById('answer-section').classList.contains('hidden')) {
                    document.getElementById("submit-answer-button").click();
                    blurAll(); // Submit button
                }
                break;
            default:
                break;
        }
        return;
    }

    switch (event.key) {
        case "s":
            document.getElementById("start-button").click(); // Start button
            break;
        case "n":
            document.getElementById("skip-button").click(); // Skip button
            break;
        case "p":
            document.getElementById("pause-button").click(); // Pause button
            break;
        case " ":
            document.getElementById("buzz-button").click(); // Buzz button
            break;
        default:
            break;
    }
});

function resetStats() {
    score = 0;
    updateScore();
}

function sanitizeResponse(response) {
    return response.replace(/`/g, "")
}

function outputUpdate() {
    console.log('update!');
    document.getElementById('readingValue').innerText = document.getElementById('readingSlider').value;
}
