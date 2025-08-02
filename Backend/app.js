const express = require('express');
const http = require("http");
const fs = require("fs");
const cors = require('cors');
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require('mongodb');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const MongoDBClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function run() {
  try {
    await MongoDBClient.connect();
    await MongoDBClient.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await MongoDBClient.close();
  }
}
run().catch(MongoDBClient.dir);

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
    origin: ['http://localhost:3000', 'https://localhost:3001'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Incoming request: ' + req.url);
    next();
});

//endpoints here

// Gemini AI Chat endpoint
app.post('/api/gemini/chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Create a prompt with context if provided
        let prompt = message;
        if (context) {
            prompt = `Context: ${context}\n\nQuestion: ${message}`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            response: text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate response',
            message: error.message
        });
    }
});

// Gemini AI Disease Analysis endpoint
app.post('/api/gemini/analyze-disease', async (req, res) => {
    try {
        const { symptoms, location, demographics } = req.body;
        
        if (!symptoms) {
            return res.status(400).json({ error: 'Symptoms are required' });
        }

        const prompt = `
        As a medical information assistant, analyze the following health data:
        
        Symptoms: ${symptoms}
        ${location ? `Location: ${location}` : ''}
        ${demographics ? `Demographics: ${JSON.stringify(demographics)}` : ''}
        
        Please provide:
        1. Possible conditions that might match these symptoms
        2. Severity assessment
        3. Recommendations for next steps
        4. Any geographic health patterns if location is provided
        
        Note: This is for informational purposes only and should not replace professional medical advice.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            analysis: text,
            timestamp: new Date().toISOString(),
            disclaimer: "This analysis is for informational purposes only. Please consult healthcare professionals for medical advice."
        });

    } catch (error) {
        console.error('Gemini Disease Analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze disease data',
            message: error.message
        });
    }
});

// Gemini AI Health Insights endpoint
app.post('/api/gemini/health-insights', async (req, res) => {
    try {
        const { healthData, timeframe } = req.body;
        
        if (!healthData) {
            return res.status(400).json({ error: 'Health data is required' });
        }

        const prompt = `
        Analyze the following health data and provide insights:
        
        Health Data: ${JSON.stringify(healthData)}
        ${timeframe ? `Time Frame: ${timeframe}` : ''}
        
        Please provide:
        1. Trends and patterns in the data
        2. Risk factors identification
        3. Preventive measures recommendations
        4. Areas of concern that require attention
        
        Focus on population health trends and geographic patterns if applicable.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            insights: text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Gemini Health Insights error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate health insights',
            message: error.message
        });
    }
});

// Test Gemini connection endpoint
app.get('/api/gemini/test', async (req, res) => {
    try {
        const result = await model.generateContent("Say hello and confirm you're working correctly for a disease heatmap application.");
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            message: 'Gemini AI is connected successfully',
            response: text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Gemini test error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to connect to Gemini AI',
            message: error.message
        });
    }
});

app.use((req, res)=>{
    res.status(404).send('Not Found');
});

http.createServer(app).listen(port, () => {
    console.log(`HTTP server up and running on port ${port}`);
});