chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "selection_for_panel") {
        const display = document.getElementById("selectionText");
        if (display) {
            display.textContent = `${message.text}`;
        }
    }
});