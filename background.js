chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        "status": "Not Running",
        "task": [],
        "break": [],
        "taskDuration": 25,
        "shortBreakDuration": 5,
        "longBreakDuration": 15,
        "setCount": 4,
        "currentSet": 0
    });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log(alarm);
    if (alarm.name === "endTask") {
        startBreakTime();
    } else if (alarm.name === "endBreak") {
        startTaskTime();
    }
});

function startTaskTime() {
    chrome.action.setIcon({
        "path": {
            "16": "icons/tomautomate-red16.png",
            "48": "icons/tomautomate-red48.png",
            "128": "icons/tomautomate-red128.png"
        }
    });
    chrome.storage.sync.get(["task", "break", "taskDuration"], (e) => {
        for (let id of e.break) {
            chrome.windows.update(id, { state: "minimized" });
        }
        for (let id of e.task) {
            chrome.windows.update(id, { state: "normal" });
        }
        chrome.alarms.create("endTask", { delayInMinutes: e.taskDuration });
    });
    chrome.storage.sync.set({ status: "Task Time" });
}

function startBreakTime() {
    chrome.action.setIcon({
        "path": {
            "16": "icons/tomautomate-green16.png",
            "48": "icons/tomautomate-green48.png",
            "128": "icons/tomautomate-green128.png"
        }
    });
    chrome.storage.sync.get(["task", "break", "shortBreakDuration", "longBreakDuration", "setCount", "currentSet"], (e) => {
        for (let id of e.task) {
            chrome.windows.update(id, { state: "minimized" });
        }
        for (let id of e.break) {
            chrome.windows.update(id, { state: "normal" });
        }
        let nextSet = (e.currentSet + 1 === e.setCount) ? 0 : e.currentSet + 1;
        let duration = (nextSet === 0) ? e.longBreakDuration : e.shortBreakDuration;
        chrome.alarms.create("endBreak", { delayInMinutes: duration });
        chrome.storage.sync.set({ currentSet: nextSet, status: "Break Time" });
    });
}