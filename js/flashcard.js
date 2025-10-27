function saveDecks(){
    chrome.storage.local.set({decks})
}

function loadDecks(){
    chrome.storage.local.get("decks", (result=>{
        decks = result.decks || [];
        displayDecks()
    }))
}

function displayDecks(){
}