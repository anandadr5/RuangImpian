import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/chat.css";

const Chat = () => {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  useEffect(() => {
    if (chatHistory.length === 0) return;

    const latestMessage = chatHistory[chatHistory.length - 1];
    if (latestMessage.role === "user") {
      sendAIResponse();
    }
  }, [chatHistory]);

  const sendAIResponse = async () => {
    try {
      const userMessages = chatHistory
        .filter((message) => message.role === "user")
        .map((message) => message.content)
        .join("\n");

      const response = await axios.post(
        "https://api.openai.com/v1/engines/davinci/completions",
        {
          prompt: userMessages,
          max_tokens: 50,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const aiMessage = { role: "ai", content: response.data.choices[0].text };
      setChatHistory([...chatHistory, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const message = { role: "user", content: inputText };
    setChatHistory([...chatHistory, message]);
    setInputText("");
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {" "}
        {chatHistory.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
