chrome.runtime.onInstalled.addListener(() => {
  //inject content script into all tabs to avoid refreshinh
  chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      if (tab.url.startsWith("http")) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
      }
    }
  });

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
        chrome.sidePanel.open().catch(() => {});
    }
    }
});