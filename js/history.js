const historyList = document.getElementById("historyList");

window.saveToHistory = async function (text, response) {
  try {
    const { history } = await chrome.storage.local.get("history");
    const updatedHistory = history || [];

    updatedHistory.push({
      text,
      response,
      timestamp: new Date().toISOString()
    });

    await chrome.storage.local.set({ history: updatedHistory});

    window.loadHistory();
  } catch (e) {
    console.error("Error saving to history:", e);
  }
}

// Function to render history
window.loadHistory = async function() {
  historyList.innerHTML = "";
  const { history } = await chrome.storage.local.get("history");

  if (!history || history.length === 0) {
    const li = document.createElement("li");
    li.classList.add("empty-state");
    li.textContent = "No history yet.";
    historyList.appendChild(li);
    return;
  }

  for (const entry of history) {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${entry.timestamp}</strong><br>
      <em>Text:</em> ${entry.text}<br>
      <em>Response:</em> ${entry.response}
    `;
    historyList.appendChild(li);
  }
}