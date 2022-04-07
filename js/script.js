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
// let input_pomodoro = document.querySelector(".input__pomodoro").value;
// let input_shortBreak = document.querySelector(".input__short-break").value;
// let input_longBreak = document.querySelector(".input__long-break").value;
let duration;
let secsLeftms;
let endTime;
let cio;
let timer = {
	pomodoro: document.querySelector(".input__pomodoro").value,
	shortBreak: document.querySelector(".input__short-break").value,
	longBreak: document.querySelector(".input__long-break").value,
	longBreakInterval: 4,
};

//function for converting the input to time units then printing it to the element
const countDown = function (endTime) {
	// calculate how many milliseconds is left to reach endTime from now
	secsLeftms = endTime - Date.now(); //secsLeftms = duration = 1500000
	//convert ms to secs
	let secsLeft = Math.round(secsLeftms / 1000);

	// time format
	//convert secs to hours
	// let hours = Math.floor(secsLeft / 3600);

	// convert to mins
	// let mins = Math.floor(secsLeft / 60) - hours * 60;
	let mins = Math.floor(secsLeft / 60);
	let secs = secsLeft % 60;
	if (secs >= 0) {
		clock.innerText = `${mins.toString().padStart(2, 0)} : ${secs
			.toString()
			.padStart(2, 0)}`;
		// `${mins > 9 ? mins : "0" + mins} : ${
		// 	secs > 9 ? secs : "0" + secs
		// }`;
	} else {
		clearInterval(cio);
	}
};

// function for setting the actual end time input * 60000 + date.now
const setEndTime = function () {
	duration = timer.pomodoro * 60000;
	const now = Date.now();
	endTime = now + duration;

	countDown(endTime);

	cio = setInterval(countDown, 1000, endTime);
};

const switchMode = function (mode) {
	document
		.querySelectorAll("a[data-mode]")
		.forEach((e) => e.classList.remove("active"));
	document.querySelector(`[data-mode='${mode}']`).classList.add("active");
};

timer_mode.addEventListener("click", function (e) {
	const { mode } = e.target.dataset;
	if (!mode) return;

	switchMode(mode);
});
overlay.addEventListener("click", function (e) {
	// this.classList.contains("fade-in")
	// 	? this.classList.toggle("fade-in")
	// 	: this.classList.toggle("fade-out");
	if (this.classList.contains("fade-in")) {
		this.classList.toggle("fade-in");
		this.classList.toggle("fade-out");
	}
});
settings.addEventListener("click", function () {
	overlay.classList.toggle("hidden");
	// overlay.classList.contains("fade-in")
	// 	? overlay.classList.toggle("fade-out")
	// 	: overlay.classList.toggle("fade-in");

	// if (this.classList.contains("fade-in")||) {
	// 	this.classList.toggle("fade-in");
	// 	this.classList.toggle("fade-out");
	// }
	// else{

	// }
});

close.addEventListener("click", function () {
	overlay.classList.toggle("hidden");
});
modal.addEventListener("click", function (e) {
	e.stopPropagation();
});
start.addEventListener("click", setEndTime);

stop.addEventListener("click", function () {
	clearInterval(cio);
	clock.innerText = `00 : 00`;
});

confirm.addEventListener("click", function () {
	timer.pomodoro = document.querySelector(".input__pomodoro").value;
	// convertUserInput(input_pomodoro);
	overlay.classList.toggle("hidden");
});
