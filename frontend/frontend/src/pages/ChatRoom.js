import React, { useState, useEffect, useRef } from "react";
import "./ChatRoom.css";

function ChatRoom({ participantsEmails, token, onBack, chatId: initialChatId }) {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const wsRef = useRef(null);
  const chatIdRef = useRef(initialChatId);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchChatAndMessages = async () => {
      try {
        let id = chatIdRef.current;

        // створюємо чат, якщо його ще немає
        if (!id) {
          const res = await fetch("http://localhost:8000/chat/create/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ participants: participantsEmails }),
          });
          const data = await res.json();
          if (!isMounted) return;
          setChat(data);
          chatIdRef.current = data.id;
          id = data.id;
        } else {
          const res = await fetch(`http://localhost:8000/chat/${id}/`, {
            headers: { Authorization: `Token ${token}` },
          });
          const data = await res.json();
          if (!isMounted) return;
          setChat(data);
        }

        // отримуємо повідомлення
        const messagesRes = await fetch(`http://localhost:8000/chat/${id}/messages/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const messagesData = await messagesRes.json();
        if (!isMounted) return;

        const unifiedMessages = messagesData.map((m) => ({
          senderId: m.sender,
          text: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        }));
        setMessages(unifiedMessages);

        // підключення WebSocket
        const socket = new WebSocket(`ws://localhost:8000/ws/chat/${id}/`);
        wsRef.current = socket;

        socket.onmessage = (e) => {
          const m = JSON.parse(e.data);

          if (m.message) {
            const msg = m.message;
            setMessages((prev) => [
              ...prev,
              {
                senderId: msg.sender,
                text: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content),
              },
            ]);
          }
        };

        socket.onclose = () => console.log("WebSocket closed");
        socket.onerror = (err) => console.error("WebSocket error:", err);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChatAndMessages();

    return () => {
      isMounted = false;
      if (wsRef.current) wsRef.current.close();
    };
  }, [participantsEmails, token]);

  const handleSend = () => {
    if (!inputMessage.trim() || !wsRef.current || !chat) return;

    wsRef.current.send(
      JSON.stringify({
        content: inputMessage,
        token,
        room_id: chat.id,
      })
    );
    setInputMessage("");
  };

  // автоскролл до останнього повідомлення
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!chat) return <p className="loading">Loading chat...</p>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="btn back-btn" onClick={onBack}>
          Back
        </button>
        <h2 className="chat-title">
          Chat with: {chat.participants.map((p) => p.first_name).join(", ")}
        </h2>
      </div>

     <div className="chat-messages">
        {messages.map((m, idx) => {
            const senderUser = chat.participants.find((p) => p.id === m.senderId);
            const senderName = senderUser ? senderUser.first_name : "Unknown";
            const isSelf = participantsEmails[0] === senderUser?.email;

            return (
            <div key={idx} className={`chat-msg ${isSelf ? "self" : "other"}`}>
                <span className="sender-name">{senderName}:</span>
                <span className="message-text">{m.text}</span>
            </div>
            );
        })}
        <div ref={messagesEndRef} />
        </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn send-btn" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;

