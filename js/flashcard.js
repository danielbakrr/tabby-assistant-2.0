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
            <button class="addCardsBtn">➕</button>
            <button class="reviewBtn">📚</button>
            <button class="deleteBtn">🗑</button>
        `;

        //add notes button
        deckEl.querySelector(".addCardsBtn").addEventListener("click", () => {
            chrome.storage.local.set({ currentDeckIndex: index }, () => {
                window.location.href = "notes.html?fromFlashcards=true";
            });
        });

        //review button
        deckEl.querySelector(".reviewBtn").addEventListener("click", () => {
            chrome.storage.local.set({ currentDeckIndex: index }, () => {
                window.location.href = "flashcardReview.html";
            });
        });

        //delete button
        deckEl.querySelector(".deleteBtn").addEventListener("click", () => {
            if (confirm(`Delete deck "${deck.name}"?`)) {
                decks.splice(index, 1);
                chrome.storage.local.set({ decks }, displayDecks);
            }
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

//--------------------------------------Flashcard Review------------------------------------//

let currentDeckIndex = null
let currentCardIndex = 0

function showCard() {
    if (!decks[currentDeckIndex]) return;
    const card = decks[currentDeckIndex].flashcards[currentCardIndex];
    if (!card) return;

    document.getElementById("question").textContent = card.question;
    const answerEl = document.getElementById("answer");
    answerEl.textContent = card.answer;
    answerEl.style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("backButton").addEventListener("click", () => window.history.back());

    const storageData = await chrome.storage.local.get(["decks", "currentDeckIndex"]);
    decks = storageData.decks || [];
    currentDeckIndex = storageData.currentDeckIndex;

    if (!decks[currentDeckIndex] || decks[currentDeckIndex].flashcards.length === 0) {
        alert("No flashcards in this deck.");
        return;
    }

    showCard();

    document.getElementById("flipBtn").addEventListener("click", () => {
        const answerEl = document.getElementById("answer");
        answerEl.style.display = answerEl.style.display === "none" ? "block" : "none";
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        if (currentCardIndex < decks[currentDeckIndex].flashcards.length - 1) {
            currentCardIndex++;
            showCard();
        }
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            showCard();
        }
    });
});