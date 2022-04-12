"use strict";
const clock = document.querySelector(".timer__clock");
const start = document.querySelector(".btn--start");
const stop = document.querySelector(".btn--stop");
const settings = document.querySelector(".btn--settings");
const close = document.querySelector(".btn--close");
const confirm = document.querySelector(".btn--confirm");
const modal = document.querySelector(".modal__box");
const overlay = document.querySelector(".overlay");
let timer_mode = document.querySelector("#timer-modes");
let cio;
let timer = {
	endTime: 0,
	totalSecsMs: 0,
	totalSecsRemaining: 0,
	pomodoro: 0.05, //document.querySelector(".input__pomodoro").value,
	shortBreak: 0.07, // document.querySelector(".input__short-break").value,
	longBreak: 0.1, //document.querySelector(".input__long-break").value,
	longBreakInterval: 4,
	currentMode: "pomodoro",
	minsRemaining: function () {
		return Math.floor(this.totalSecsRemaining / 60);
	},
	secsRemaining: function () {
		return this.totalSecsRemaining % 60;
	},
	session: 0,
	running: false,
};

const convertInput = function (inputMins) {
	timer.totalSecsMs = inputMins * 60000; // convert input to time unit in mins;
	// timer.totalSecsMs = inputToTime / 1000; // convert to milliseconds then add it to timer object
};
const switchMode = function (mode) {
	timer.currentMode = mode;
	document
		.querySelectorAll("a[data-mode]")
		.forEach((e) => e.classList.remove("active"));
	document.querySelector(`[data-mode='${mode}']`).classList.add("active");
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
		}
	} else {
		// timer.currentMode === "shortBreak" || timer.currentMode === "longBreak";
		switchMode("pomodoro");
	}
};

const setEndTime = function (totalSecsMs) {
	timer.endTime = totalSecsMs + Date.now();
};

const countDown = function (endTime) {
	let timeLeft = Math.round((endTime - Date.now()) / 1000);
	if (timeLeft < 0) {
		clearInterval(cio);
		updateTimer();
		return;
	}
	timer.totalSecsRemaining = timeLeft;

	console.log(timer.totalSecsRemaining);
	console.log(timeLeft);
};
const startTimer = function () {
	countDown(timer.endTime);
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

timer_mode.addEventListener("click", function (e) {
	const { mode } = e.target.dataset;
	if (!mode) return;

	switchMode(mode);
});
overlay.addEventListener("click", function (e) {
	if (this.classList.contains("fade-in")) {
		this.classList.toggle("fade-in");
		this.classList.toggle("fade-out");
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
start.addEventListener("click", function () {
	convertInput(timer[timer.currentMode]);
	setEndTime(timer.totalSecsMs);

	cio = setInterval(startTimer, 1000, timer.endTime);
});

stop.addEventListener("click", function () {
	clearInterval(cio);
	clock.innerText = `00 : 00`;
});

confirm.addEventListener("click", function () {
	timer.pomodoro = document.querySelector(".input__pomodoro").value;
	overlay.classList.toggle("hidden");
});
