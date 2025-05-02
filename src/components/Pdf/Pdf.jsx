import React, { useState, useRef, useEffect } from "react";
import s from "./Pdf.module.css";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { incrementPdfUsage, setPdfUsage } from "../../store/slices/usageSlice";
import { Navigate } from "react-router-dom";

const db = getFirestore();
const auth = getAuth();
const STORAGE_KEY = (uid) => `pdfUsage_${uid}`;

async function apiUploadPdf(file) {
  const formData = new FormData();
  formData.append("file", file);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch("http://18.184.60.63/api/v1/summarize/pdf", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function saveHistoryEntry(filename, summarySnippet) {
  const user = auth.currentUser;
  if (user) {
    await addDoc(collection(db, "history"), {
      uid: user.uid,
      filename,
      summary: summarySnippet,
      timestamp: new Date(),
    });
  }
}

async function copyText(text) {
  return navigator.clipboard.writeText(text);
}

const Pdf = () => {
  const [copyPopupVisible, setCopyPopupVisible] = useState(false);
  const [uploadPopup, setUploadPopup] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [history, setHistory] = useState([]);
  const [summaryData, setSummaryData] = useState({
    summary: "Generated summary will appear here...",
    highlights: [],
    keywords: [],
  });
  const [loadingFile, setLoadingFile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [uid, setUid] = useState(null);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { pdfUsage } = useSelector((state) => state.usage);
  const { isPremium } = useSelector((state) => state.user);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (uid && !isPremium) {
      const stored = localStorage.getItem(STORAGE_KEY(uid));
      if (stored != null) dispatch(setPdfUsage(Number(stored)));
    }
  }, [uid, isPremium, dispatch]);

  useEffect(() => {
    if (uid && !isPremium) localStorage.setItem(STORAGE_KEY(uid), pdfUsage);
  }, [uid, pdfUsage, isPremium]);

  const handleCopy = async (text) => {
    await copyText(text);
    setCopyPopupVisible(true);
    setTimeout(() => setCopyPopupVisible(false), 3000);
  };

  const handleFileUpload = async (file) => {
    if (!isPremium && pdfUsage >= 10) return;
    setLoadingFile(true);
    try {
      const data = await apiUploadPdf(file);
      const highlights = Array.isArray(data.keyTopics)
        ? data.keyTopics.map((i) => i[Object.keys(i)[0]])
        : [];
      const keywords = Array.isArray(data.keywords)
        ? data.keywords.map((i) => i[Object.keys(i)[0]])
        : [];

      setSummaryData({
        summary: data.pdfSummary || "No summary provided",
        highlights,
        keywords,
      });
      const firstSent = data.pdfSummary?.split(".")[0] + ".";
      setHistory((h) => [
        { filename: file.name, summary: firstSent, timestamp: new Date() },
        ...h,
      ]);
      saveHistoryEntry(file.name, firstSent);
      dispatch(incrementPdfUsage());
      setUploadPopup({
        visible: true,
        message: "Uploaded successfully!",
        type: "success",
      });
    } catch {
      setSummaryData({
        summary: "Error loading summary.",
        highlights: ["Error loading highlights."],
        keywords: ["Error loading keywords."],
      });
      setHistory((h) => [
        {
          filename: file.name,
          summary: "Error loading summary.",
          timestamp: new Date(),
        },
        ...h,
      ]);
      setUploadPopup({
        visible: true,
        message: "Error uploading!",
        type: "error",
      });
    } finally {
      setLoadingFile(false);
      setTimeout(
        () => setUploadPopup({ visible: false, message: "", type: "success" }),
        3000
      );
    }
  };

  if (!isPremium && pdfUsage >= 10) return <Navigate to="/pricing" />;

  return (
    <div className={s.pageContainer}>
      {copyPopupVisible && (
        <div className={`${s.toast} ${s.success}`}>Copied!</div>
      )}
      {uploadPopup.visible && (
        <div
          className={`${s.toast} ${
            uploadPopup.type === "error" ? s.error : s.success
          }`}
        >
          {uploadPopup.message}
        </div>
      )}

      <div className={s.headerRow}>
        <h2 className={s.title}>Upload Document</h2>
        <button
          className={`${s.historyBtn} ${s.animatedButton}`}
          onClick={() => setShowHistory(!showHistory)}
        >
          History
        </button>
      </div>
      {!isPremium && <p className={s.usageCount}>Used: {pdfUsage}/10</p>}

      <div
        className={s.uploadCard}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files[0]);
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={s.dropArea}>
          <p>Drag & drop file or</p>
          <button className={s.chooseFileBtn}>Choose File</button>
          <p className={s.formatsText}>PDF, DOCX, TXT</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) =>
              e.target.files.length && handleFileUpload(e.target.files[0])
            }
            accept=".pdf,.docx,.txt"
            style={{ display: "none" }}
          />
        </div>
        {loadingFile && <p>Processing...</p>}
      </div>

      {summaryData.summary !== "Generated summary will appear here..." &&
        !loadingFile && (
          <>
            <div className={s.infoCard}>
              <div
                className={s.copyIcon}
                onClick={() => handleCopy(summaryData.summary)}
              >
                📋
              </div>
              <h3>Summary</h3>
              <p>{summaryData.summary}</p>
            </div>
            <div className={s.infoCard}>
              <div
                className={s.copyIcon}
                onClick={() => handleCopy(summaryData.highlights.join(", "))}
              >
                📋
              </div>
              <h3>Highlights</h3>
              {summaryData.highlights.length ? (
                <ul>
                  {summaryData.highlights.map((h, i) => (
                    <li key={i}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        fill="currentColor"
                        class="bi bi-dot"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No highlights</p>
              )}
            </div>
            <div className={s.infoCard}>
              <div
                className={s.copyIcon}
                onClick={() =>
                  handleCopy(
                    (summaryData.keywords.length
                      ? summaryData.keywords
                      : ["Keyword 1", "Keyword 2"]
                    ).join(", ")
                  )
                }
              >
                📋
              </div>
              <h3>Keywords</h3>
              <div className={s.keywordsContainer}>
                {(summaryData.keywords.length
                  ? summaryData.keywords
                  : ["Keyword 1", "Keyword 2"]
                ).map((k, i) => (
                  <span key={i} className={s.keyword}>
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

      {showHistory && (
        <div className={s.modalOverlay} onClick={() => setShowHistory(false)}>
          <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={s.closeModalBtn}
              onClick={() => setShowHistory(false)}
            >
              ✕
            </button>
            <h3>History</h3>
            {history.length ? (
              <ul>
                {history.map((e, i) => (
                  <li key={i}>
                    <strong>{e.filename}</strong>: {e.summary}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No history</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pdf;
