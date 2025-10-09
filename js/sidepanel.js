const selectionTextEl = document.getElementById("selectionText");
const responseEl = document.getElementById("responseText");

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
chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type === "selection_for_panel") {
        const text = message.text.trim();
        selectionTextEl.textContent = text;
        responseEl.textContent = "Thinking...";

        if (!session) {
            responseEl.textContent = "Tabby not ready yet...";
            return;
        }

        try {
            const prompt = `Explain this text in detail for a student:\n\n"${text}"`;
            const result = await session.prompt(prompt);
            responseEl.textContent = result;
        } catch (err) {
            console.error("Error getting AI response:", err);
            responseEl.textContent = "Error getting Tabby response.";
        }
    }
});
