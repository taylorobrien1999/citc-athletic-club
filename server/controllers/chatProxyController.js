// This controller demonstrates the microservice boundary: the main app does not
// contain any AI logic itself — it forwards requests to a separate, independently
// deployed chatbot service and relays the response. If that service is unreachable,
// the main app degrades gracefully instead of crashing or hanging.

const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || 'http://localhost:5050';

const proxyChat = async (req, res) => {
  try {
    const { message, mode } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'A message is required.' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // don't hang forever if the service is down

    const response = await fetch(`${CHATBOT_SERVICE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, mode }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Chatbot service unreachable:', err.message);
    // Graceful failure — the widget still gets a sensible response instead of an error.
    return res.status(200).json({
      reply: "Our chat assistant is temporarily unavailable. Please contact CITC directly at CalgaryInternationalTrackClub@gmail.com.",
      fallback: true,
    });
  }
};

module.exports = { proxyChat };
