const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { Configuration, OpenAIApi } = require("openai");


const Configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(Configuration);
//save a message
router.post('/', async (req, res) => {
    const { text } = req.body;

    try {
        const usermessage = new Message({ from: "user", text });
        await usermessage.save();

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", // ya gpt-4
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: text }
            ]
        });

        const botReply = completion.data.choices[0].message.content;

        const botMessage = new Message({ from: "bot", text: botReply });
        await botMessage.save();


        res.status(201).json({text: botReply });
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

//get all messages

router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;