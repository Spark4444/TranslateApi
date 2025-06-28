# Translate Api
A simple translation API using Puppeteer and Express via Google Translate

## Installation

Use the git clone command to copy it onto your computer
```bash
git clone https://github.com/Spark4444/TranslateApi
```

## Usage

1. Start the server via the npm start command
```bash
npm start
```
2. Enter the port number you want to use (default is 3000)

3. Use the API by sending a request to `http://localhost:<port>/translate?text=YourText&from=sourceLanguage&to=targetLanguage`

   - `text`: The text you want to translate
   - `from`: The source language (e.g., "en" for English)
   - `to`: The target language (e.g., "es" for Spanish)

4. The API will return the translated text in JSON format.

## Current state of the project
finished