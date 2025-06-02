import React from "react";
import { useTranslation } from "react-i18next";
import "./CancelSubscriptionPopup.css";

const CancelSubscriptionPopup = ({ onConfirm, onCancel, daysLeft }) => {
  const { t } = useTranslation();

  return (
    <div className="cancel-popup-overlay">
      <div className="cancel-popup-content">
        <div className="cancel-popup-icon">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
        </div>
        <h3>{t("Cancel Subscription")}</h3>
        <p>
          {t("Subscription can be restored within")} {daysLeft} {t("days")}
        </p>
        <div className="cancel-popup-buttons">
          <button className="cancel-popup-button confirm" onClick={onConfirm}>
            {t("Yes, Cancel")}
          </button>
          <button className="cancel-popup-button decline" onClick={onCancel}>
            {t("No, Keep")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionPopup;
