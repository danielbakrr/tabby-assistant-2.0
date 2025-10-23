const {agentOrchestrator} = require("./js/multi-modal.js")

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
    const selected = window.getSelection();
    if (!selected) return;

    const text = selected.toString().trim();
    if (!text) return;

    try{
        chrome.runtime.sendMessage({ type: 'selected', text});
    } catch (e) {
        console.error('Error highlighting selection:', e);
    }});

//listen for general clicks as fallback
document.addEventListener('click', () => {
    startTimer();
});

agentOrchestrator("Explain einstein theory of relativity");
