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
const btnSound = new Audio("./../../assets/sounds/button-sound.mp3");
const alarmSound = new Audio("./../../assets/sounds/alarm-wood.mp3");
let progressFillArea;
let timer_mode = document.querySelector("#timer-modes");
let cio;
let longBreakInterval = document.querySelector(".input__long-break-interval");
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
	btnAdd.style.color = `var(--${mode})`;
	// btnDel.style.color = `var(--${mode})`;
	initializeClock();
	resetProgressBar();
};
const updateCurrentMode = function (currentMode) {
	console.log(currentMode);
	if (currentMode == "pomodoro") {
		timer.session++;
		console.log(`session: ${timer.session}`);
		if (timer.session < timer.longBreakInterval) {
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
	timer.longBreakInterval = longBreakInterval.value;
	console.log(timer);
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

///////////////////////////
// OOP approach TODO App //
///////////////////////////
const input = document.getElementById("todo__add--input");
const btnAdd = document.getElementById("todo__add--btn");
const btnDel = document.getElementById("todo__list--item-delBtn");
const chkBox = document.getElementById("todo__list--item-checkBox");
const todoListDiv = document.querySelector(".todo__list");

class TodoItem {
	constructor(id, content) {
		this.id = +id.slice(-8);
		this.content = content;
		this.isDone = false;
		this.isDeleted = false;
	}
}

class TodoApp {
	#todos = [];
	#todo;
	constructor() {
		btnAdd.addEventListener("click", this._newTodo.bind(this));
		document.addEventListener("keydown", this._catchEnterKey.bind(this));
		todoListDiv.addEventListener(
			"click",
			this._findClickedElemsOnTodoItem.bind(this)
		);
	}

	_renderTodo(todo) {
		// 	let html = `<div class="todo__list--item flex__parent">
		// 	<input type="checkbox" class="todo__list--item-checkBox">
		// 	<div class="todo__list--item-text">${todo.content}</div><div class="todo__list--item-controls flex__parent">
		// 	<a class="material-icons">more_horiz</a>
		// 	</div>
		// </div>`;

		const todoItem = document.createElement("div");
		const item = document.querySelector(`[data-todo-item-id='${todo.id}']`);

		const isDone = todo.isDone ? "done" : "";
		todoItem.setAttribute("class", `todo__list--item flex__parent`);
		todoItem.setAttribute("data-todo-item-id", todo.id);
		let html = `<input type="checkbox" class="todo__list--item-checkBox">
		<label for="todo__list--item-checkBox" class="todo__list--item-label ${isDone}"></label>
	<div class="todo__list--item-text ${isDone}">${todo.content}</div><div class="todo__list--item-controls flex__parent">
	<a id="todo__list--item-delBtn" class="todo__list--item-delBtn material-icons">close</a>
	</div>`;
		todoItem.insertAdjacentHTML("afterbegin", html);

		if (todo.isDeleted) {
			item.remove();
			return;
		}

		if (item) todoListDiv.replaceChild(todoItem, item);
		else todoListDiv.append(todoItem);
	}
	_findClickedElemsOnTodoItem(e) {
		let itemId;
		const getTodoListItemId = function (e) {
			return e.target.closest(".todo__list--item").dataset.todoItemId;
		};
		if (e.target.classList.contains("todo__list--item-label")) {
			itemId = getTodoListItemId(e);
			this._toggleDone(itemId);
		}
		if (e.target.classList.contains("todo__list--item-delBtn")) {
			itemId = getTodoListItemId(e);
			this._deleteTodo(itemId);
		}
	}
	_catchEnterKey(e) {
		if (e.key !== "Enter") return;
		this._newTodo();
	}
	_deleteTodo(itemId) {
		const index = this._findSelectedItem(itemId);
		this.#todos[index].isDeleted = true; //
		this._renderTodo(this.#todos[index]);
	}
	_toggleDone(itemId) {
		const index = this._findSelectedItem(itemId);

		this.#todos[index].isDone = !this.#todos[index].isDone;
		this._renderTodo(this.#todos[index]);
	}
	_findSelectedItem(itemId) {
		return this.#todos.findIndex((item) => item.id === +itemId);
	}
	_reset() {
		input.value = "";
	}
	_newTodo() {
		let content = input.value;
		let id = Date.now() + "";

		//validation here before creating todoitem object
		if (content === "") {
			return;
		}
		this.#todo = new TodoItem(id, content);

		//add new todo to todos array
		this.#todos.push(this.#todo);

		//render todo div
		this._renderTodo(this.#todo);

		//reset input field
		this._reset();
	}
}

const todoapp = new TodoApp();
