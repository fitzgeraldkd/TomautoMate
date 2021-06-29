let checkboxTaskWindow = document.getElementById("taskWindow");
let checkboxBreakWindow = document.getElementById("breakWindow");
let buttonResetWindows = document.getElementById("resetWindows");
let buttonStart = document.getElementById("start");
let buttonStop = document.getElementById("stop");
let currentStatus = document.getElementById("currentStatus")

checkboxTaskWindow.addEventListener("change", addWindow);
checkboxBreakWindow.addEventListener("change", addWindow);
buttonResetWindows.addEventListener("click", resetWindows);
buttonStart.addEventListener("click", startTomautoMate);
buttonStop.addEventListener("click", stopAll);

function addWindow(event) {
    let target = event.target.value;
    let secondary = (target === "task") ? "break" : "task";
    chrome.storage.sync.get(["task", "break"], (e) => {
        let targetWindows = e[target];
        let secondaryWindows = e[secondary];

        chrome.windows.getCurrent({}, (window) => {
            if (event.target.checked) {
                if (!(targetWindows.includes(window.id))) {
                    targetWindows.push(window.id);
                }
                if (secondaryWindows.includes(window.id)) {
                    secondaryWindows.splice(secondaryWindows.indexOf(window.id), 1);
                }
            } else {
                if (targetWindows.includes(window.id)) {
                    targetWindows.splice(targetWindows.indexOf(window.id), 1);
                }
            }
            let results = {};
            results[target] = targetWindows;
            results[secondary] = secondaryWindows;
            chrome.storage.sync.set(results, () => {
                updateSwitches();
            });
        });
    });
}

function resetWindows(event) {
    chrome.storage.sync.set({ "task": [], "break": [] }, () => {
        updateSwitches();
    });
}

function updateSwitches() {
    chrome.storage.sync.get(["task", "break", "status"], (e) => {
        currentStatus.innerHTML = e.status;
        chrome.windows.getCurrent({}, (window) => {
            let isTask = e.task.includes(window.id);
            let isBreak = e.break.includes(window.id);
            checkboxTaskWindow.checked = isTask;
            checkboxBreakWindow.checked = isBreak;
        });
    });
}

function startTomautoMate() {
    chrome.action.setIcon({
        "path": {
            "16": "icons/tomautomate-red16.png",
            "48": "icons/tomautomate-red48.png",
            "128": "icons/tomautomate-red128.png"
        }
    });
    chrome.storage.sync.set({ currentSet: 0, status: "Task Time" });
    chrome.storage.sync.get(["task", "break", "taskDuration"], (e) => {
        for (let id of e.break) {
            chrome.windows.update(id, { state: "minimized" });
        }
        for (let id of e.task) {
            chrome.windows.update(id, { state: "normal" });
        }
        chrome.alarms.create("endTask", { delayInMinutes: e.taskDuration });
    });
}

function stopAll() {
    chrome.alarms.clearAll();
    chrome.action.setIcon({
        "path": {
            "16": "icons/tomautomate-black16.png",
            "48": "icons/tomautomate-black48.png",
            "128": "icons/tomautomate-black128.png"
        }
    });
    chrome.storage.sync.set({ status: "Not Running" });
}

chrome.storage.onChanged.addListener(updateSwitches);

updateSwitches();