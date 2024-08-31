let timerElement = document.getElementById('time');
let startButton = document.getElementById('start');
let pauseButton = document.getElementById('pause');
let resetButton = document.getElementById('reset');

let countdown;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isPaused = true;

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateTimer() {
    if (!isPaused && timeLeft > 0) {
        timeLeft--;
        timerElement.innerText = formatTime(timeLeft);
    } else if (timeLeft === 0) {
        clearInterval(countdown);
        alert('时间到！');
    }
}

startButton.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        countdown = setInterval(updateTimer, 1000);
    }
});

pauseButton.addEventListener('click', () => {
    if (!isPaused) {
        isPaused = true;
        clearInterval(countdown);
    }
});

resetButton.addEventListener('click', () => {
    clearInterval(countdown);
    timeLeft = 25 * 60;
    timerElement.innerText = formatTime(timeLeft);
    isPaused = true;
});
