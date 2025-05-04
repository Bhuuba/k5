import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./PasswordChangePopup.css";

const PasswordChangePopup = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  // Очищаем ошибки при монтировании
  useEffect(() => {
    setErrors({});
    setApiError("");
    setSuccess("");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очищаем ошибки поля при изменении
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setApiError(""); // Очищаем ошибку API при любом изменении
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = t("Current password is required");
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t("New password is required");
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t("Password must be at least 6 characters");
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("Please confirm your new password");
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = t("Passwords do not match");
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      setSuccess(t("Password successfully updated!"));
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setApiError(error.message || t("Error updating password"));
    }
  };

  return (
    <div className="password-popup-overlay">
      <div className="password-popup-content">
        <button className="close-popup" onClick={onClose}>
          ×
        </button>
        <h3>{t("Change Password")}</h3>

        {apiError && (
          <div className="popup-error-message">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              />
            </svg>
            {apiError}
          </div>
        )}

        {success && (
          <div className="popup-success-message">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
              />
            </svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label>{t("Current Password")}</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={errors.currentPassword ? "input-error" : ""}
              placeholder={t("Enter current password")}
            />
            {errors.currentPassword && (
              <span className="error-text">{errors.currentPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label>{t("New Password")}</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? "input-error" : ""}
              placeholder={t("Enter new password")}
            />
            {errors.newPassword && (
              <span className="error-text">{errors.newPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label>{t("Confirm New Password")}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "input-error" : ""}
              placeholder={t("Confirm new password")}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="submit-button">
            {t("Update Password")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangePopup;
