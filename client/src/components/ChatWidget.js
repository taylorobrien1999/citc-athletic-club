import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import './ChatWidget.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PERSONAS = {
  public: { name: 'Pace', emoji: '🏃', greeting: "Hi, I'm Pace! 😊 Ask me anything about joining, programs, or schedules!" },
  admin: { name: 'Coach Byte', emoji: '🥇', greeting: "Hi, I'm Coach Byte! Ask me how to do anything in your Admin Dashboard — like \"How do I add a program?\" or \"Where do I edit the hero image?\"" },
};

// mode: 'public' (default, no auth) or 'admin' (requires admin login, uses /api/chat/admin)
export default function ChatWidget({ mode = 'public' }) {
  const { token } = useAuth();
  const persona = PERSONAS[mode] || PERSONAS.public;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: persona.greeting },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const endpoint = mode === 'admin' ? `${API_URL}/api/chat/admin` : `${API_URL}/api/chat`;
      const headers = { 'Content-Type': 'application/json' };
      if (mode === 'admin' && token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: trimmed, mode }),
      });
      const data = await res.json();

      setMessages(prev => [...prev, { role: 'assistant', text: data.reply, fallback: data.fallback }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Sorry, something went wrong. Please try again or contact CITC directly.',
        fallback: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chat-widget ${mode === 'admin' ? 'chat-widget--admin' : ''}`}>
      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <span className="chat-header-avatar">{persona.emoji}</span>
            <span className="chat-header-name">{persona.name}</span>
            <button className="chat-close-btn" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>

          <div className="chat-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-row chat-row--${m.role}`}>
                {m.role === 'assistant' && <span className="chat-avatar">{persona.emoji}</span>}
                <div className={`chat-bubble chat-bubble--${m.role}${m.fallback ? ' chat-bubble--fallback' : ''}`}>
                  {m.role === 'assistant' ? (
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-row chat-row--assistant">
                <span className="chat-avatar">{persona.emoji}</span>
                <div className="chat-bubble chat-bubble--assistant chat-bubble--typing">
                  <span className="chat-typing-dot"></span>
                  <span className="chat-typing-dot"></span>
                  <span className="chat-typing-dot"></span>
                </div>
              </div>
            )}
          </div>

          <form className="chat-input-row" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>Send</button>
          </form>
        </div>
      )}

      <button className="chat-toggle-btn" onClick={() => setOpen(prev => !prev)} aria-label="Open chat">
        {open ? '×' : '💬'}
      </button>
    </div>
  );
}