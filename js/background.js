chrome.runtime.onInstalled.addListener(() => {
    if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior){
        chrome.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error(error));
    }
});


//listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "selected") {
    chrome.runtime.sendMessage({ type: "selection_for_panel", text: message.text, tab: sender.tab });
    if (chrome.sidePanel && chrome.sidePanel.open) {
      chrome.sidePanel
        .open({ path: "sidepanel.html" })
        .catch((e) => console.error("Error opening side panel:", e));
    }
    }
});

//timer automation handling
let startTime = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    try {
        if (msg.action === "start" && !startTime) {
            startTime = Date.now();
            console.log("⏱ Timer started:", new Date(startTime).toLocaleTimeString());
        }

        if (msg.action === "stop" && startTime) {
            const elapsed = Math.floor((Date.now() - startTime) / 60000);

            chrome.storage.local.get("totalTime", (data) => {
                const updatedTotal = (data.totalTime || 0) + elapsed;
                chrome.storage.local.set({ totalTime: updatedTotal }, () => {
                    console.log(`✅ Timer stopped. Session: ${elapsed} min. Total: ${updatedTotal} min.`);
                });
            });
        }
    } catch (e) {
        console.error("Error handling timer:", e);
    }
});

