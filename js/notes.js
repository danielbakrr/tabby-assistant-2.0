let allNotes = []

window.saveNotes = async function(text, response) {
    try {
        const result = await chrome.storage.local.get("notes");
        const notes = result.notes || [];
        
        const newNote = { text, response };
        notes.push(newNote);

        await chrome.storage.local.set({ notes });
        
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


window.loadNotes = async function () {
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

        allNotes = notes; //store notes globally to enabel search func
        displayNotes(notes);
    } catch (e) {
        console.error("Error loading notes:", e);
    }
};

//helper function to display formatted cards
function displayNotes(notes) {
    const notesList = document.getElementById("notesList");
    notesList.innerHTML = "";

    if (!notes || notes.length === 0) {
        const li = document.createElement("li");
        li.classList.add("empty-state");
        li.textContent = "No matching notes found.";
        notesList.appendChild(li);
        return;
    }

    for (const note of notes) {
        const noteContainer = document.createElement("div");
        noteContainer.classList.add("note-container");

        const textEl = document.createElement("p");
        textEl.innerHTML = `<strong>Text:</strong> ${note.text}`;

        const responseEl = document.createElement("p");
        responseEl.innerHTML = `<strong>Note:</strong> ${note.response}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑 Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => removeNotes(note.text));

        noteContainer.appendChild(textEl);
        noteContainer.appendChild(responseEl);
        noteContainer.appendChild(deleteBtn);
        notesList.appendChild(noteContainer);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.history.back();
        });
    }

    const searchInput = document.getElementById("searchNotes");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allNotes.filter(note =>
                note.text.toLowerCase().includes(searchTerm) ||
                note.response.toLowerCase().includes(searchTerm)
            );
            displayNotes(filtered);
        });
    }

    loadNotes();
});

window.addEventListener("DOMContentLoaded", () => {
    const backButton = document.getElementById("backButton");
    backButton.addEventListener("click", () => {
        window.history.back();
    });
});