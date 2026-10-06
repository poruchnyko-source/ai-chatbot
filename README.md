# AI Tutor Chatbot

A modern web-based AI chat app with general Q&A and tutoring support, including math explanation.

## Features
- Responsive chat UI
- General-purpose AI responses
- School-level math support
- Markdown + math rendering
- Backend API ready for OpenAI
- Demo mode without API key

## Tech stack
- React + Vite
- Express + Node.js
- OpenAI API integration
- Markdown + KaTeX for math rendering

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your environment file:
   ```bash
   cp .env.example .env
   ```

3. Add your OpenAI API key to `.env`:
   ```env
   OPENAI_API_KEY=your_key_here
   ```

4. Start the full app:
   ```bash
   npm run dev
   ```

5. Open the app in the browser:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Demo mode
If you do not provide an API key, the app still runs in demo mode and returns a helpful default response.

## Production build
```bash
npm run build
```

## Notes
This is a strong starter project for an AI chatbot similar to ChatGPT, but designed for educational support and math tutoring.
