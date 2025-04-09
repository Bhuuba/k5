import React, { useState, useRef, useEffect } from "react";
import s from "./Pdf.module.css";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
  // Placeholder для keywords, якщо API не поверне дані
  const placeholderKeywords = ["Keyword 1", "Keyword 2", "Keyword 3"];

  // Стан для попапу копіювання
  const [copyPopupVisible, setCopyPopupVisible] = useState(false);
  // Стан для попапу завантаження (успіх/помилка)
  const [uploadPopup, setUploadPopup] = useState({
    visible: false,
    message: "",
    type: "success", // "success" або "error"
  });
  // Стан для історії запитів
  const [history, setHistory] = useState([]);
  // Стан для даних, отриманих з API
  const [summaryData, setSummaryData] = useState({
    summary: "Generated summary will appear here...",
    highlights: [
      "Приміром, тут якісь дефолтні пункти",
      "Інший дефолтний пункт",
    ],
    keywords: [],
  });
  const [loadingFile, setLoadingFile] = useState(false);
  // Стан для відображення модального вікна History
  const [showHistory, setShowHistory] = useState(false);

  // Ref для прихованого input[type="file"]
  const fileInputRef = useRef(null);

  // Завантаження історії з localStorage при монтуванні компонента
  useEffect(() => {
    const loadedHistory = loadHistory();
    setHistory(loadedHistory);
  }, []);

  // Збереження історії в localStorage при зміні
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  // Функція для копіювання тексту з попапом
  const handleCopy = async (text) => {
    try {
      await copyText(text);
      console.log("Text copied successfully!");
      setCopyPopupVisible(true);
      setTimeout(() => {
        setCopyPopupVisible(false);
      }, 3000);
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  // Обробка подій drag and drop
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

  // Відкриття вікна вибору файлу
  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Обробка вибору файлу через input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };

  // Функція завантаження файлу
  const handleFileUpload = async (file) => {
    setLoadingFile(true);
    try {
      const data = await apiUploadPdf(file);

      // Обробка keyTopics
      const highlightsArr = Array.isArray(data.keyTopics)
        ? data.keyTopics.map((item) => {
            const firstKey = Object.keys(item)[0];
            return item[firstKey];
          })
        : [];

      // Аналогічно для keywords
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

      // Отримуємо перше речення з резюме
      const firstSentence =
        data.pdfSummary && data.pdfSummary.length > 0
          ? data.pdfSummary.split(".")[0] + "."
          : "No summary available";

      // Оновлюємо локальну історію
      const newHistoryEntry = {
        filename: file.name,
        summary: firstSentence,
        timestamp: new Date(),
      };
      setHistory((prev) => [newHistoryEntry, ...prev]);

      // Зберігаємо історію у Firestore
      saveHistoryEntry(file.name, firstSentence);

      // Показ сповіщення про успіх
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

  // Якщо API не повернув keywords – використаємо placeholder
  const keywordsToShow =
    summaryData.keywords && summaryData.keywords.length > 0
      ? summaryData.keywords
      : placeholderKeywords;

  return (
    <div className={s.pageContainer}>
      {/* Попап копіювання */}
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

      {/* Попап завантаження */}
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

      {/* Верхній рядок: Заголовок та History */}
      <div className={s.headerRow}>
        <h2 className={s.title}>Upload Document</h2>
        <button
          className={s.historyBtn}
          onClick={() => setShowHistory(!showHistory)}
        >
          History
        </button>
      </div>

      {/* Блок для завантаження файлу: додано drag & drop */}
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
          />
        </div>
        {loadingFile && <p>Processing file...</p>}
      </div>

      {/* Рендеримо карточки лише якщо файл вже завантажено */}
      {!loadingFile &&
        summaryData.summary !== "Generated summary will appear here..." && (
          <>
            {/* Summary (pdfSummary) */}
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

            {/* Highlights (keyTopics) */}
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
                      {/* Використовуємо Bootstrap іконку; переконайтеся, що Bootstrap Icons підключені */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        right="15px"
                        fill="currentColor"
                        class="bi bi-dot"
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

            {/* Keywords (відображення як "чіпи") */}
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

      {/* Модальне вікно History */}
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
