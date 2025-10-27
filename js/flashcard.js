let decks = []

function saveDecks(){
    chrome.storage.local.set({decks})
}

function loadDecks(){
    chrome.storage.local.get("decks", (result=>{
        decks = result.decks || [];
        displayDecks()
    }))
}

//prompt gemini to generate question and answer
async function generateFlashcard(text, response) {
    const prompt = `
        Turn the following note into a simple flashcard with a question and answer format.
        Ensure that the note text is not displayed in full, but rather in bite-sized information.

        Note Text: ${text}
        Note Response: ${response}

        Format: { "question": "...", "answer": "..." }
    `;

    const result = await window.tabbyAI.session.prompt(prompt);

    try {
        return JSON.parse(result);
    } catch {
        return { question: text, answer: response };
    }
}


function displayDecks(){
    const decksList = document.getElementById("decksList");
    decksList.innerHTML="";

    if (decks.length === 0){
        decksList.textContent = "No Flashcard Decks yet.";
        return;
    }

    for (deck in decksList){
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