"use strict";
const timer = document.querySelector(".timer__clock");
const start = document.querySelector(".btn--start");
const stop = document.querySelector(".btn--stop");
const settings = document.querySelector(".btn--settings");
const close = document.querySelector(".btn--close");
const confirm = document.querySelector(".btn--confirm");
const modal = document.querySelector(".modal__box");
const overlay = document.querySelector(".overlay");
let input_pomodoro = document.querySelector(".input__pomodoro").value;
let input_shortBreak = document.querySelector(".input__short-break").value;
let input_longBreak = document.querySelector(".input__long-break").value;
let duration;
// let duration = 1 * 60000; // in ms
let secsLeftms;
let endTime;
let cio;

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
		timer.innerHTML = `${mins > 9 ? mins : "0" + mins} : ${
			secs > 9 ? secs : "0" + secs
		}`;
		console.log(secs);
		console.log(mins);
	} else {
		clearInterval(cio);
	}
};
const setEndTime = function () {
	duration = input_pomodoro * 60000;
	const now = Date.now();
	endTime = now + duration;
	countDown(endTime);
	cio = setInterval(countDown, 1000, endTime);
};
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
	timer.innerText = `00 : 00`;
});

confirm.addEventListener("click", function () {
	input_pomodoro = document.querySelector(".input__pomodoro").value;
	overlay.classList.toggle("hidden");
	console.log(input_pomodoro);
	console.log(input_shortBreak);
	console.log(input_longBreak);
});
