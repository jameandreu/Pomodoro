("use strict");

const clock = document.querySelector(".timer__clock");
const timer_controls = document.querySelector(".timer__controls--container");
const start = document.querySelector(".btn--start");
const stop = document.querySelector(".btn--stop");
const settings = document.querySelector(".btn--settings");
const close = document.querySelector(".btn--close");
const confirm = document.querySelector(".btn--confirm");
const modal = document.querySelector(".modal__box");
const overlay = document.querySelector(".overlay");
const progressFill = document.querySelector(".timer__progress--fill");
const btnSound = new Audio("../assets/sounds/button-sound.mp3");
const alarmSound = new Audio("../assets/sounds/alarm-wood.mp3");
let progressFillArea;
let timer_mode = document.querySelector("#timer-modes");
let cio;
let pomodoro = document.querySelector(".input__pomodoro");
let shortBreak = document.querySelector(".input__short-break");
let longBreak = document.querySelector(".input__long-break");
const timer = {
	endTime: 0,
	totalSecsMs: 0,
	totalSecsRemaining: 0,
	pomodoro: 0,
	shortBreak: 0,
	longBreak: 0,
	longBreakInterval: 4,
	currentMode: "pomodoro",
	minsRemaining: function () {
		return Math.floor(this.totalSecsRemaining / 60);
	},
	secsRemaining: function () {
		return this.totalSecsRemaining % 60;
	},
	session: 0,
	isRunning: false,
	isPaused: false,
};

/* converts input into into time units (e.g input: 1(min) **inputs can only be mins, no decimals then adds it or update the timer object**) */
const convertInput = function (inputMins) {
	timer.totalSecsMs = inputMins * 60000;
};

const runProgressBar = function () {
	let computedStyle = getComputedStyle(progressFill);
	let width =
		parseFloat(computedStyle.getPropertyValue("--progressFillWidth")) || 0;
	width += 100 / (progressFillArea / 1000);
	progressFill.style.setProperty(`--progressFillWidth`, width);
};

const resetProgressBar = function () {
	progressFill.style.setProperty(`--progressFillWidth`, 0);
};

const switchMode = function (mode) {
	timer.currentMode = mode;
	document
		.querySelectorAll("a[data-mode]")
		.forEach((e) => e.classList.remove("active"));
	document.querySelector(`[data-mode='${mode}']`).classList.add("active");
	document.body.style.backgroundColor = `var(--${mode})`;
	initializeClock();
	resetProgressBar();
};
const updateCurrentMode = function (currentMode) {
	console.log(currentMode);
	if (currentMode == "pomodoro") {
		timer.session++;
		console.log(`session: ${timer.session}`);
		if (timer.session < 4) {
			switchMode("shortBreak");
		} else {
			console.log(`session: ${timer.session}`);
			switchMode("longBreak");
			timer.session = 0;
		}
	} else {
		switchMode("pomodoro");
	}
};

const setEndTime = function (totalSecsMs) {
	timer.endTime = totalSecsMs + Date.now();
};

const countDown = function (endTime) {
	let timeLeft = Math.round((endTime - Date.now()) / 1000);
	timer.totalSecsRemaining = timeLeft;
	const msg =
		timer.currentMode === "pomodoro" ? "Focus!" : "Keep Calm and Take a Break.";
	document.title = `${timer.minsRemaining().toString().padStart(2, 0)} : ${timer
		.secsRemaining()
		.toString()
		.padStart(2, 0)} - ${msg}`;

	if (timeLeft < 0) {
		timer.isRunning = false;
		clearInterval(cio);
		updateTimer();
		alarmSound.play();
	}
};
const resumeTimer = function (timeLeft) {
	convertInput(timeLeft / 60);
	setEndTime(timer.totalSecsMs);

	cio = setInterval(startTimer, 1000);
};
const startTimer = function (endTime) {
	endTime = timer.endTime;
	timer.isRunning = true;
	runProgressBar();
	countDown(endTime);
	clock.innerText = `${timer
		.minsRemaining()
		.toString()
		.padStart(2, 0)} : ${timer.secsRemaining().toString().padStart(2, 0)}`;
};

const updateTimer = function () {
	clearInterval(cio);
	clock.textContent = "00:00";
	updateCurrentMode(timer.currentMode);
};
const initializeClock = function () {
	clearInterval(cio);
	timer.isRunning = false;
	timer.isPaused = false;
	convertInput(timer[timer.currentMode]);
	progressFillArea = timer.totalSecsMs;
	setEndTime(timer.totalSecsMs);
	countDown(timer.endTime);
	resetProgressBar();
	clock.innerText = `${timer
		.minsRemaining()
		.toString()
		.padStart(2, 0)} : ${timer.secsRemaining().toString().padStart(2, 0)}`;
};

timer_mode.addEventListener("click", function (e) {
	const { mode } = e.target.dataset;
	if (!mode) return;

	switchMode(mode);
	initializeClock();
});
overlay.addEventListener("click", function (e) {
	if (this.classList.contains("fade-in")) {
		this.classList.toggle("fade-in");
		this.classList.toggle("fade-out");
	}
});

timer_controls.addEventListener("click", function (e) {
	const targetClasses = e.target.classList;

	[, , button] = targetClasses;
	// if (!targetClasses.contains("btn")) return;
	!targetClasses.contains("btn") ? false : btnSound.play();
	switch (button) {
		case "btn--start":
			if (!timer.isRunning && timer.isPaused) {
				resumeTimer(timer.totalSecsRemaining);
				timer.isPaused = false;
			} else if (!timer.isRunning && !timer.isPaused) {
				progressFillArea = timer.totalSecsMs;
				convertInput(timer[timer.currentMode]);
				setEndTime(timer.totalSecsMs);
				countDown(timer.endTime);
				cio = setInterval(startTimer, 1000);
			} else {
				console.log("Don't press play while the timer is running");
			}
			break;
		case "btn--stop":
			initializeClock();
			timer.isPaused = false;
			resetProgressBar();
			break;

		case "btn--next":
			initializeClock();
			resetProgressBar();
			updateTimer(timer.currentMode);
			break;

		case "btn--pause":
			clearInterval(cio);
			timer.isRunning = false;
			timer.isPaused = true;
			break;

		default:
			break;
	}
});

settings.addEventListener("click", function () {
	overlay.classList.toggle("hidden");
});

close.addEventListener("click", function () {
	overlay.classList.toggle("hidden");
});
modal.addEventListener("click", function (e) {
	e.stopPropagation();
});

confirm.addEventListener("click", function () {
	timer.pomodoro = pomodoro.value;
	timer.shortBreak = shortBreak.value;
	timer.longBreak = longBreak.value;
	clearInterval(cio);
	initializeClock();
	overlay.classList.toggle("hidden");
});

document.addEventListener(
	"DOMContentLoaded",
	function () {
		timer.pomodoro = 25;
		timer.shortBreak = 5;
		timer.longBreak = 15;
		initializeClock();
	},
	false
);
