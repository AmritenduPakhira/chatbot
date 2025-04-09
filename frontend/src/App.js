import React, { useState, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Load previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/messages');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, []);

  // Send user message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };

    // Show user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: input }) // Only text is sent, bot handles the rest
      });

      const data = await res.json();

      // Add bot reply to UI
      setMessages(prev => [...prev, { from: 'bot', text: data.text }]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center" }}>🤖 ChatGPT Bot</h2>
      <div style={{ height: "300px", overflowY: "auto", padding: "10px", background: "#f9f9f9", marginBottom: "10px", borderRadius: "5px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === 'user' ? 'right' : 'left' }}>
            <p style={{
              background: msg.from === 'user' ? "#d1e7dd" : "#e2e3e5",
              display: "inline-block",
              padding: "8px 12px",
              borderRadius: "20px",
              margin: "5px 0"
            }}>
              <strong>{msg.from}:</strong> {msg.text}
            </p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }}
        />
        <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "10px 20px", borderRadius: "20px", background: "#007bff", color: "#fff", border: "none" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
