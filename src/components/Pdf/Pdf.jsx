import React, { useState, useRef, useEffect } from "react";
import s from "./Pdf.module.css";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { incrementPdfUsage } from "../../store/slices/usageSlice";
import { Navigate } from "react-router-dom";

// Ініціалізація Firestore та Auth (припускаємо, що Firebase вже ініціалізовано)
const db = getFirestore();
const auth = getAuth();

// ==================== Допоміжні функції (сервіси) ====================

// Функція для завантаження PDF через API
async function apiUploadPdf(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://35.159.18.171/api/v1/summarize/pdf", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server returned ${response.status}: ${errorText}`);
  }

  return await response.json();
}

// Функція для збереження запису історії у Firestore
async function saveHistoryEntry(filename, summarySnippet) {
  if (auth.currentUser) {
    try {
      await addDoc(collection(db, "history"), {
        uid: auth.currentUser.uid,
        filename,
        summary: summarySnippet,
        timestamp: new Date(),
      });
      console.log("History saved in Firestore");
    } catch (err) {
      console.error("Error saving history entry:", err);
    }
  } else {
    console.error("User not authenticated");
  }
}

// Функція копіювання тексту в буфер обміну
async function copyText(text) {
  return navigator.clipboard.writeText(text);
}

// Функції для роботи з історією в localStorage
const STORAGE_KEY = "pdfHistory";
function loadHistory() {
  const storedHistory = localStorage.getItem(STORAGE_KEY);
  return storedHistory ? JSON.parse(storedHistory) : [];
}
function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
function addHistoryEntry(currentHistory, newEntry) {
  // Додаємо новий запис на початок списку
  return [newEntry, ...currentHistory];
}

// ==================== Головний компонент Pdf ====================

