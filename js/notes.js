window.saveNotes = async function(text, response) {
    try {
        const result = await chrome.storage.local.get("notes");
        const notes = result.notes || [];
        
        const newNote = { text, response };
        notes.push(newNote);

        await chrome.storage.local.set({ notes });

        alert("Note saved!");
    } catch (e) {
        console.error("Error saving note:", e);
        alert("Failed to save note.");
    }
}

window.removeNotes = async function (textToRemove) {
    try {
        const { notes = [] } = await chrome.storage.local.get("notes");

        const updatedNotes = notes.filter(note => note.text !== textToRemove);

        await chrome.storage.local.set({ notes: updatedNotes });
        console.log("Note removed:", textToRemove);

        await loadNotes();
    } catch (e) {
        console.error("Error removing note:", e);
        alert("Failed to remove note.");
    }
};


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
