const translatorForm = document.getElementById("translatorForm");
const inputText = document.getElementById("inputText");
const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");
const swapLanguages = document.getElementById("swapLanguages");
const translatedText = document.getElementById("translatedText");
const copyOutput = document.getElementById("copyOutput");
const speakOutput = document.getElementById("speakOutput");
const characterCount = document.getElementById("characterCount");
const messageArea = document.getElementById("messageArea");
const translateButton = document.getElementById("translateButton");
const clearButton = document.getElementById("clearButton");
const connectionStatus = document.getElementById("connectionStatus");
const statusText = connectionStatus.querySelector(".status-text");

function showMessage(message, type = "error") {
    messageArea.textContent = message;
    messageArea.dataset.type = type;
}

function clearMessage() {
    messageArea.textContent = "";
}

function setLoading(isLoading) {
    translateButton.disabled = isLoading;
    translateButton.classList.toggle("loading", isLoading);
    translateButton.querySelector(".button-text").textContent = isLoading ? "Translating" : "Translate";
    connectionStatus.dataset.state = isLoading ? "working" : "ready";
    statusText.textContent = isLoading ? "Working" : "Ready";
}

function updateCharacterCount() {
    characterCount.textContent = inputText.value.length;
}

function hasRealTranslation() {
    return translatedText.textContent.trim() && translatedText.textContent !== "Your translation will appear here.";
}

inputText.addEventListener("input", () => {
    updateCharacterCount();
    clearMessage();
});

swapLanguages.addEventListener("click", () => {
    if (sourceLanguage.value === "auto") {
        showMessage("Auto Detect cannot be swapped. Please choose a source language first.");
        return;
    }

    const oldSource = sourceLanguage.value;
    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = oldSource;
    clearMessage();
});

clearButton.addEventListener("click", () => {
    translatedText.textContent = "Your translation will appear here.";
    translatedText.classList.add("placeholder-result");
    connectionStatus.dataset.state = "ready";
    statusText.textContent = "Ready";
    clearMessage();
    setTimeout(updateCharacterCount, 0);
});

copyOutput.addEventListener("click", async () => {
    if (!hasRealTranslation()) {
        showMessage("There is no translated text to copy yet.");
        return;
    }

    await navigator.clipboard.writeText(translatedText.textContent);
    showMessage("Translated text copied.", "success");
});

speakOutput.addEventListener("click", () => {
    if (!hasRealTranslation()) {
        showMessage("There is no translated text to speak yet.");
        return;
    }

    const speech = new SpeechSynthesisUtterance(translatedText.textContent);
    speech.lang = targetLanguage.value;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
});

translatorForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const text = inputText.value.trim();
    const source = sourceLanguage.value;
    const target = targetLanguage.value;

    if (!text) {
        showMessage("Please enter text before translating.");
        return;
    }

    if (source === target) {
        showMessage("Source and target languages should be different.");
        return;
    }

    setLoading(true);

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, source, target }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Translation failed.");
        }

        translatedText.textContent = data.translated_text;
        translatedText.classList.remove("placeholder-result");
        connectionStatus.dataset.state = "success";
        statusText.textContent = "Done";
        showMessage("Translation completed.", "success");
    } catch (error) {
        connectionStatus.dataset.state = "error";
        statusText.textContent = "Issue";
        showMessage(error.message);
    } finally {
        translateButton.disabled = false;
        translateButton.classList.remove("loading");
        translateButton.querySelector(".button-text").textContent = "Translate";
    }
});

updateCharacterCount();
