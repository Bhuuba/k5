import React from "react";
import s from "./Music.module.css";
const Music = () => {
  return (
    <div className={s.container}>
      {/* Заголовок */}
      <h2 className={s.title}>Chat with AI</h2>

      {/* Блок чат-вікна */}
      <div className={s.chatSection}>
        <div className={s.chatWindow}>
          <div className={s.chatMessage}>
            <span className={s.userLabel}>User:</span>
            <span className={s.messageText}>Hello, how can you help me?</span>
          </div>
          <div className={s.chatMessage}>
            <span className={s.aiLabel}>AI:</span>
            <span className={s.messageText}>
              Hi there! I'm here to assist you with any questions you have.
            </span>
          </div>
        </div>
        <div className={s.inputContainer}>
          <input
            type="text"
            placeholder="Type your message..."
            className={s.input}
          />
          <button className={s.button}>Send</button>
        </div>
      </div>

      {/* Інформаційний блок */}
      <div className={s.infoSection}>
        <h3 className={s.infoTitle}>Why use our AI Chatbot?</h3>
        <ul className={s.infoList}>
          <li>Instant and accurate responses</li>
          <li>Available 24/7</li>
          <li>User-friendly interface</li>
          <li>Continuous learning and improvement</li>
        </ul>
      </div>
    </div>
  );
};

export default Music;
