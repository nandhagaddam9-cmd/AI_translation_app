# CodeAlpha Language Translation Tool

This is a web-based language translation tool created for the CodeAlpha Artificial Intelligence internship task.

The application allows users to enter text, select source and target languages, translate the text, copy the result, and listen to the translated text using browser speech synthesis.

## Tech Stack

- HTML
- CSS
- JavaScript
- Python
- Flask
- deep-translator
- Google Cloud Translation API

## Features

- Attractive and responsive user interface
- Source and target language selection
- Auto detect source language option
- Language swap button
- Character counter
- Translation result display
- Copy translated text
- Text-to-speech for translated output
- Basic validation and error messages

## Project Structure

```text
CodeAlpha_Language_Translation_Tool/
│
├── app.py
├── requirements.txt
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

## How It Works

1. The user enters text in the input area.
2. The user selects a source language and a target language.
3. JavaScript sends the text and selected languages to the Flask backend.
4. Flask receives the data through the `/translate` route.
5. The backend uses the `deep-translator` library to translate the text.
6. Flask sends the translated text back as a JSON response.
7. JavaScript displays the translated output on the page.

## Installation

```bash
pip install -r requirements.txt
```

## Google API Key Setup

Do not write your API key directly inside `app.py`.

For local testing on Windows PowerShell, set the key like this:

```powershell
$env:GOOGLE_TRANSLATE_API_KEY="your_api_key_here"
```

Then run the project in the same terminal:

```bash
py app.py
```

For deployment, add this environment variable in your hosting platform:

```text
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

If this variable is not set, the app falls back to the `deep-translator` library.

## Run The Project

```bash
python app.py
```

If your system uses the Python launcher, run:

```bash
py app.py
```

Then open:

```text
http://127.0.0.1:5000
```

## Deployment Notes

This project includes deployment-friendly files:

- `Procfile` tells hosting platforms how to start the Flask app.
- `runtime.txt` specifies the Python version.
- `requirements.txt` lists Flask, gunicorn, requests, and deep-translator.

For platforms like Render, use:

```text
Build command: pip install -r requirements.txt
Start command: gunicorn app:app
```

## Important Code Explanation

The main backend route is:

```text
/translate
```

This route receives data from JavaScript, translates the input text, and returns the translated result.

The main translation logic is inside `app.py`:

```python
translated_text = translate_text(text, source_language, target_language)
```

If `GOOGLE_TRANSLATE_API_KEY` is available, the app uses Google Cloud Translation API. Otherwise, it uses the library fallback.

## Future Improvements

- Add Microsoft Translator API support
- Add translation history
- Add dark mode
- Add more languages
- Add user login and saved translations

## Internship Video Explanation Script

Hello, my name is [Your Name]. This is my CodeAlpha Artificial Intelligence internship project called Language Translation Tool.

In this project, I built a web application using HTML, CSS, JavaScript, Python, and Flask. The user can enter text, select the source language and target language, and click the translate button.

The frontend collects the user input and sends it to the Flask backend. The backend uses the `deep-translator` Python library to translate the text and returns the translated result to the frontend. The translated text is then displayed clearly on the screen.

I also added extra features like character count, language swap, copy translated text, and text-to-speech. This project helped me understand how frontend, backend, and translation services work together in a real web application.
