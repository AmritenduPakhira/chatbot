import React, { useState, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

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

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: input })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { from: 'bot', text: data.text }]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "50px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h2 style={{ textAlign: "center" }}>🤖 Chatbot</h2>

      <div style={{
        height: "300px",
        overflowY: "auto",
        padding: "10px",
        background: "#f9f9f9",
        marginBottom: "10px",
        borderRadius: "5px"
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: msg.from === 'user' ? 'row-reverse' : 'row',
              alignItems: "center",
              margin: "10px 0"
            }}
          >
            <img
              src={msg.from === 'user'
                ? "https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
                : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"}
              alt={msg.from}
              style={{ width: "35px", height: "35px", borderRadius: "50%", margin: "0 10px" }}
            />
            <div style={{
              background: msg.from === 'user' ? "#d1e7dd" : "#e2e3e5",
              padding: "10px 15px",
              borderRadius: "20px",
              maxWidth: "70%",
              wordBreak: "break-word"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            borderRadius: "20px",
            background: "#007bff",
            color: "#fff",
            border: "none"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
