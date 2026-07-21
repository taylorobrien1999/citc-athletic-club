const { CITC_PUBLIC_CONTEXT } = require('../data/publicContext');
const { CITC_ADMIN_CONTEXT } = require('../data/adminContext');

const GEMINI_MODEL = 'gemini-3.5-flash-lite'; // current free-tier model as of July 2026
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ── POST /api/chat ─────────────────────────────────────────────────────────────
// Body: { message: string, mode: 'public' | 'admin' }
const chat = async (req, res) => {
  try {
    const { message, mode } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'A message is required.' });
    }

    const systemContext = mode === 'admin' ? CITC_ADMIN_CONTEXT : CITC_PUBLIC_CONTEXT;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set.');
      return res.status(500).json({
        reply: "I'm having trouble connecting right now. Please try again shortly, or contact CITC directly.",
        fallback: true,
      });
    }

    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemContext }],
        },
        contents: [
          { role: 'user', parts: [{ text: message }] },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 400,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      return res.status(200).json({
        reply: "I'm having trouble answering right now. Please try again in a moment, or reach out to CITC directly at CalgaryInternationalTrackClub@gmail.com.",
        fallback: true,
      });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "I'm not sure how to answer that — please try rephrasing, or contact CITC directly.";

    return res.status(200).json({ reply, fallback: false });
  } catch (err) {
    console.error('Chat controller error:', err);
    // Graceful fallback — the chatbot degrades to a helpful message instead of crashing.
    return res.status(200).json({
      reply: "Sorry, I'm temporarily unavailable. Please try again shortly or contact CITC directly.",
      fallback: true,
    });
  }
};

module.exports = { chat };