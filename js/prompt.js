//get html elements
const text = document.getElementById("inputText");
const response = document.getElementById("responseText");

let currentSelection = "";
let lastPromptEntry = "";
let session = null;

//auto initialize ai model to avoid gesture requirement
(async function initAI(){
    response.textContent = "Initializing Tabby...";
    try{
        const avail = await LanguageModel.availability();
        if (avail === "unavailable"){
            response.textContent = "Tabby unavailable. Please check your internet connection or try again later.";
            return;
        }
        if (avail === "downloadable"){
            response.textContent = "Tabby needs user gesture to download";
            return;
        }

        session = await LanguageModel.create();
        await session.append([
            { role: "system", content: "You are Tabby, an AI assistant integrated into a browser extension. Your purpose is to assist users with their queries and tasks related to web browsing. Provide clear, concise, and accurate information to help users navigate the web effectively."}
        ]); //initial system prompt
        response.textContent = "Tabby is ready. You can start asking questions now!";
    } catch (e){
        console.error("Error initializing AI model:", e);
        response.textContent = "Error initializing AI model. Please try again later.";
    }
})


//new selection for prompt
async function newSelectionPrompt(text){
    currentSelection = text;
    response.textContent = "";
    if (!session) {
        response.textContent = "Tabby not initialized yet. Please wait.";
        return;
    }

    try{
        const prompt = 'For the following text, please provide an in-depth explanation or description to aid the user in their understanding. Treat this as means of tutoring a student, where you are the tutor. Provide detailed concepts and explanation.\n\nText: """' + text + '"""';
        const result = await session.prompt(prompt)

        response.textContent = result;
    }
    catch (e){
        console.error("Error getting Tabby response:", e);
        response.textContent = "Error getting Tabby response. Please try again later.";
    }
}
    