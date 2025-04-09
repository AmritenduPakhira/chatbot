const express = require('express');
const router = express.Router();
const axios = require('axios');
const Message = require('../models/Message');
require('dotenv').config();

router.post('/', async (req, res) => {
  const { text } = req.body;

  try {
    const userMessage = new Message({ from: "user", text });
    await userMessage.save();

    const response = await axios.post(
      'https://api.cohere.ai/v1/chat',
      {
        message: text,
        model: "command-r-plus",
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = response.data.text || response.data.reply;

    

    const botMessage = new Message({ from: "bot", text: botReply });
    await botMessage.save();

    console.log("🤖 Bot reply:", botMessage);

    res.status(201).json({ text: botReply });
  } catch (error) {
    console.error("❌ Error in chatbot route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
