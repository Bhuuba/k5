import React, { useState, useEffect } from "react";
import s from "./Video.module.css";

const Video = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  // Стан для попапу копіювання (відображається у правому верхньому куті)
  const [copyPopup, setCopyPopup] = useState({ visible: false, message: "" });
  const [videoId, setVideoId] = useState(null);
  const [summaryData, setSummaryData] = useState({
    summary: "Loading summary...",
    timestamps: [
      { timestamp: "0:00", topic: "Loading..." },
      { timestamp: "2:30", topic: "Loading..." },
      { timestamp: "5:45", topic: "Loading..." },
      { timestamp: "8:15", topic: "Loading..." },
    ],
  });
  const [history, setHistory] = useState(() => {
    const storedHistory = localStorage.getItem("videoHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  // Збереження історії в localStorage при зміні
  useEffect(() => {
    localStorage.setItem("videoHistory", JSON.stringify(history));
  }, [history]);

  // Функція для показу попапу (завантаження/помилка)
  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  // Функція для показу попапу копіювання
  const showCopyPopup = (message) => {
    setCopyPopup({ visible: true, message });
    setTimeout(() => setCopyPopup({ visible: false, message: "" }), 3000);
  };

  // Функція для витягання ID відео з YouTube URL
  const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const handleGenerate = async () => {
    if (!inputUrl) {
      showPopup("Please enter a valid URL!");
      return;
    }
    const id = extractVideoId(inputUrl);
    if (!id) {
      showPopup("Invalid YouTube URL!");
      return;
    }
    setVideoId(id);
    setLoading(true);

    let fetchedSummary = "";
    try {
      const response = await fetch("http://63.176.101.250/api/v1/yt/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl, lang: "en" }),
      });

      if (!response.ok)
        throw new Error(`Request failed with status ${response.status}`);

      const data = await response.json();
      fetchedSummary = data.videoSummary || "No summary available.";
      setSummaryData({
        summary: fetchedSummary,
        timestamps: data.keyTopics || [],
      });
      showPopup("Video summary loaded successfully!");
    } catch (error) {
      console.error("Error fetching summary:", error);
      fetchedSummary = "Error loading summary.";
      setSummaryData({ summary: fetchedSummary, timestamps: [] });
      showPopup("Error loading summary!");
    }
    setLoading(false);

    // Формуємо прев'ю для історії (перші 1-3 слова)
    const words = fetchedSummary.split(" ").filter(Boolean);
    const preview = words.length > 0 ? words.slice(0, 3).join(" ") : "error";
    const newHistoryEntry = {
      url: inputUrl,
      preview,
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [newHistoryEntry, ...prev]);
  };

  // Функція копіювання тексту в буфер обміну
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showCopyPopup("Copied!");
    } catch (err) {
      console.error("Copy error:", err);
      showCopyPopup("Copy failed!");
    }
  };

  return (
    <div className={s.pageWrapper}>
      {/* Попап завантаження/помилки */}
      {popupMessage && <div className={s.popup}>{popupMessage}</div>}

      {/* Попап копіювання (праворуч вгорі) */}
      {copyPopup.visible && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "rgba(128,128,128,0.8)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            fontSize: "14px",
            zIndex: 1000,
          }}
        >
          {copyPopup.message}
        </div>
      )}

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

      {/* Відображення відео та інформації тільки коли завантаження завершено */}
      {!loading && videoId && summaryData.summary !== "Loading summary..." && (
        <>
          {/* Вбудоване відео */}
          <div className={s.card}>
            <h3 className={s.summaryTitle}>Video Preview</h3>
            <div className={s.videoFrame}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
                frameBorder="0"
                allow="encrypted-media"
                allowFullScreen
                title="Video Preview"
              ></iframe>
            </div>
          </div>

          {/* Резюме відео */}
          <div className={s.card}>
            <div
              className={s.copyIcon}
              onClick={() => handleCopy(summaryData.summary)}
              style={{ cursor: "pointer" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M10 1H2a1 1 0 0 0-1 1v11h1V2h8V1zm5 2H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 11H6V5h8v9z" />
              </svg>
            </div>
            <h3 className={s.summaryTitle}>Video Summary</h3>
            <p className={s.summaryText}>{summaryData.summary}</p>
          </div>

          {/* Key Topics & Timestamps */}
          {summaryData.timestamps.length > 0 && (
            <div className={s.card}>
              <div
                className={s.copyIcon}
                onClick={() =>
                  handleCopy(
                    summaryData.timestamps
                      .map((item) => `${item.timestamp} - ${item.topic}`)
                      .join("\n")
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M10 1H2a1 1 0 0 0-1 1v11h1V2h8V1zm5 2H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 11H6V5h8v9z" />
                </svg>
              </div>
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
        </>
      )}
    </div>
  );
};

export default Video;
