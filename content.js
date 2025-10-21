let timerStarted = false;

//start timer
function startTimer() {
    if (!timerStarted) {
        chrome.runtime.sendMessage({ action: "start" });
        timerStarted = true;
        console.log("⏱ Timer started from content script.");
    }
}

//text selection listener
document.addEventListener('mouseup', () => {
    const selection = window.getSelection();
    if (!selection) return;

    const text = selection.toString().trim();
    if (!text) return;

    startTimer();
    chrome.runtime.sendMessage({ type: 'selected', text });
});

//listen for general clicks as fallback
document.addEventListener('click', () => {
    startTimer();
});
