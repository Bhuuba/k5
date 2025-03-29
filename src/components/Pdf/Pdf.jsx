import React, { useState, useRef } from "react";
import s from "./Pdf.module.css";

const Pdf = () => {
  // Placeholder-значення для keywords, якщо API не поверне дані
  const placeholderKeywords = ["Keyword 1", "Keyword 2", "Keyword 3"];

  // Функція копіювання тексту в буфер обміну
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Стан для вибору алгоритму обробки
  const [algorithm, setAlgorithm] = useState("GPT Algorithm");
  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  // Стан для модального вікна History
  const [showHistory, setShowHistory] = useState(false);
  const handleHistoryClick = () => {
    setShowHistory(!showHistory);
  };

  // Стан для роботи із завантаженим файлом
  const [selectedFile, setSelectedFile] = useState(null);
  // Стан для збереження даних з API: pdfSummary, keyTopics, keywords
  const [summaryData, setSummaryData] = useState({
    summary: "Generated summary will appear here...",
    highlights: [
      "Приміром, тут якісь дефолтні пункти",
      "Інший дефолтний пункт",
    ],
    keywords: [],
  });
  const [loadingFile, setLoadingFile] = useState(false);

  // Ref для прихованого input[type="file"]
  const fileInputRef = useRef(null);

  // Відкриття вікна вибору файлу
  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Обробка вибору файлу
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Автоматичне завантаження файлу
      handleFileUpload(file);
    }
  };

  // Завантаження файлу на API
  const handleFileUpload = async (file) => {
    setLoadingFile(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://63.176.101.250/api/v1/summarize/pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      // Якщо keyTopics приходять у форматі [{0: "..."}], то беремо перше значення об'єкта
      const highlightsArr = Array.isArray(data.keyTopics)
        ? data.keyTopics.map((item) => {
            const firstKey = Object.keys(item)[0];
            return item[firstKey];
          })
        : [];

      // Аналогічно для keywords, якщо там теж [{0: "закон"}, {1: "інформація"}, ...]
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
    } catch (error) {
      console.error("Error uploading file:", error);
      // Якщо сталася помилка, в усіх трьох полях відобразиться "Error..."
      setSummaryData({
        summary: "Error loading summary.",
        highlights: ["Error loading highlights."],
        keywords: ["Error loading keywords."],
      });
    } finally {
      setLoadingFile(false);
    }
  };

  // Якщо API не повернуло keywords – використаємо placeholder
  const keywordsToShow =
    summaryData.keywords && summaryData.keywords.length > 0
      ? summaryData.keywords
      : placeholderKeywords;

  return (
    <div className={s.pageContainer}>
      {/* Верхній рядок: Заголовок та History */}
      <div className={s.headerRow}>
        <h2 className={s.title}>Upload Document</h2>
        <button className={s.historyBtn} onClick={handleHistoryClick}>
          History
        </button>
      </div>

      {/* Блок для завантаження файлу */}
      <div className={s.uploadCard}>
        <div className={s.dropArea} onClick={handleChooseFile}>
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

      {/* Вибір алгоритму */}
      <label className={s.algorithmLabel} htmlFor="algorithmSelect">
        Processing Algorithm
      </label>
      <div className={s.algorithmRow}>
        <select
          id="algorithmSelect"
          className={s.algorithmSelect}
          value={algorithm}
          onChange={handleAlgorithmChange}
        >
          <option>GPT Algorithm</option>
          <option>Some Other Algorithm</option>
        </select>
      </div>

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
          <ul>
            {summaryData.highlights.map((item, index) => (
              <li key={index}>- {item}</li>
            ))}
          </ul>
        ) : (
          <p className={s.infoText}>No highlights provided</p>
        )}
      </div>

      {/* Keywords (перетворюємо об’єкти у рядки, відображаємо як "чіпи") */}
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

      {/* Модальне вікно History */}
      {showHistory && (
        <div className={s.modalOverlay}>
          <div className={s.modalContent}>
            <button className={s.closeModalBtn} onClick={handleHistoryClick}>
              ✕
            </button>
            <h3>History</h3>
            <p>
              Here is some history data or something else you want to show...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pdf;
