const mongoose = require('mongoose');   

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/chatbot', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

module.exports = connectDB;
