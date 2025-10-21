let startTime = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "start" && !startTime) {
    startTime = Date.now();
    console.log("Timer started:", new Date(startTime).toLocaleTimeString());
  }

  if (msg.action === "stop" && startTime) {
    const elapsed = Math.floor((Date.now() - startTime) / 60000); //minutes
    startTime = null;

    chrome.storage.local.get("totalTime", (data) => {
      const updatedTotal = (data.totalTime || 0) + elapsed;
      chrome.storage.local.set({ totalTime: updatedTotal });
      console.log(`Timer stopped. Session: ${elapsed} min. Total: ${updatedTotal} min.`);
    });
  }
});
