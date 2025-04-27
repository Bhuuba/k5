import React, { useState, useEffect } from "react";
import s from "./Video.module.css";
import { useSelector, useDispatch } from "react-redux";
import { incrementVideoUsage } from "../../store/slices/usageSlice";
import { Navigate } from "react-router-dom";

const Video = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [summaryData, setSummaryData] = useState({
    summary: "Loading summary...",
    timestamps: [],
  });

  const dispatch = useDispatch();
  const { videoUsage } = useSelector((state) => state.usage);
  const { isPremium } = useSelector((state) => state.user);

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const handleGenerate = async () => {
    if (!isPremium && videoUsage >= 10) {
      showPopup(
        "You have reached the limit of free requests. Purchase premium to continue."
      );
      return;
    }

    if (!inputUrl) {
      showPopup("Please enter the URL of the video!");
      return;
    }

    const id = extractVideoId(inputUrl);
    if (!id) {
      showPopup("Invalid YouTube video URL!");
      return;
    }

    setVideoId(id);
    setAutoplay(false);
    setStartTime(0);
    setLoading(true);

    try {
      const response = await fetch("http://3.72.111.24/api/v1/yt/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl, lang: "en" }),
      });

      if (!response.ok) {
        throw new Error(`Request error: ${response.status}`);
      }

      const data = await response.json();
      setSummaryData({
        summary: data.videoSummary || "No content available.",
        timestamps: data.keyTopics || [],
      });
      dispatch(incrementVideoUsage());
      showPopup("Video analysis successfully completed!");
    } catch (error) {
      console.error("Error retrieving content:", error);
      setSummaryData({
        summary: "Error loading content.",
        timestamps: [],
      });
      showPopup("Video analysis error!");
    } finally {
      setLoading(false);
    }
  };

  const handleTimestampClick = (timestamp) => {
    const parts = timestamp.split(":").map(Number);
    const seconds =
      parts.length === 2
        ? parts[0] * 60 + parts[1]
        : parts[0] * 3600 + parts[1] * 60 + parts[2];

    setStartTime(seconds);
    setAutoplay(true);
  };

  if (!isPremium && videoUsage >= 10) {
    return <Navigate to="/pricing" />;
  }

  return (
    <div className={s.pageWrapper}>
      {popupMessage && <div className={s.popup}>{popupMessage}</div>}

      <div className={s.card}>
        <h2 className={s.title}>Get video summery</h2>
        <p className={s.usageCount}>
          Used: {videoUsage}/10 {isPremium && "(Premium - unlimited)"}
        </p>
        <div className={s.inputContainer}>
          <input
            type="text"
            placeholder="Insert a link to a YouTube video"
            className={s.input}
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
          <button
            className={s.button}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {loading && (
        <div className={s.card}>
          <div className={s.loader}>
            <div className={s.spinner}></div>
            <p>We analyze the video...</p>
          </div>
        </div>
      )}

      {!loading && videoId && summaryData.summary !== "Loading summary..." && (
        <>
          <div className={s.card}>
            <h3 className={s.summaryTitle}>Video preview</h3>
            <div className={s.videoFrame}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=${
                  autoplay ? 1 : 0
                }&start=${startTime}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Video Preview"
                key={`${videoId}-${startTime}-${autoplay}`}
              ></iframe>
            </div>
          </div>

          <div className={s.card}>
            <h3 className={s.summaryTitle}>Summery</h3>
            <p className={s.summaryText}>{summaryData.summary}</p>
          </div>

          {summaryData.timestamps.length > 0 && (
            <div className={s.card}>
              <h3 className={s.summaryTitle}>Key steps</h3>
              <ul className={s.timestampList}>
                {summaryData.timestamps.map((item, index) => (
                  <li
                    key={index}
                    className={s.timestampItem}
                    onClick={() => handleTimestampClick(item.timestamp)}
                  >
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
