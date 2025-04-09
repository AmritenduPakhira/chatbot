import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('botReply', (data) => {
      setMessages(prev => [...prev, { from: 'bot', text: data.text }]);
    });
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { from: 'user', text: input }]);
      socket.emit('sendMessage', { text: input });
      setInput('');
    }
  };

  return (
    <div>
      <h2>Chatbot</h2>
      <div style={{ height: "300px", overflowY: "scroll" }}>
        {messages.map((msg, i) => (
          <div key={i}><strong>{msg.from}:</strong> {msg.text}</div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatApp;
