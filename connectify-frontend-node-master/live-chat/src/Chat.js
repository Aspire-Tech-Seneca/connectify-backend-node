import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000"); // Connect to backend

function Chat() {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId && token) {
      socket.emit("join", { userId, token });

      socket.on("matchedUsers", (users) => setMatchedUsers(users));
      socket.on("chatHistory", (history) => setMessages(history));
      socket.on("message", (msg) => setMessages((prev) => [...prev, msg]));
    }
  }, [userId, token]);

  const startChat = (receiver) => {
    setReceiverId(receiver);
    socket.emit("startChat", { senderId: userId, receiverId: receiver });
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", { senderId: userId, receiverId, message });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Live Chat</h2>
      <h3>Matched Users</h3>
      <ul>
        {matchedUsers.map((user) => (
          <li key={user.id} onClick={() => startChat(user.id)}>{user.name}</li>
        ))}
      </ul>

      <h3>Chat</h3>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.senderId}:</strong> {msg.message}</p>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
