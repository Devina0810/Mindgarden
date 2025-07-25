# REPLIT BACKEND SETUP GUIDE

## Steps to Fix the 500 Error:

### 1. Check Your Replit Files
Make sure you have these files in your Replit project:

**index.js** (main server file):
```javascript
require('dotenv').config(); 

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Health check routes
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

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  try {
    console.log('Received chat request:', req.body);
    
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are 'Gardy', a friendly and supportive AI companion for the Mind Garden app. Your role is to be a kind, empathetic listener. You are not a therapist. Never give medical advice. Keep your responses concise, gentle, and encouraging. The user just said: "${userMessage}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    res.json({ response: aiText });

  } catch (error) {
    console.error("Error in /chat endpoint:", error);
    res.status(500).json({ 
      error: 'Failed to generate AI response',
      details: error.message 
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`AI server is running on port ${port}`);
  console.log('Gemini API Key configured:', !!GEMINI_API_KEY);
});
```

**package.json**:
```json
{
  "name": "mindgarden-backend",
  "version": "1.0.0",
  "description": "AI Backend for MindGarden App",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@google/generative-ai": "^0.1.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

### 2. Set Environment Variables in Replit
In your Replit project, go to the "Secrets" tab and add:
- Key: `GEMINI_API_KEY`
- Value: `AIzaSyDb_nXZ0U0OdMyp0N5UfKnz8JUWKjAaXVM` (the one from your .env comment)

### 3. Install Dependencies
In your Replit console, run:
```bash
npm install
```

### 4. Test the Server
After setting up, visit these URLs:
- `https://your-replit-url.replit.dev/` (should show status)
- `https://your-replit-url.replit.dev/health` (should show healthy)

## Debugging Tips:
1. Check the Replit console for error messages
2. Make sure the Gemini API key is set in Secrets
3. Verify all npm packages are installed
4. Test the root endpoint first before testing chat

## Your Current Replit URL:
https://b5e40920-0e5d-4cf8-8f34-a258952ca10c-00-1ajsvef5h36q8.pike.replit.dev/
