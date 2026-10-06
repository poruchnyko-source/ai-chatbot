import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

const systemPrompt = `
You are a friendly AI tutor and assistant.
Your job is to help with general questions, school learning, writing, coding, and math.
Be clear, helpful, and encouraging.
When users ask math questions, explain steps clearly and include formulas when useful.
Keep answers concise but informative.
`;

app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'online' });
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages are required.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const promptText = lastUserMessage?.content || 'Hello';

    return res.json({
      reply: `Demo mode is active because no OPENAI_API_KEY is set.\n\nYou asked: "${promptText}"\n\nThis app is ready for real AI responses. Add your OpenAI API key in a .env file and restart the server to enable full chat responses.`,
    });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 800,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role,
          content: String(m.content || ''),
        })),
      ],
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    return res.json({ reply: reply || 'I could not generate a response.' });
  } catch (error) {
    console.error('OpenAI request failed:', error);
    return res.status(500).json({ error: 'AI request failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`AI chatbot server running at http://localhost:${PORT}`);
});
