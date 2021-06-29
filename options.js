const taskDuration = document.getElementById("taskDuration");
const shortBreakDuration = document.getElementById("shortBreakDuration");
const longBreakDuration = document.getElementById("longBreakDuration");
const setCount = document.getElementById("setCount");
const submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", submitSettings);

function submitSettings(event) {
    let taskDurationValue = Math.round(taskDuration.value);
    taskDurationValue = (taskDurationValue < 1) ? 1 : taskDurationValue;

    let shortBreakDurationValue = Math.round(shortBreakDuration.value);
    shortBreakDurationValue = (shortBreakDurationValue < 1) ? 1 : shortBreakDurationValue;

    let longBreakDurationValue = Math.round(longBreakDuration.value);
    longBreakDurationValue = (longBreakDurationValue < 1) ? 1 : longBreakDurationValue;

    let setCountValue = Math.round(setCount.value);
    setCountValue = (setCountValue < 1) ? 1 : setCountValue;

    chrome.storage.sync.set({
        taskDuration: taskDurationValue,
        shortBreakDuration: shortBreakDurationValue,
        longBreakDuration: longBreakDurationValue,
        setCount: setCountValue
    }, resetFields)
}

function resetFields() {
    chrome.storage.sync.get(["taskDuration", "shortBreakDuration", "longBreakDuration", "setCount"], (e) => {
        taskDuration.value = e.taskDuration;
        shortBreakDuration.value = e.shortBreakDuration;
        longBreakDuration.value = e.longBreakDuration;
        setCount.value = e.setCount;
    });
}

resetFields();