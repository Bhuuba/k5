import React from "react";
import { useTranslation } from "react-i18next";
import "./EmailChangeMethodPopup.css";

const EmailChangeMethodPopup = ({ onClose, onSelectMethod }) => {
  const { t } = useTranslation();

  return (
    <div className="method-popup-overlay">
      <div className="method-popup-content">
        <button className="close-popup" onClick={onClose}>
          ×
        </button>

        <h3>{t("Choose Email Change Method")}</h3>

        <div className="method-buttons">
          <button
            className="method-button google"
            onClick={() => onSelectMethod("google")}
          >
            <div className="method-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M12.545,12.151L12.545,12.151c0,1.054,0.952,1.91,2.127,1.91h2.127v2.127h-2.127c-2.341,0-4.254-1.799-4.254-4.037V7.913c0-2.238,1.913-4.037,4.254-4.037h4.254v2.127h-4.254c-1.175,0-2.127,0.856-2.127,1.91V12.151z M21.328,12.151L21.328,12.151c0,1.054-0.952,1.91-2.127,1.91h-2.127v2.127h2.127c2.341,0,4.254-1.799,4.254-4.037V7.913c0-2.238-1.913-4.037-4.254-4.037h-4.254v2.127h4.254c1.175,0,2.127,0.856,2.127,1.91V12.151z"
                />
              </svg>
            </div>
            <div className="method-content">
              <div className="method-title">
                {t("Change to Google Account")}
              </div>
              <div className="method-description">
                {t("Link your email to a different Google account")}
              </div>
            </div>
          </button>

          <button
            className="method-button email"
            onClick={() => onSelectMethod("email")}
          >
            <div className="method-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                />
              </svg>
            </div>
            <div className="method-content">
              <div className="method-title">{t("Change Email Address")}</div>
              <div className="method-description">
                {t("Update your email address manually")}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailChangeMethodPopup;
