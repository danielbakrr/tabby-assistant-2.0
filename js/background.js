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
        .open({ tabId: sender.tab.id })
        .catch((e) => console.error("Error opening side panel:", e));
    }
    }
});

