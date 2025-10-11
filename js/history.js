const historyList = document.getElementById("historyList");
const askButton = document.getElementById("askButton");
const summarizeButton = document.getElementById("summarizeButton");
summaryHistory = [];
promptHistory = [];

window.saveToHistory = async function (text, response, source) {
    try{
        if (source === "prompt") {
        promptHistory.push({ text, response, timestamp: new Date().toLocaleDateString() });
        await chrome.storage.local.set({ promptHistory });
    } else if (source === "summary") {
        summaryHistory.push({ text, response, timestamp: new Date().toLocaleDateString() });
        await chrome.storage.local.set({ summaryHistory });
    }

    window.loadHistory(source);
    
    } catch (e) {
        console.error("Error saving to history:", e);
    }
}

// Function to render history
window.loadHistory = async function(source) {
  historyList.innerHTML = "";

  if (source === "prompt") {
    const { promptHistory } = await chrome.storage.local.get("promptHistory");

    if (!promptHistory || promptHistory.length === 0) {
        const li = document.createElement("li");
        li.classList.add("empty-state");
        li.textContent = "No history yet.";
        historyList.appendChild(li);
        return;
    }

    for (const entry of promptHistory) {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${entry.timestamp}</strong><br>
      <em>Text:</em> ${entry.text}<br>
      <em>Response:</em> ${entry.response}
    `;
    historyList.appendChild(li);
    }
    } else if (source === "summary") {
    const { summaryHistory } = await chrome.storage.local.get("summaryHistory");
    if (!summaryHistory || summaryHistory.length === 0) {
        const li = document.createElement("li");
        li.classList.add("empty-state");
        li.textContent = "No history yet.";
        historyList.appendChild(li);
        return;
    }

    for (const entry of summaryHistory) {
    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${entry.timestamp}</strong><br>
        <em>Text:</em> ${entry.text}<br>
        <em>Response:</em> ${entry.response}
    `;
    historyList.appendChild(li);
    }
    }
}

document.addEventListener("DOMContentLoaded", () => {
  window.loadHistory();
});