// REPLIT BACKEND REFERENCE - Copy this to your Replit project
// Add this if you are using a .env file
require('dotenv').config(); 

// 1. Import all the necessary libraries
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors'); // Make sure cors is imported

// 2. Set up the Express app
const app = express();
app.use(express.json());

// 3. THIS IS THE FIX: Enable CORS for all requests
app.use(cors());

// 4. Get your Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Add this BEFORE your existing routes
app.get('/', (req, res) => {
  res.json({ 
    status: 'MindGarden AI Backend is running!', 
    timestamp: new Date().toISOString(),
    hasApiKey: !!GEMINI_API_KEY,
    endpoints: {
      chat: '/chat',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', server: 'running' });
});

// 5. Initialize the Google AI Client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 6. Create the main "chat" endpoint
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are 'Gardy', a friendly and supportive AI companion for the Mind Garden app. Your role is to be a kind, empathetic listener. You are not a therapist. Never give medical advice. Keep your responses concise, gentle, and encouraging. The user just said: "${userMessage}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    res.json({ response: aiText });

  } catch (error) {
    console.error("Error in /chat endpoint:", error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

// 7. Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`AI server is running on port ${port}`);
});
