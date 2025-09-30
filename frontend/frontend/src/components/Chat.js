import React, { useState, useEffect, useRef } from "react";
import { logout } from "../api";

export default function Chat({ token, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/?token=${token}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [token]);

  const sendMessage = () => {
    if (wsRef.current && input.trim() !== "") {
      wsRef.current.send(JSON.stringify({ content: input }));
      setInput("");
    }
  };

  const handleLogout = async () => {
    await logout(token);
    onLogout();
  };

  return (
    <div className="card chat-container">
      <div className="chat-header">
        <h2>Chat</h2>
        <button onClick={handleLogout} className="btn logout-btn">
          Logout
        </button>
      </div>
      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className="chat-message">
            <b>{m.sender || "system"}:</b> {m.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage} className="btn">
          Send
        </button>
      </div>
    </div>
  );
}