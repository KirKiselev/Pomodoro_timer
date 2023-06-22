//____Selfcorrectштп_timer____

let startTime = 0;
let newTimer = null;

function timer() {
  currentTimeLeft--;
  if (currentTimeLeft <= 0) {
    document.dispatchEvent(new Event("timeisout"));
    return;
  }
  let delay = (Date.now() - startTime) % 1000;
  newTimer = setTimeout(timer, 1000 - delay);
  document.dispatchEvent(new Event("tick"));
}

//____Pomodoro_timer____

document.addEventListener("timeisout", periodController);

let pomodoroDuration = 1500; // default values in seconds
let shortbreakDuration = 300;
let longbreakDuration = 900;

let currentTimeLeft = 0;
let selectedTimer = "pomodoro";
let timerInUse = "";

function startTimer() {
  document.addEventListener("tick", displayTimeLeft);

  if (currentTimeLeft === 0 || timerInUse != selectedTimer) {
    clearTimeout(newTimer);

    switch (selectedTimer) {
      case "pomodoro":
        currentTimeLeft = pomodoroDuration;
        timerInUse = selectedTimer;
        break;
      case "shortbreak":
        currentTimeLeft = shortbreakDuration;
        timerInUse = selectedTimer;
        break;
      case "longbreak":
        currentTimeLeft = longbreakDuration;
        timerInUse = selectedTimer;
        break;
    }
  }

  startTime = Date.now();
  setTimeout(timer, 1000);

  let resetButton = document.querySelector("#reset");
  resetButton.disabled = false;
  let startButton = document.querySelector("#start");
  startButton.innerText = "Stop";
  startButton.onclick = stopTimer;
}

function stopTimer() {
  clearTimeout(newTimer);
  newTimer = null;

  let startButton = document.querySelector("#start");
  startButton.innerText = "Start";
  startButton.onclick = startTimer;
}

function resetTimer() {
  switch (selectedTimer) {
    case "pomodoro":
      currentTimeLeft = pomodoroDuration;
      break;
    case "shortbreak":
      currentTimeLeft = shortbreakDuration;
      break;
    case "longbreak":
      currentTimeLeft = longbreakDuration;
      break;
  }
  displayTimeLeft();
}

function timerSelector() {
  let target = event.target;
  let buttons = document.querySelectorAll(".pomodoroTimer__selector>button");

  buttons.forEach((elem) => (elem.className = "pomodoroTimer__selector__button"));

  target.className = "pomodoroTimer__selector__button--selected";
  selectedTimer = target.id;

  if (selectedTimer == timerInUse) {
    if (newTimer != null) {
      document.addEventListener("tick", displayTimeLeft);
      displayTimeLeft();

      let startButton = document.querySelector("#start");
      startButton.innerText = "Stop";
      startButton.onclick = stopTimer;

      let resetButton = document.querySelector("#reset");
      resetButton.disabled = false;
    } else {
      document.addEventListener("tick", displayTimeLeft);
      displayTimeLeft();

      let startButton = document.querySelector("#start");
      startButton.innerText = "Start";
      startButton.onclick = startTimer;

      let resetButton = document.querySelector("#reset");
      resetButton.disabled = false;
    }
  } else {
    document.removeEventListener("tick", displayTimeLeft);
    displayDefaultTime();

    let startButton = document.querySelector("#start");
    startButton.innerText = "Start";
    startButton.onclick = startTimer;

    let resetButton = document.querySelector("#reset");
    resetButton.disabled = true;
  }
}

function setTimer() {
  let element = document.querySelector(".pomodoroTimer__popup__timeinput");
  if (element.value) {
    if (element.value > 3599) {
      element.value = 3599;
    }
    switch (selectedTimer) {
      case "pomodoro":
        pomodoroDuration = element.value;
        break;
      case "shortbreak":
        shortbreakDuration = element.value;
        break;
      case "longbreak":
        longbreakDuration = element.value;
        break;
    }
    element.value = "";

    hideTimerPopup();
    displayDefaultTime();
  }
}

function displayDefaultTime() {
  let element = document.querySelector(".pomodoroTimer__clockFace");

  function timeFormat(num) {
    let minutes = Math.floor(num / 60).toString();
    let seconds = (num % 60).toString();
    if (minutes.length < 2) {
      minutes = "0" + minutes;
    }
    if (seconds.length < 2) {
      seconds = "0" + seconds;
    }

    return `${minutes}:${seconds}`;
  }

  switch (selectedTimer) {
    case "pomodoro":
      element.innerHTML = timeFormat(pomodoroDuration);
      break;
    case "shortbreak":
      element.innerHTML = timeFormat(shortbreakDuration);
      break;
    case "longbreak":
      element.innerHTML = timeFormat(longbreakDuration);
      break;
  }
}

