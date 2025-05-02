/* eslint-disable no-useless-escape */

import React, { useState, useEffect } from "react";
import s from "./Video.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementVideoUsage,
  setVideoUsage,
} from "../../store/slices/usageSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

const auth = getAuth();
const STORAGE_KEY = (uid) => `videoUsage_${uid}`;

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
  const [lengthOption, setLengthOption] = useState("medium"); // short, medium, long

  const dispatch = useDispatch();
  const { videoUsage } = useSelector((state) => state.usage);
  const { isPremium } = useSelector((state) => state.user);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (uid && !isPremium) {
      const stored = localStorage.getItem(STORAGE_KEY(uid));
      if (stored !== null) {
        dispatch(setVideoUsage(Number(stored)));
      }
    }
  }, [uid, isPremium, dispatch]);

  useEffect(() => {
    if (uid && !isPremium) {
      localStorage.setItem(STORAGE_KEY(uid), videoUsage);
    }
  }, [uid, videoUsage, isPremium]);

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
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
      // Debug: log payload
      console.log("Request payload:", {
        url: inputUrl,
        lang: "en",
        summ_length: lengthOption,
      });

      const response = await fetch("http://18.184.60.63/api/v1/yt/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: inputUrl,
          lang: "en",
          summ_length: lengthOption, // renamed field
        }),
      });

      console.log("Response status:", response.status, response.statusText);
      const data = await response.json();
      console.log("Response JSON:", data);

      if (!response.ok) throw new Error(`Request error: ${response.status}`);
      setSummaryData({
        summary: data.videoSummary || "No content available.",
        timestamps: data.keyTopics || [],
      });
      dispatch(incrementVideoUsage());
      showPopup("Video analysis successfully completed!");
    } catch (error) {
      console.error("Error retrieving content:", error);
      setSummaryData({ summary: "Error loading content.", timestamps: [] });
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
        <h2 className={s.title}>Get video summary</h2>
        {!isPremium ? (
          <p className={s.usageCount}>Used: {videoUsage}/10</p>
        ) : (
          <p></p>
        )}
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
        {/* Length selector */}
        <div className={s.lengthSelector}>
          <label htmlFor="length-select">Summary length:</label>
          <select
            id="length-select"
            value={lengthOption}
            onChange={(e) => setLengthOption(e.target.value)}
            className={s.select}
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
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

          <div className={`${s.card} position-relative`}>
            <h3 className={s.summaryTitle}>Summary</h3>
            <button
              type="button"
              className="btn btn-sm position-absolute top-0 end-0 m-2"
              onClick={() => {
                navigator.clipboard.writeText(summaryData.summary);
                showPopup("Summary copied!");
              }}
            >
              <i className="bi bi-clipboard"></i>
            </button>
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
