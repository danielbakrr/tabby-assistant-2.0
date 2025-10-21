let timerStarted = false;

//create highlighted selection
document.addEventListener('mouseup', function() {
    const selected = window.getSelection();
    if (!selected) return;

    const text = selected.toString().trim();
    if (!text) return;
    
    if (text && !timerStarted){
        try{
        chrome.runtime.sendMessage({ type: 'selected', text, action: "start"});
        timerStarted = true;
        } catch (e) {
        console.error('Error highlighting selection:', e);
        }
    }
});

document.addEventListener("click", () => {
  if (!timerStarted) {
    chrome.runtime.sendMessage({ action: "start" });
    timerStarted = true;
  }
});