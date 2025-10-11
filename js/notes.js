const savedButton = document.getElementById("savedNotes");

savedButton.addEventListener("click", async () => {
    window.location.href = "notes.html";
})

window.saveNotes = async function(text, response) {
    try {
        const { notes } = await chrome.storage.local.get("notes");
        const newNote = { text, response };
        notes.push(newNote);

        await chrome.storage.local.set({ notes });

        alert("Note saved!");
    } catch (e) {
        console.error("Error saving note:", e);
        alert("Failed to save note.");
    }
}

window.loadNotes = async function() {
    try {
        const { notes } = await chrome.storage.local.get("notes");
        const notesList = document.getElementById("notesList");
        notesList.innerHTML = "";
        if (!notes || notes.length === 0) {
            const li = document.createElement("li");
            li.classList.add("empty-state");
            li.textContent = "No notes saved yet.";
            notesList.appendChild(li);
            return;
        }
        for (const note of notes) {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>Text:</strong> ${note.text}<br>
                <strong>Note:</strong> ${note.response}
            `;
            notesList.appendChild(li);
        }
    } catch (e) {
        console.error("Error loading notes:", e);
    }
}
// Load notes when the page is loaded
document.addEventListener("DOMContentLoaded", loadNotes);
