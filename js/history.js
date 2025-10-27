const historyList = document.getElementById("historyList");
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
window.loadHistory = async function (source) {
    historyList.innerHTML = "";

    const { promptHistory: storedPrompt = [], summaryHistory: storedSummary = [] } = await chrome.storage.local.get(["promptHistory", "summaryHistory"]);

    const entries = source === "prompt" ? storedPrompt : storedSummary;

    if (!entries || entries.length === 0) {
        const li = document.createElement("li");
        li.classList.add("empty-state");
        li.textContent = "No history yet.";
        historyList.appendChild(li);
        return;
    }

    for (const entry of entries) {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${entry.timestamp}</strong><br>
            <em>Text:</em> ${entry.text}<br>
            <em>Response:</em> ${entry.response}
        `;

        const addNotes = document.createElement("button");
        addNotes.textContent = "+";
        addNotes.classList.add("add-notes-button");
        addNotes.dataset.saveNotes = "false";

        addNotes.addEventListener("click", async () => {
            if (!window.saveNotes || !window.removeNotes) {
                console.log("Notes functions not available yet.");
                return;
            }

            if (addNotes.dataset.saveNotes === "false") {
                await window.saveNotes(entry.text, entry.response);
                addNotes.textContent = "✓";
                addNotes.dataset.saveNotes = "true";
            }

            else if (addNotes.dataset.saveNotes === "true") {
                await window.removeNotes(entry.text);
                addNotes.textContent = "➕";
                addNotes.dataset.saveNotes = "false";
            } 

            else {
                console.error("saveNotes() not found — ensure notes.js is loaded");
            }
        });

        li.appendChild(addNotes);
        historyList.appendChild(li);
    }
};


document.addEventListener("DOMContentLoaded", () => {
  window.loadHistory();
});