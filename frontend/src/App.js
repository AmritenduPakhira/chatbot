import React, { useState, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  // 🎙 Voice input handler
  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "50px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      background: "#fff"
    }}>
      <div style={{
        textAlign: "center",
        padding: "15px",
        marginBottom: "10px",
        background: "#007bff",
        color: "#fff",
        borderRadius: "12px"
      }}>
        <h2 style={{ margin: 0, fontSize: "24px" }}>
          🤖 ChatGPT Bot
        </h2>
      </div>

      <div style={{
        height: "320px",
        overflowY: "auto",
        padding: "10px",
        background: "#f1f1f1",
        marginBottom: "10px",
        borderRadius: "8px"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
            alignItems: "center",
            marginBottom: "8px"
          }}>
            {msg.from === 'bot' && (
              <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                alt="Bot"
                style={{ width: 32, height: 32, marginRight: 8 }} />
            )}
            {msg.from === 'user' && (
              <img src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
                alt="User"
                style={{ width: 32, height: 32, marginLeft: 8 }} />
            )}
            <p style={{
              background: msg.from === 'user' ? "#d1e7dd" : "#e2e3e5",
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: "20px",
              maxWidth: "70%"
            }}>
              {msg.text}
            </p>
          </div>
        ))}

        {/* Typing animation */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
              alt="Bot"
              style={{ width: 32, height: 32, marginRight: 8 }} />
            <div className="typing-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            marginRight: "8px"
          }}
        />
        <button onClick={sendMessage} style={{
          padding: "10px 20px",
          borderRadius: "20px",
          background: "#007bff",
          color: "#fff",
          border: "none"
        }}>
          Send
        </button>
        <button onClick={handleVoiceInput} style={{
          marginLeft: "6px",
          padding: "10px",
          borderRadius: "50%",
          border: "none",
          background: "#6c757d",
          color: "#fff"
        }}>
          🎙
        </button>
      </div>

      {/* Typing dots animation style */}
      <style>{`
        .typing-dots span {
          font-size: 32px;
          animation: blink 1.2s infinite;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

export default App;
