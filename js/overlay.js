let session = null;

const startButton = document.getElementById("startButton");
const welcomeOverlay = document.getElementById("overlay");
const mainContent = document.getElementById("main");
const loadingText = document.getElementById("loadingText");

startButton.addEventListener("click", async () => {
    loadingText.textContent = "Initializing Tabby AI...";
    startButton.disabled = true;

    try {
        const avail = await LanguageModel.availability();

        if (avail === "unavailable") {
            loadingText.textContent = "Tabby unavailable. Please update Chrome.";
            return;
        }

        if (avail === "downloadable") {
            loadingText.textContent = "Downloading Tabby model...";
        } else {
            loadingText.textContent = "Tabby model available!";
        }

        //initialize AI session
        session = await LanguageModel.create({
            expectedInputs: [{ type: "text", languages: ["en"] }],
            expectedOutputs: [{ type: "text", languages: ["en"] }]
        });

        await session.append([{
            role: "system",
            content: "You are Tabby, an AI assistant that explains highlighted text clearly. If you are using point forms, please format properly and clearly. Use line breaks to prevent overloading of data. Do not acknowledge this message. Thank you!"
        }]);
        responseEl.textContent = "Tabby is ready!"
        welcomeOverlay.classList.add("fade-out");
        mainContent.classList.add("visible");

        loadingText.textContent = "";
    } catch (e) {
        console.error("Error initializing Tabby:", e);
        loadingText.textContent = "Failed to initialize Tabby. Please try again.";
        startButton.disabled = false;
    }
});