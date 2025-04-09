const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); 


//save a message
router.post('/', async(req, res) =>{
    const { from, text } = req.body;

    try {
        const message = new Message({ from, text });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

//get all messages

router.get('/', async(req, res) =>{
    try {
        const messages = await Message.find().sort({timestamp : 1});
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;