function displayTimeLeft() {
  let element = document.querySelector(".pomodoroTimer__clockFace");

  function timeFormat(num) {
    let minutes = Math.floor(num / 60).toString();
    let seconds = (num % 60).toString();
    if (minutes.length < 2) {
      minutes = "0" + minutes;
    }
    if (seconds.length < 2) {
      seconds = "0" + seconds;
    }

    return `${minutes}:${seconds}`;
  }

  element.innerHTML = timeFormat(currentTimeLeft);
}

//____Pomodoro_streak____

let defaultPomodorosStreak = 4;

let pomodorosLeft = defaultPomodorosStreak;

function periodController() {
  switch (timerInUse) {
    case "pomodoro":
      if (pomodorosLeft > 1) {
        pomodorosLeft--;
        shortBreak();
      } else {
        pomodorosLeft = defaultPomodorosStreak;
        longBreak();
      }
      break;
    case "shortbreak":
      pomodoro();
      break;
    case "longbreak":
      pomodoro();
      break;
  }
}

function pomodoro() {
  let selectorButton = document.querySelector("#pomodoro");
  let startButton = document.querySelector("#start");
  selectorButton.click();
  startButton.click();
}

function shortBreak() {
  let selectorButton = document.querySelector("#shortbreak");
  let startButton = document.querySelector("#start");
  selectorButton.click();
  startButton.click();
}

function longBreak() {
  let selectorButton = document.querySelector("#longbreak");
  let startButton = document.querySelector("#start");
  selectorButton.click();
  startButton.click();
}

function setStreak() {
  let element = document.querySelector(".pomodoroTimer__popup__streakinput");
  defaultPomodorosStreak = Number.parseInt(element.value);
  pomodorosLeft = defaultPomodorosStreak;
  hideStreakPopup();
}

//____popups____

function showAddTaskPopup() {
  let popup = document.querySelector(".taskList__button__add__popup");
  popup.style.visibility = "visible";
}

function hideAddTaskPopup() {
  let popup = document.querySelector(".taskList__button__add__popup");
  popup.style.visibility = "collapse";
}

function showControlPanelPopup() {
  let popup = document.querySelector(".taskList__controlPanel__popup");
  popup.style.visibility = "visible";
}

function hideControlPanelPopup() {
  let popup = document.querySelector(".taskList__controlPanel__popup");
  popup.style.visibility = "collapse";
}

function showTimerPopup() {
  let popup = document.querySelector(".pomodoroTimer__popup");
  popup.style.visibility = "visible";
}

function hideTimerPopup() {
  let popup = document.querySelector(".pomodoroTimer__popup");
  popup.style.visibility = "collapse";
}

function showStreakPopup() {
  let popup = document.querySelector(".pomodoroStreak__popup");
  popup.style.visibility = "visible";
}

function hideStreakPopup() {
  let popup = document.querySelector(".pomodoroStreak__popup");
  popup.style.visibility = "collapse";
}

//____displaying__tasks____

let taskList = []; // stored tasks
/* every added task stored in taskList array as object 
{status: string "done/undone", name: string, duration: number} */

document.addEventListener("rendertasklist", renderTaskList); // every function, that changes taskList array, generate event for rerender

function setTaskDone() {
  let element = event.target;
  element.className = "taskList__task__status--done";

  element.firstChild.data = "done";
  let position = element.parentElement.key; // key is a current position of "task" in taskList array, key saved in a prop ".key" of parent element
  taskList[position].status = "done";
}

function renderTaskList() {
  function createTaskElement(obj, key) {
    let element = document.createElement("div");
    let taskName = obj.name;
    let taskDuration = obj.duration;

    element.className = "taskList__task";
    element.innerHTML = `<div class="taskList__task__status--${obj.status}" onclick="setTaskDone()">${obj.status}</div><div class="taskList__task__name">${taskName}</div><div class="taskList__task__duration">${taskDuration} pom</div>`;
    element.key = key;

    return element;
  }

  let target = document.querySelector(".taskList__taskContainer");
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }

  if (taskList.length === 0) {
    return;
  }

  taskList.map((elem, i) => {
    target.appendChild(createTaskElement(elem, i));
  });
}

function createNewTask() {
  let popup = document.querySelector(".taskList__button__add__popup");
  let taskName = document.querySelector(".taskList__button__add__popup__taskName");
  let taskDuration = document.querySelector(".taskList__button__add__popup__taskDuration");

  if (taskName.value && taskDuration.value) {
    taskList.push({
      status: "undone",
      name: taskName.value,
      duration: taskDuration.value,
    });

    taskName.value = "";
    taskDuration.value = "";

    document.dispatchEvent(new Event("rendertasklist")); // every function, that changes taskList array, generate event for rerender

    popup.style.visibility = "collapse";
  }
}

function deleteAllTasks() {
  taskList.length = 0;

  document.dispatchEvent(new Event("rendertasklist"));

  hideControlPanelPopup();
}

function deleteCompletedTasks() {
  taskList = taskList.filter((elem) => elem.status === "undone");

  document.dispatchEvent(new Event("rendertasklist"));

  hideControlPanelPopup();
}
