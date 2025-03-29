import React, { useState } from "react";
import s from "./Video.module.css";

const Video = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [summaryData, setSummaryData] = useState({
    summary: "Loading summary...",
    timestamps: [
      { timestamp: "0:00", topic: "Loading..." },
      { timestamp: "2:30", topic: "Loading..." },
      { timestamp: "5:45", topic: "Loading..." },
      { timestamp: "8:15", topic: "Loading..." },
    ],
  });

  // Функція для показу попапу
  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  const handleGenerate = async () => {
    if (!inputUrl) {
      showPopup("Please enter a valid URL!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://63.176.101.250/api/v1/yt/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl, lang: "en" }),
      });

      if (!response.ok)
        throw new Error(`Request failed with status ${response.status}`);

      const data = await response.json();

      // Обробка відповіді згідно з новим форматом:
      // videoSummary – опис відео, keyTopics – масив об'єктів із timestamp та topic
      setSummaryData({
        summary: data.videoSummary || "No summary available.",
        timestamps: data.keyTopics || [],
      });
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummaryData({ summary: "Error loading summary.", timestamps: [] });
    }

    setLoading(false);
  };

  return (
    <div className={s.pageWrapper}>
      {/* Попап */}
      {popupMessage && <div className={s.popup}>{popupMessage}</div>}

      {/* Ввід URL */}
      <div className={s.card}>
        <h2 className={s.title}>Get Video Summary</h2>
        <div className={s.inputContainer}>
          <input
            type="text"
            placeholder="Paste YouTube URL here"
            className={s.input}
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
          <button className={s.button} onClick={handleGenerate}>
            Generate
          </button>
        </div>
      </div>

      {/* Лоадер */}
      {loading && (
        <div className={s.card}>
          <div className={s.loader}>
            <div className={s.spinner}></div>
            <p>Processing your video...</p>
          </div>
        </div>
      )}

      {/* Відео резюме */}
      <div className={s.card}>
        <h3 className={s.summaryTitle}>Video Summary</h3>
        <p className={s.summaryText}>{summaryData.summary}</p>
      </div>

      {/* Таймінги */}
      {summaryData.timestamps.length > 0 && (
        <div className={s.card}>
          <h3 className={s.summaryTitle}>Key Topics & Timestamps</h3>
          <ul className={s.timestampList}>
            {summaryData.timestamps.map((item, index) => (
              <li key={index} className={s.timestampItem}>
                <strong>{item.timestamp}</strong> - {item.topic}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Video;
