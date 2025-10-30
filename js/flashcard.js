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
    const promptText = `
        Turn the following note into a simple flashcard with a question and answer format.
        Derive the answer from the response, but ensure both the question and answer are shortened versions of the original.

        Note Text: ${text}
        Note Response: ${response}

        Format: { "question": "...", "answer": "..." }
    `;

    // Safely get the session instance
    const session = typeof window.tabbyAI?.session === 'function' 
        ? window.tabbyAI.session() 
        : window.tabbyAI?.session;

    if (!session) {
        console.warn("TabbyAI session not available, returning default flashcard.");
        return { question: text, answer: response };
    }

    try {
        const result = await session.prompt(promptText);
        return JSON.parse(result);
    } catch (error) {
        console.error("Error generating flashcard:", error);
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
            <div class="deck-buttons">
                <button class="addCardsBtn">➕ Add</button>
                <button class="reviewBtn">📚 Review</button>
                <button class="deleteBtn">🗑 Delete</button>
            </div>
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
    });

    loadDecks();
});

//--------------------------------------Flashcard Review------------------------------------//
let currentDeckIndex = null;
let currentCardIndex = 0;

function showCard() {
    const flashcard = document.getElementById("flashcard");
    if (!decks[currentDeckIndex]) return;

    const card = decks[currentDeckIndex].flashcards[currentCardIndex];
    if (!card) {
        document.getElementById("question").textContent = "No more flashcards!";
        document.getElementById("answer").textContent = "";
        flashcard.classList.remove("is-flipped");
        return;
    }

    document.getElementById("question").textContent = card.question;
    document.getElementById("answer").textContent = card.answer;

    flashcard.classList.remove("is-flipped");
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

    document.getElementById("deckName").textContent = decks[currentDeckIndex].name;

    showCard();

    const flashcard = document.getElementById("flashcard");

    flashcard.addEventListener("click", () => {
        flashcard.classList.toggle("is-flipped");
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

    document.getElementById("deleteBtn").addEventListener("click", async () => {
        const confirmDelete = confirm("Delete this flashcard?");
        if (!confirmDelete) return;

        decks[currentDeckIndex].flashcards.splice(currentCardIndex, 1);

        if (currentCardIndex >= decks[currentDeckIndex].flashcards.length) {
            currentCardIndex = Math.max(0, decks[currentDeckIndex].flashcards.length - 1);
        }

        await chrome.storage.local.set({ decks });

        if (decks[currentDeckIndex].flashcards.length === 0) {
            alert("All flashcards deleted!");
            window.history.back();
            return;
        }

        showCard();
    });
});
