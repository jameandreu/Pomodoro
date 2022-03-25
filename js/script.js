"use strict";
const timer = document.querySelector(".timer__clock");
const start = document.querySelector(".btn--start");
const stop = document.querySelector(".btn--stop");
const settings = document.querySelector(".btn--settings");
const close = document.querySelector(".btn--close");
const modal = document.querySelector(".modal__box");
const overlay = document.querySelector(".overlay");
const duration = 25 * 60000; // in ms

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
	timer.innerHTML = `${mins} : ${secs > 9 ? secs : "0" + secs}`;
	// console.log(this);
};
const setEndTime = function () {
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
