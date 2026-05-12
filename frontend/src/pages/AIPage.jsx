import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CHAT_CHIPS } from '../data/travelData';
import './AIPage.css';

const SYSTEM_PROMPT = `You are Eeeztrip's expert AI travel assistant for India.
When users ask about trips, ALWAYS provide:
- Specific price estimates in Indian Rupees (₹)
- Transport options: Train (IRCTC prices), Flight, Bus with estimated fares
- Hotel recommendations with per-night costs (budget ₹500–2000, mid ₹2000–5000, luxury ₹5000+)
- Top 5 attractions with entry fees and insider tips
- Food spots with average meal costs
- Best season to visit
- Day-wise itinerary when asked
- Total trip budget breakdown at the end
Format with emojis for readability. Be practical, enthusiastic and concise — like a knowledgeable Indian travel friend.`;

export default function AIPage() {
  const { chatMessages, setChatMessages, pendingChatPrompt, setPendingChatPrompt } = useApp();
  const [input,     setInput]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const msgsEndRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Fire pending prompt from Mood/Home pages
  useEffect(() => {
    if (pendingChatPrompt) {
      setInput(pendingChatPrompt);
      setPendingChatPrompt('');
      setTimeout(() => handleSend(pendingChatPrompt), 200);
    }
    
  }, []);

  const handleSend = async (overrideText) => {
    const txt = (overrideText || input).trim();
    if (!txt || isLoading) return;
    setInput('');

    const userMsg = { role: 'user', content: txt };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages([...newMessages, { role: 'ai', content: '__loading__' }]);
    setIsLoading(true);

    try {
      const token = sessionStorage.getItem('token');

const res = await fetch('/api/ai/chat', {
  method: 'POST',

  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },

  body: JSON.stringify({
    messages: newMessages
      .filter(m => m.role !== 'ai' || m.content !== '__loading__')
      .slice(-6),
  }),
});

const data = await res.json();

const reply = data.reply || 'Sorry, AI is unavailable right now.';
      setChatMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'ai', content: reply };
        return copy;
      });
    } catch {
      setChatMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'ai', content: '⚠️ Connection error. Please try again in a moment.' };
        return copy;
      });
    }
    setIsLoading(false);
  };

  const handleChip = (prompt) => {
    setInput(prompt);
    setTimeout(() => handleSend(prompt), 150);
  };

  return (
    <div className="page page-enter" id="pg-ai">
      <h2 className="sec-title" style={{ marginBottom: '0.4rem' }}>
        🤖 AI Travel <span>Assistant</span>
      </h2>
      <p className="page-sub">Ask anything — budgets, itineraries, food, weather, visa, packing tips.</p>

      {/* CHIPS */}
      <div className="chip-row">
        {CHAT_CHIPS.map((c, i) => (
          <div key={i} className="chip" onClick={() => handleChip(c.prompt)}>
            {c.label}
          </div>
        ))}
      </div>

      {/* CHAT BOX */}
      <div className="chat-wrap">
        <div className="chat-hdr">
          <div className="chat-dot" />
          <div>
            <div className="chat-hdr__title">Eeeztrip AI Assistant</div>
            <div className="chat-hdr__sub">Powered by Gemini AI • Knows every corner of India</div>
          </div>
        </div>

        <div className="chat-msgs">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`msg msg--${msg.role === 'ai' ? 'ai' : 'u'}`}>
              <div className="av">{msg.role === 'ai' ? '✈' : '👤'}</div>
              <div className="bubble">
                {msg.content === '__loading__'
                  ? <div className="dots"><span>●</span><span>●</span><span>●</span></div>
                  : msg.content}
              </div>
            </div>
          ))}
          <div ref={msgsEndRef} />
        </div>

        <div className="chat-ft">
          <input
            className="chat-inp"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. Plan a 5-day trip to Rajasthan for ₹15,000..."
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <button
            className="btn-send"
            onClick={() => handleSend()}
            disabled={isLoading}
          >
            Send ↗
          </button>
        </div>
      </div>
    </div>
  );
}
