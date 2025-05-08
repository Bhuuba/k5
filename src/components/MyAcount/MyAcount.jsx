import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  getAuth,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { removeUser } from "../../store/slices/userSlice";
import {
  cancelSubscription,
  restoreSubscription,
} from "../../utils/premiumService";
import i18n from "i18next";
import CancelSubscriptionPopup from "./CancelSubscriptionPopup";
import PasswordChangePopup from "./PasswordChangePopup";
import "./MyAccount.css";

const MyAccount = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, isPremium, id: userId } = useSelector((state) => state.user);
  const auth = getAuth();
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [authMethods] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [isEmailProvider, setIsEmailProvider] = useState(false);

  useEffect(() => {
    const checkAuthMethods = async () => {
      if (auth.currentUser) {
        const providers = auth.currentUser.providerData.map(
          (p) => p.providerId
        );
        setIsEmailProvider(providers.includes("password"));
      }
    };
    checkAuthMethods();
  }, [auth.currentUser]);

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (isPremium && userId) {
        const db = getFirestore();
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setSubscriptionInfo({
            endDate: data.subscriptionEndDate?.toDate(),
            isAutoRenewal: data.isAutoRenewal,
          });
        }
      }
    };

    fetchSubscriptionInfo();
  }, [isPremium, userId]);

  const calculateDaysLeft = () => {
    if (!subscriptionInfo?.endDate) return 0;
    const now = new Date();
    const endDate = new Date(subscriptionInfo.endDate);
    // Устанавливаем время в полночь для обоих дат для точного сравнения дней
    now.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = endDate - now;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays); // Не позволяем показывать отрицательные дни
  };

  const handlePasswordChange = async (formData) => {
    try {
      const { currentPassword, newPassword } = formData;

      await reauthenticateWithCredential(
        auth.currentUser,
        EmailAuthProvider.credential(email, currentPassword)
      );

      await updatePassword(auth.currentUser, newPassword);
      setShowPasswordPopup(false);
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = t("Current password is incorrect");
          break;
        case "auth/weak-password":
          errorMessage = t("Password should be at least 6 characters");
          break;
        case "auth/requires-recent-login":
          errorMessage = t(
            "Please sign out and sign in again to change your password"
          );
          break;
        case "auth/invalid-credential":
          errorMessage = t(
            "Invalid credentials. Please check your current password"
          );
          break;
        case "auth/too-many-requests":
          errorMessage = t("Too many attempts. Please try again later");
          break;
        case "auth/network-request-failed":
          errorMessage = t(
            "Network error. Please check your internet connection"
          );
          break;
        default:
          errorMessage = error.message || t("Error updating password");
      }
      throw new Error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      setError(t("Error signing out. Please try again."));
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleCancelSubscription = async () => {
    try {
      const success = await cancelSubscription(userId);
      if (success) {
        setSuccess(
          t("Subscription auto-renewal has been cancelled successfully")
        );
        setSubscriptionInfo((prev) => ({
          ...prev,
          isAutoRenewal: false,
        }));
      }
    } catch (error) {
      setError(t("Error canceling subscription. Please try again."));
    } finally {
      setShowCancelPopup(false);
    }
  };

  const handleRestoreSubscription = async () => {
    try {
      const success = await restoreSubscription(userId);
      if (success) {
        setSuccess(
          t("Subscription auto-renewal has been restored successfully")
        );
        setSubscriptionInfo((prev) => ({
          ...prev,
          isAutoRenewal: true,
        }));
      }
    } catch (error) {
      setError(t("Error restoring subscription. Please try again."));
    }
  };

  return (
    <div className="account-container">
      <div className="account-card">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="account-header">
          <button
            className="settings-button"
            onClick={() => setShowSettingsPopup(true)}
          >
            <svg className="settings-icon" viewBox="0 0 24 24">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
            </svg>
          </button>
          <div className="profile-avatar">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`}
              alt={t("Profile Avatar")}
              className="avatar-image"
            />
          </div>
          <h2>{t("Profile Settings")}</h2>
          <p className="account-email">{email}</p>
          {isPremium && <div className="premium-badge">Premium</div>}
        </div>

        {showSettingsPopup && (
          <div className="settings-popup">
            <div className="popup-content">
              <button
                className="close-popup"
                onClick={() => setShowSettingsPopup(false)}
              >
                ×
              </button>
              <h3>{t("Account Settings")}</h3>

              {isEmailProvider && (
                <div className="settings-section">
                  <h4>{t("Security")}</h4>
                  <button
                    className="action-button"
                    onClick={() => {
                      setShowPasswordPopup(true);
                      setShowSettingsPopup(false);
                    }}
                  >
                    <svg
                      className="settings-icon"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                    >
                      <path
                        fill="currentColor"
                        d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
                      />
                    </svg>
                    {t("Change Password")}
                  </button>
                </div>
              )}

              <div className="settings-section">
                <h4>{t("Language")}</h4>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className="action-button"
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange("uk")}
                  className="action-button"
                >
                  Українська
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="account-body">
          <div className="account-section subscription-section">
            <h3>{t("Subscription")}</h3>
            {isPremium && subscriptionInfo ? (
              <>
                <div className="status-container">
                  <span className="status-label">{t("Status")}:</span>
                  <span className="premium-status">{t("Premium Active")}</span>
                </div>
                <div className="subscription-details">
                  <div className="detail-item">
                    <span className="detail-label">{t("Valid until")}:</span>
                    <span className="detail-value">
                      {subscriptionInfo.endDate?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">{t("Auto-renewal")}:</span>
                    <span className="detail-value">
                      {t(
                        subscriptionInfo.isAutoRenewal ? "Enabled" : "Disabled"
                      )}
                    </span>
                  </div>
                </div>
                {subscriptionInfo.isAutoRenewal ? (
                  <button
                    className="action-button cancel-button"
                    onClick={() => setShowCancelPopup(true)}
                  >
                    {t("Cancel Auto-renewal")}
                  </button>
                ) : (
                  <button
                    className="action-button restore-button"
                    onClick={handleRestoreSubscription}
                  >
                    {t("Restore Auto-renewal")}
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="status-text">{t("Free Plan")}</p>
                <button
                  className="upgrade-button"
                  onClick={() => navigate("/pricing")}
                >
                  {t("Upgrade to Premium")}
                </button>
              </>
            )}
          </div>
        </div>

        {showPasswordPopup && (
          <PasswordChangePopup
            onClose={() => setShowPasswordPopup(false)}
            onSubmit={handlePasswordChange}
          />
        )}

        {showCancelPopup && (
          <CancelSubscriptionPopup
            onConfirm={handleCancelSubscription}
            onCancel={() => setShowCancelPopup(false)}
            daysLeft={calculateDaysLeft()}
          />
        )}

        <div className="account-footer">
          <button onClick={handleLogout} className="logout-button">
            {t("Sign Out")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
