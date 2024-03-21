const express = require('express');
const { Translate } = require('@google-cloud/translate').v2;

const app = express();
const port = process.env.PORT || 3005;  // Replace the port number 3000 with other number if it didn't work
const projectId = 'rare-shadow-276706'; // Replace 'YOUR_PROJECT_ID' with your actual Google Cloud project ID

// Configure Google Cloud Translate
const translate = new Translate({ projectId });

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Endpoint to handle translation requests
app.get('/translate', async (req, res) => {
    const text = req.query.text;
    const sourceLanguage = req.query.source;
    const targetLanguage = req.query.target;

    try {
        const [translation] = await translate.translate(text, { from: sourceLanguage, to: targetLanguage });
        res.json({ translation });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed.' });
    }
});

// Endpoint to fetch supported languages
app.get('/languages', async (req, res) => {
    try {
        const [languages] = await translate.getLanguages();
        res.json({ languages });
    } catch (error) {
        console.error('Error fetching supported languages:', error);
        res.status(500).json({ error: 'Failed to fetch supported languages.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
