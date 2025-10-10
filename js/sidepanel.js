const selectionTextEl = document.getElementById("selectionText");
const responseEl = document.getElementById("responseText");

//---------------------------- Get highlighted text ----------------------------//
chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type === "selection_for_panel") {
        const text = message.text.trim();
        selectionTextEl.textContent = text;
        responseEl.textContent = "Please select an action";
    }
});

//---------------------------- AI Model Integration ----------------------------//
let session = null;

//initialize AI model automatically
(async function initAI() {
    responseEl.textContent = "Initializing Tabby...";
    try {
        const avail = await LanguageModel.availability();
        if (avail === "unavailable") {
            responseEl.textContent = "Tabby unavailable. Please check your connection.";
            return;
        }
        if (avail === "downloadable") {
            responseEl.textContent = "Tabby needs user gesture to download";
            return;
        }

        session = await LanguageModel.create({
            expectedInputs: [{ type: "text", languages: ["en"] }],
            expectedOutputs: [{ type: "text", languages: ["en"] }]
        });
        await session.append([{ role: "system", content: "You are Tabby, an AI assistant that explains highlighted text clearly." }]);
        responseEl.textContent = "Tabby is ready!";
    } catch (e) {
        console.error("Error initializing AI:", e);
        responseEl.textContent = "Error initializing Tabby. Please try again later.";
    }
})();

//listen for messages
document.getElementById("askButton").addEventListener("click", async () => {
    const text = selectionTextEl.textContent.trim();
    if (!text) {
        responseEl.textContent = "Please highlight some text first.";
        return;
    }

    responseEl.textContent = "🤔 Tabby is analyzing your text...";

    if (!session) {
        responseEl.textContent = "Tabby not ready yet...";
        return;
    }

    try {
        const prompt = `You are Tabby, an AI tutor. For the following text, provide a clear explanation suitable for a student. Break it down into:

            1. Summary: One or two sentences that capture the main idea.
            2. Key Concepts: 2–3 bullet points of important ideas or details.
            3. Example or Analogy: A simple example or analogy to make the concept easier to understand.

            Text: """${text}"""`;

        const result = await session.prompt(prompt);
        responseEl.textContent = result;
    } catch (err) {
        console.error("Error getting AI response:", err);
        responseEl.textContent = "Error getting Tabby response.";
    }
});


//---------------------------- Summarizer ----------------------------//
let summarizer = null;

//initialize Summarizer automatically
(async function initSummarizer() {
    try {
        const avail= await Summarizer.availability();
        if (avail === "unavailable") {
            responseEl.textContent = "Summarizer unavailable. Please check your connection.";
            return;
        }
        if (avail === "downloadable") {
            responseEl.textContent = "Summarizer needs user gesture to download";
            return;
        }
        summarizer = await Summarizer.create({
            type: "key-points",
            length: "medium",
        })
        responseEl.textContent = "Summarizer is ready!";

    }
    catch (e) {
        console.error("Error initializing Summarizer:", e);
    }

})();

document.getElementById("summarizeButton").addEventListener("click", async () => {
    const text = selectionTextEl.textContent.trim();
    if (!text) {
        responseEl.textContent = "Please highlight some text first.";
        return;
    }

    if (!summarizer) {
        responseEl.textContent = "Summarizer not ready yet...";
        return;
    }

    try {
        responseEl.textContent = "📝 Tabby is summarizing...";
        const result = await summarizer.summarize(text);
        responseEl.textContent = result;
    } catch (err) {
        console.error("Error getting summary:", err);
        responseEl.textContent = "Error getting summary.";
    }
});