const Pdf = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [copyPopupVisible, setCopyPopupVisible] = useState(false);
  const [uploadPopup, setUploadPopup] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [history, setHistory] = useState([]);
  const [summaryData, setSummaryData] = useState({
    summary: "Generated summary will appear here...",
    highlights: [
      "Приміром, тут якісь дефолтні пункти",
      "Інший дефолтний пункт",
    ],
    keywords: [],
  });
  const [loadingFile, setLoadingFile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { pdfUsage } = useSelector((state) => state.usage);
  const { isPremium } = useSelector((state) => state.user);
  const placeholderKeywords = ["Keyword 1", "Keyword 2", "Keyword 3"];

  useEffect(() => {
    const loadedHistory = loadHistory();
    setHistory(loadedHistory);
  }, []);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const handleCopy = async (text) => {
    try {
      await copyText(text);
      setCopyPopupVisible(true);
      setTimeout(() => {
        setCopyPopupVisible(false);
      }, 3000);
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
      e.dataTransfer.clearData();
    }
  };

  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    if (!isPremium && pdfUsage >= 10) {
      setError(
        "You have reached the limit of free requests. Purchase premium to continue."
      );
      return;
    }

    setLoadingFile(true);
    try {
      const data = await apiUploadPdf(file);

      const highlightsArr = Array.isArray(data.keyTopics)
        ? data.keyTopics.map((item) => {
            const firstKey = Object.keys(item)[0];
            return item[firstKey];
          })
        : [];

      const keywordsArr = Array.isArray(data.keywords)
        ? data.keywords.map((obj) => {
            const firstKey = Object.keys(obj)[0];
            return obj[firstKey];
          })
        : [];

      setSummaryData({
        summary: data.pdfSummary || "No summary provided",
        highlights: highlightsArr,
        keywords: keywordsArr,
      });

      const firstSentence =
        data.pdfSummary && data.pdfSummary.length > 0
          ? data.pdfSummary.split(".")[0] + "."
          : "No summary available";

      const newHistoryEntry = {
        filename: file.name,
        summary: firstSentence,
        timestamp: new Date(),
      };
      setHistory((prev) => [newHistoryEntry, ...prev]);
      saveHistoryEntry(file.name, firstSentence);
      dispatch(incrementPdfUsage());

      setUploadPopup({
        visible: true,
        message: "File uploaded successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setSummaryData({
        summary: "Error loading summary.",
        highlights: ["Error loading highlights."],
        keywords: ["Error loading keywords."],
      });
      const errorHistoryEntry = {
        filename: file.name,
        summary: "Error loading summary.",
        timestamp: new Date(),
      };
      setHistory((prev) => [errorHistoryEntry, ...prev]);
      saveHistoryEntry(file.name, "Error loading summary.");
      setUploadPopup({
        visible: true,
        message: "Error uploading file!",
        type: "error",
      });
    } finally {
      setLoadingFile(false);
      setTimeout(() => {
        setUploadPopup({ visible: false, message: "", type: "success" });
      }, 3000);
    }
  };

  const keywordsToShow =
    summaryData.keywords && summaryData.keywords.length > 0
      ? summaryData.keywords
      : placeholderKeywords;

  if (!isPremium && pdfUsage >= 10) {
    return <Navigate to="/pricing" />;
  }

  return (
    <div className={s.pageContainer}>
      {copyPopupVisible && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            backgroundColor: "black",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          Copied!
        </div>
      )}

      {uploadPopup.visible && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            backgroundColor: uploadPopup.type === "error" ? "red" : "green",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          {uploadPopup.message}
        </div>
      )}

      <div className={s.headerRow}>
        <h2 className={s.title}>Upload Document</h2>
        <button
          className={s.historyBtn}
          onClick={() => setShowHistory(!showHistory)}
        >
          History
        </button>
      </div>

      <p className={s.usageCount}>
        Used: {pdfUsage}/10 {isPremium && "(Premium - unlimited)"}
      </p>

      <div
        className={s.uploadCard}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleChooseFile}
      >
        <div className={s.dropArea}>
          <p>Drag and drop your file here or</p>
          <button
            className={s.chooseFileBtn}
            onClick={(e) => {
              e.stopPropagation();
              handleChooseFile();
            }}
          >
            Choose File
          </button>
          <p className={s.formatsText}>Supported formats: PDF, DOCX, TXT</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept=".pdf,.docx,.txt"
          />
        </div>
        {loadingFile && <p>Processing file...</p>}
      </div>

      {error && <div className={s.error}>{error}</div>}

      {!loadingFile &&
        summaryData.summary !== "Generated summary will appear here..." && (
          <>
            <div className={s.infoCard}>
              <div
                className={s.copyIcon}
                onClick={() => handleCopy(summaryData.summary)}
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
              <h3 className={s.infoTitle}>Summary</h3>
              <p className={s.infoText}>{summaryData.summary}</p>
            </div>

            <div className={s.infoCard}>
              <div
                className={s.copyIcon}
                onClick={() => handleCopy(summaryData.highlights.join(", "))}
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
              <h3 className={s.infoTitle}>Highlights</h3>
              {summaryData.highlights && summaryData.highlights.length > 0 ? (
                <ul className={s.highlightList}>
                  {summaryData.highlights.map((item, index) => (
                    <li key={index} className={s.highlightItem}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        right="15px"
                        fill="currentColor"
                        className="bi bi-dot"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={s.infoText}>No highlights provided</p>
              )}
            </div>

            <div className={s.infoCard}>
              <div
                className={s.copyIcon}
                onClick={() => handleCopy(keywordsToShow.join(", "))}
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
              <h3 className={s.infoTitle}>Keywords</h3>
              {keywordsToShow && keywordsToShow.length > 0 ? (
                <div className={s.keywordsContainer}>
                  {keywordsToShow.map((keyword, index) => (
                    <span key={index} className={s.keyword}>
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className={s.infoText}>No keywords provided</p>
              )}
            </div>
          </>
        )}

      {showHistory && (
        <div className={s.modalOverlay}>
          <div className={s.modalContent}>
            <button
              className={s.closeModalBtn}
              onClick={() => setShowHistory(!showHistory)}
            >
              ✕
            </button>
            <h3>History</h3>
            {history.length > 0 ? (
              <ul>
                {history.map((entry, index) => (
                  <li key={index}>
                    <strong>{entry.filename}</strong>: {entry.summary}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No history entries available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pdf;
