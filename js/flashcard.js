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

    decks.forEach((deck, index) => {
        const deckEl = document.createElement("div");
        deckEl.classList.add("deck-container");
        deckEl.innerHTML = `
            <h3>${deck.name}</h3>
            <p>${deck.flashcards.length} flashcards</p>
            <button class="addCardsBtn">➕ Add Notes</button>
        `;
        deckEl.querySelector(".addCardsBtn").addEventListener("click", () => {
            //save selected deck index and redirect to notes page
            chrome.storage.local.set({ currentDeckIndex: index }, () => {
                window.location.href = "notes.html?fromFlashcards=true";
            });
        });
        decksList.appendChild(deckEl);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const backButton = document.getElementById("backButton");
    backButton.addEventListener("click", () => {
        window.history.back();
    });
    const newDeckButton = document.getElementById("newDeckBtn");
    newDeckButton.addEventListener("click", () => {
        const deckName = prompt("Enter deck name:");
        if (!deckName) return;
        decks.push({ name: deckName, flashcards: [] });
        saveDecks();
        renderDecks();
    });

    loadDecks();
});