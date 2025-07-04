let express = require("express");
let translate = require("./translate");
let readline = require("readline");
let cors = require("cors");

let app = express();

// Enable CORS for all routes
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

// Pretty print JSON responses
app.set("json spaces", 2);

// Endpoint via URL parameters
app.get("/translate", async (req, res) => {
    try {
        // Url parameters for translation
        let { text, from, to } = req.query;
        
        // Check if all parameters are present
        if (!text || !from || !to) {
            return res.status(400).json({ 
                error: "Missing required parameters. Use: /translate?text=...&from=...&to=..." 
            });
        }

        // Translate the text using the translate function
        let translatedText = await translate(text, from, to);

        // Check if the translation was successful and if the text has changed
        // If the translated text is the same as the original, return an error
        if (translatedText === text) {
            return res.status(400).json({
                error: "Translation failed or no change detected. Please check the input text and languages.",
                text: text,
                originalLanguage: from,
                targetLanguage: to,
                translated: translatedText
            });
        }
        
        // Return the original and translated text
        res.json({
            original: text,
            originalLanguage: from,
            targetLanguage: to,
            translated: translatedText
        });
    } 
    catch (error) {
        console.error("Translation error:", error);
        res.status(500).json({ 
            error: "Translation failed", 
            message: error.message 
        });
    }
});

// Root endpoint with usage instructions
app.get("/", (req, res) => {
    res.json({
        message: "Translation API",
        usage: [
            "GET /translate/:text/:from/:to",
        ],
        examples: [
            "http://localhost:3000/translate/Hello%20world/en/es",
        ],
        languageCodesExamples: {
            english: "en",
            spanish: "es",
            french: "fr",
            german: "de",
            italian: "it",
            portuguese: "pt",
            ukrainian: "uk",
            japanese: "ja",
            chinese: "zh",
            arabic: "ar"
        }
    });
});

// Function to prompt user for port
function promptForPort() {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        // If the user does not input anything within 20 seconds, default to port 3000
        let timeout;
        
        // Function to start/restart the timeout
        function startTimeout() {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                console.log("\nNo input received after 20 seconds. Using default port 3000.");
                rl.close();
                resolve(3000);
            }, 20000); // 20 seconds timeout
        }
        
        // Start initial timeout
        startTimeout();
        
        // Listen for any input to restart the timeout
        process.stdin.on("data", () => {
            startTimeout();
        });

        rl.question("Enter the port number to run the server (default: 3000): ", (answer) => {
            clearTimeout(timeout);
            process.stdin.removeAllListeners("data"); // Clean up listener
            rl.close();
            let port = parseInt(answer) || 3000;
            resolve(port);
        });
    });
}

// Start the server with user-prompted port
async function startServer() {
    let PORT = await promptForPort();
    
    app.listen(PORT, () => {
        console.log(`Translation API server running on http://localhost:${PORT}`);
        console.log(`\nUsage examples:`);
        console.log(`http://localhost:${PORT}/translate?text=HelloWorld&from=en&to=es`);
    });
}

// Start the server
startServer();