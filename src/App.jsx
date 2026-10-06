import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const starterMessages = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hi! I can answer general questions, explain school math, and help with study problems. Ask me anything.',
  },
];

const systemPrompt = `You are a friendly AI tutor and assistant. Help users with general questions, coding, writing, and school-level math. Explain clearly, use simple language, and when solving math problems, show step-by-step reasoning when useful. If asked to solve a problem, include the answer and brief explanation. Keep responses concise but helpful.`;

export default function App() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const chatMessages = useMemo(
    () => [{ role: 'system', content: systemPrompt }, ...messages.map((m) => ({ role: m.role, content: m.text }))],
    [messages]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: nextMessages.map((m) => ({ role: m.role, content: m.text })) }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      const data = await res.json();
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.reply || 'I could not generate a reply.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          text: 'Sorry, something went wrong while contacting the AI service. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AI STUDY ASSISTANT</p>
          <h1>Smart Tutor Chat</h1>
        </div>
        <button className="ghost-button" type="button" onClick={() => setMessages(starterMessages)}>
          New chat
        </button>
      </header>

      <main className="chat-panel">
        <div className="message-list">
          {messages.map((message) => (
            <div key={message.id} className={`message-row ${message.role}`}>
              <div className="avatar">{message.role === 'user' ? 'U' : 'AI'}</div>
              <div className="bubble">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="avatar">AI</div>
              <div className="bubble typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question, solve a math problem, or get help with a topic..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </form>
      </main>
    </div>
  );
}
