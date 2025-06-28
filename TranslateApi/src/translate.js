let puppeteer = require("puppeteer");

async function translate(text, originalLang, targetLang){
    // Launch a new browser instance and open a new page
    let browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();
    
    // Navigate to Google Translate with the specified languages and text
    await page.goto(`https://translate.google.com/?sl=${originalLang}&tl=${targetLang}&text=${encodeURIComponent(text)}&op=translate`);

    // Wait for the translation to complete
    await page.waitForSelector(".ryNqvb");

    // Extract the translated text
    let translatedText = await page.evaluate(() => {
        return document.querySelector(".ryNqvb").textContent.trim();
    });

    // Close the browser
    await browser.close();

    return translatedText;
}

module.exports = translate;