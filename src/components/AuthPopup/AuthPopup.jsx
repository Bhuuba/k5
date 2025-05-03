import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./AuthPopup.css";

const AuthPopup = ({ onClose }) => {
  const { t } = useTranslation();

  const handleAuthAction = () => {
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>{t("Для доступу необхідно авторизуватися")}</h3>
        <div className="popup-buttons">
          <Link to="/login" className="popup-btn" onClick={handleAuthAction}>
            {t("Увійти")}
          </Link>
          <Link to="/register" className="popup-btn" onClick={handleAuthAction}>
            {t("Зареєструватися")}
          </Link>
        </div>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default AuthPopup;
