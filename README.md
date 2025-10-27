# tabby-assistant-2.0

# Overview
Tabby is an AI-powered Chrome extension that enhances learning through contextual, in-browser assistance. It leverages Chrome's native APIs and AI models to assist users with studying, reading, and comprehension by enabling seamless interactions with highlighted text.

✅ Core Features & Status
1. 🔍 AI Prompting (Contextual Explanations)

- Description: Allows users to highlight text and receive in-depth, age-adaptable explanations.

- To-Do:

 - Edit AI responses: Allow manual formatting (e.g. bolding, headings) in output panel.

 - Optimize processing speed:
 
 - Preprocess text before sending to the model (e.g., chunking or cleaning)

 - Use local caching or background fetch for re-requests✅


2. 🧠 Summary Generator (Compressed Explanations)

- Description: Provides concise summaries from selected text. Designed for flashcard generation and fast review.

- To-Do:

 - Build a Flashcard component:✅

 - Front/back card layout

 - Add to deck or study mode✅

 - Option to convert summary to flashcard with one click✅


3. 🌐 Translation API

- Description: Translate highlighted text to different languages.

- Status: Not implemented
- To-Do:

 - Integrate with Google Translate API or DeepL

 - Add UI dropdown for language selection
 
 - Support right-to-left language formatting


4. 🖼️ Multimodal Support (Images)

- Description: Insert relevant images for explanations or provide image explanations.

- Status: Not implemented
- To-Do:

 - Allow users to generate images based on AI explanation (e.g. “Explain Newton’s Laws → image of falling apple”)

 - Use DALL·E / Stable Diffusion for image generation

 - Accept image inputs → describe them with AI

 - Drag & drop or screenshot integration


5. 🪟 Side Panel / Split-Screen Mode

- Description: Use Chrome’s side panel API to offer non-intrusive, always-visible assistance.✅


6. 📚 Persistent History

- Description: Save and review previous prompts and summaries.
  
- To-Do:

 - Allow tag-based search✅

 - Export history to PDF or Google Docs


7. ⏱️ Study Timer

- Description: Records time spent studying using the extension.

- Status: Partially planned
- To-Do:

 - Add Pomodoro-style timer or simple stopwatch

 - Display total time studied per day/week

 - Optional reminder notifications


🔜 Suggested Additional Enhancements

- Voice Input/Read Aloud Support

- Use Chrome’s SpeechRecognition API

- Text-to-speech readback for explanations

- Theme Customization✅

- Light/Dark mode toggle

- Font size, color, dyslexia-friendly options
