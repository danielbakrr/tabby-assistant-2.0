let allNotes = []

// -------------------- Save Notes -------------------- //
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

// -------------------- Remove Notes -------------------- //
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

// -------------------- Load Notes -------------------- //
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

// -------------------- Display Notes -------------------- //
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

    notes.forEach(async (note) => {
        const noteContainer = document.createElement("div");
        noteContainer.classList.add("note-container");

        const textEl = document.createElement("p");
        textEl.innerHTML = `<strong>Text:</strong> ${note.text}`;

        const responseEl = document.createElement("p");
        responseEl.innerHTML = `<strong>Note:</strong> ${note.response}`;

        noteContainer.appendChild(textEl);
        noteContainer.appendChild(responseEl);

        // Check if called from flashcards page
        const params = new URLSearchParams(window.location.search);
        const fromFlashcards = params.get("fromFlashcards");

        if (fromFlashcards) {
            const addBtn = document.createElement("button");
            addBtn.textContent = "➕ Add to Deck";
            addBtn.classList.add("add-to-deck-btn");

            addBtn.addEventListener("click", async () => {
                const { currentDeckIndex, decks = [] } = await chrome.storage.local.get(["currentDeckIndex", "decks"]);
                if (currentDeckIndex === undefined || decks[currentDeckIndex] === undefined) return;

                // Generate flashcard content using prompt API
                const flashcard = await generateFlashcard(note.text, note.response);
                decks[currentDeckIndex].flashcards.push(flashcard);
                chrome.storage.local.set({ decks });
                alert("Added to deck!");
            });

            noteContainer.appendChild(addBtn);
        } else {
            // normal delete button for notes page
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑 Delete";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () => removeNotes(note.text));
            noteContainer.appendChild(deleteBtn);
        }

        notesList.appendChild(noteContainer);
    });
}

// -------------------- Flashcard Prompt API -------------------- //
async function generateFlashcard(text, response) {
    if (!window.tabbyAI || !window.tabbyAI.session) {
        return { question: text, answer: response };
    }

    const prompt = `
        Turn the following note into a simple flashcard with a question and answer format.
        Note Text: ${text}
        Note Response: ${response}
        Format: { "question": "...", "answer": "..." }
    `;

    try {
        const result = await window.tabbyAI.session.prompt(prompt);
        return JSON.parse(result); // Expect JSON {question, answer}
    } catch {
        return { question: text, answer: response };
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