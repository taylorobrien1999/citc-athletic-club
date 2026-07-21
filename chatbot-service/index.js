const express = require('express');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors()); // open — this is a stateless, low-risk public/admin chat proxy
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CITC Chatbot microservice running.' });
});

app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Chatbot microservice running on port ${PORT}`));
