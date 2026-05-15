import os
from html import unescape

import requests
from flask import Flask, jsonify, render_template, request


app = Flask(__name__)
GOOGLE_TRANSLATE_API_URL = "https://translation.googleapis.com/language/translate/v2"
MAX_TEXT_LENGTH = 1000
SUPPORTED_LANGUAGES = {
    "auto",
    "en",
    "hi",
    "te",
    "ta",
    "kn",
    "ml",
    "mr",
    "bn",
    "gu",
    "fr",
    "es",
    "de",
    "ja",
}


def translate_with_google_api(text, source_language, target_language):
    api_key = os.environ.get("GOOGLE_TRANSLATE_API_KEY")

    if not api_key:
        return None

    payload = {
        "q": text,
        "target": target_language,
        "format": "text",
    }

    if source_language != "auto":
        payload["source"] = source_language

    response = requests.post(
        GOOGLE_TRANSLATE_API_URL,
        params={"key": api_key},
        json=payload,
        timeout=12,
    )
    response.raise_for_status()

    result = response.json()
    translated_text = result["data"]["translations"][0]["translatedText"]
    return unescape(translated_text)


def translate_with_library(text, source_language, target_language):
    from deep_translator import GoogleTranslator

    translator = GoogleTranslator(source=source_language, target=target_language)
    return translator.translate(text)


def translate_text(text, source_language, target_language):
    google_result = translate_with_google_api(text, source_language, target_language)

    if google_result is not None:
        return google_result

    return translate_with_library(text, source_language, target_language)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json(silent=True) or {}

    text = data.get("text", "").strip()
    source_language = data.get("source", "auto")
    target_language = data.get("target", "en")

    if not text:
        return jsonify({"error": "Text is required."}), 400

    if source_language == target_language:
        return jsonify({"error": "Source and target languages must be different."}), 400

    if len(text) > MAX_TEXT_LENGTH:
        return jsonify({"error": f"Text must be {MAX_TEXT_LENGTH} characters or fewer."}), 400

    if source_language not in SUPPORTED_LANGUAGES or target_language not in SUPPORTED_LANGUAGES:
        return jsonify({"error": "Unsupported language selected."}), 400

    if target_language == "auto":
        return jsonify({"error": "Target language cannot be Auto Detect."}), 400

    try:
        translated_text = translate_text(text, source_language, target_language)

        return jsonify({"translated_text": translated_text})
    except Exception as error:
        return jsonify({"error": f"Translation failed: {error}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
