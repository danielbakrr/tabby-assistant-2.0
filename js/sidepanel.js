//---------------------------- Element References ---------------------------//
const selectionTextEl = document.getElementById("selectionText");
const responseEl = document.getElementById("responseText");

//global ai model variables
const session = () => window.tabbyAI?.session;
const summarizer = () => window.tabbyAI?.summarizer;

//---------------------------- Get highlighted text ----------------------------//
chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type === "selected") {
        const text = message.text.trim();
        selectionTextEl.textContent = text;
        responseEl.textContent = "Please select an action";
    }
});

//---------------------------- AI Model Integration ----------------------------//
//listen for messages
document.getElementById("askButton").addEventListener("click", async () => {
    document.body.classList.remove("summary-mode");
    document.body.classList.add("ask-mode");
    chrome.storage.local.set({ mode: "ask-mode" });
    await loadHistory("prompt"); // immediately populate history after clicking button
    const text = selectionTextEl.textContent.trim();
    if (!text) {
        responseEl.textContent = "Please highlight some text first.";
        return;
    }

    responseEl.textContent = "🤔 Tabby is analyzing your text...";

    if (!session()) {
        responseEl.textContent = "Tabby not ready yet...";
        return;
    }

    try {
        const prompt = `You are Tabby, an AI tutor. For the following text, provide a clear explanation suitable for a student. Break it down into:

            1. Overview: One or two sentences that capture the main idea.
            2. Key Concepts: 2–3 bullet points of important ideas or details.
            3. Example or Analogy: A simple example or analogy to make the concept easier to understand.

            Text: """${text}"""`;

        const result = await session().prompt(prompt);

        // Convert Markdown-like formatting
        const formattedResult = result
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")  // bold
        .replace(/\n\s*\*\s*(.*?)(?=\n|$)/g, "<li>$1</li>") // bullets
        .replace(/\n{2,}/g, "<br><br>") // double line breaks

        responseEl.innerHTML = formattedResult;

        await saveToHistory(text, result, "prompt"); // add flag to indicate history source
    } catch (err) {
        console.error("Error getting AI response:", err);
        responseEl.textContent = "Error getting Tabby response.";
    }
});

//---------------------------- Summarizer ----------------------------//
//send message when summarize button is clicked
document.getElementById("summarizeButton").addEventListener("click", async () => {
    document.body.classList.remove("ask-mode");
    document.body.classList.add("summary-mode");
    chrome.storage.local.set({ mode: "summary-mode" });
    await loadHistory("summary"); // immediately populate history after clicking button
    const text = selectionTextEl.textContent.trim();

    if (!text) {
        responseEl.textContent = "Please highlight some text first.";
        return;
    }

    if (!summarizer()) {
        responseEl.textContent = "Summarizer not ready yet...";
        return;
    }

    try {
        responseEl.textContent = "📝 Tabby is summarizing...";

        const summary = await summarizer().summarize(text);

        // Convert Markdown-like formatting
        const formattedResult = summary
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")  // bold
        .replace(/\n\s*\*\s*(.*?)(?=\n|$)/g, "<li>$1</li>") // bullets
        .replace(/\n{2,}/g, "<br><br>") // double line breaks

        responseEl.innerHTML = formattedResult;

        await saveToHistory(text, summary, "summary"); // add flag to indicate history source
    } catch (err) {
        console.error("Error generating summary:", err);
        responseEl.textContent = "Error generating summary.";
    }
});

//---------------------------- Persistent Theme ----------------------------//
//load saved theme from storage
chrome.storage.local.get(["mode"], (data) => {
    if (data.mode) {
        document.body.classList.add(data.mode);
    }
});

//---------------------------- Notes Redirect ----------------------------//
const savedButton = document.getElementById("savedNotes");

savedButton.addEventListener("click", async () => {
    window.location.href = "notes.html";
})

//---------------------------- Notes Redirect ----------------------------//
const flashcardButton = document.getElementById("flashCards");

flashcardButton.addEventListener("click", async () => {
    window.location.href = "flashcards.html";
})