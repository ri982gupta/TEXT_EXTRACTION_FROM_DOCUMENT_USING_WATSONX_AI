require('dotenv').config();
const watson = require('ibm-watson');
const express = require('express');
const multer = require('multer');
const { IamAuthenticator } = require('ibm-watson/auth');
const { NaturalLanguageUnderstandingV1 } = require('ibm-watson');
const fs = require('fs');
const app = express();
const port = 3000;

// Configure storage for Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Construct the service URL using the environment variable
const serviceUrl = `${process.env.WATSON_URL}/v1/analyze`;

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2021-03-10',
    authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_APIKEY,
    }),
    serviceUrl: serviceUrl,
});

app.post('/analyze-document', upload.single('document'), async (req, res) => {
    const documentBuffer = req.file.buffer; // Get the file buffer from the request
    const params = {
        text: documentBuffer.toString(),
        features: ['entities', 'keywords'],
    };

    try {
        const result = await naturalLanguageUnderstanding.analyze(params).catch(err => console.log(err));
        res.json(JSON.stringify(result.result, null, 2));
    } catch (err) {
        console.error(err);
        res.status(500).send('Error analyzing document');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
