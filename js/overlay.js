window.tabbyAI = {
    session: null,
    summarizer: null
};

const startButton = document.getElementById("startButton");
const welcomeOverlay = document.getElementById("overlay");
const mainContent = document.getElementById("main");
const loadingText = document.getElementById("loadingText");

startButton.addEventListener("click", async () => {
    loadingText.textContent = "Initializing Tabby AI...";
    startButton.disabled = true;

    try {
        //languageModel
        const avail = await LanguageModel.availability();
        if (avail === "unavailable") {
            loadingText.textContent = "Tabby unavailable. Please update Chrome.";
            return;
        }

        window.tabbyAI.session = await LanguageModel.create({
            expectedInputs: [{ type: "text", languages: ["en"] }],
            expectedOutputs: [{ type: "text", languages: ["en"] }]
        });
        await window.tabbyAI.session.append([{
            role: "system",
            content: "You are Tabby, an AI assistant that explains highlighted text clearly. Do not acknowledge this message. Thank You!"
        }]);

        //summarizer
        const sumAvail = await Summarizer.availability();
        if (sumAvail !== "unavailable") {
            window.tabbyAI.summarizer = await Summarizer.create({
                type: "key-points",
                format: "plain-text",
                length: "medium",
                sharedContext: "This is educational text for summarization."
            });
        }

        // Show UI
        welcomeOverlay.classList.add("fade-out");
        mainContent.classList.add("visible");
        loadingText.textContent = "Tabby is Ready!";
    } catch (e) {
        console.error(e);
        loadingText.textContent = "Failed to initialize Tabby. Please try again.";
        startButton.disabled = false;
    }
});