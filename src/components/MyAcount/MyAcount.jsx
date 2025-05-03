import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  signOut,
  linkWithPopup,
  GoogleAuthProvider,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  linkWithCredential,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../../firebase";
import { removeUser, setUser } from "../../store/slices/userSlice";
import {
  cancelSubscription,
  restoreSubscription,
} from "../../utils/premiumService";
import i18n from "i18next";
import CancelSubscriptionPopup from "./CancelSubscriptionPopup";
import EmailChangeMethodPopup from "./EmailChangeMethodPopup";
import "./MyAccount.css";

const MyAccount = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, isPremium, id: userId } = useSelector((state) => state.user);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showEmailChangePopup, setShowEmailChangePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showEmailMethodPopup, setShowEmailMethodPopup] = useState(false);

  const [formState, setFormState] = useState({
    newPassword: "",
    currentPassword: "",
    newEmail: "",
    showPasswordForm: false,
    showEmailForm: false,
    error: "",
    success: "",
  });

  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [isEmailProvider, setIsEmailProvider] = useState(false);

  const clearFormFields = () => {
    setFormState((prev) => ({
      ...prev,
      newPassword: "",
      currentPassword: "",
      newEmail: "",
      error: "",
      success: "",
    }));
  };

  const handleFormVisibility = (formType) => {
    setFormState((prev) => ({
      ...prev,
      showPasswordForm: formType === "password",
      showEmailForm: formType === "email",
    }));
    clearFormFields();
  };

  useEffect(() => {
    const checkAuthMethod = async () => {
      if (auth.currentUser) {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        setIsEmailProvider(methods.includes("password"));
      }
    };
    checkAuthMethod();
  }, [email]);

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
    const diffTime = Math.abs(endDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFormSubmit = async (e, action) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, error: "", success: "" }));

    try {
      const { currentPassword, newPassword, newEmail } = formState;

      if (action === "updateEmail") {
        if (isEmailProvider) {
          await reauthenticateWithCredential(
            auth.currentUser,
            EmailAuthProvider.credential(email, currentPassword)
          );
        }
        await updateEmail(auth.currentUser, newEmail);
        setFormState((prev) => ({
          ...prev,
          success: "Email successfully updated!",
          showEmailForm: false,
        }));
      } else if (action === "updatePassword") {
        await reauthenticateWithCredential(
          auth.currentUser,
          EmailAuthProvider.credential(email, currentPassword)
        );
        await updatePassword(auth.currentUser, newPassword);
        setFormState((prev) => ({
          ...prev,
          success: "Password successfully updated!",
          showPasswordForm: false,
        }));
      } else if (action === "linkEmailPassword") {
        await linkWithCredential(
          auth.currentUser,
          EmailAuthProvider.credential(newEmail, newPassword)
        );
        setFormState((prev) => ({
          ...prev,
          success: "Email and password successfully linked!",
          showEmailForm: false,
        }));
      }

      clearFormFields();
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error: `Error: ${error.message}`,
      }));
    }
  };

  const handleGoogleLink = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await linkWithPopup(auth.currentUser, provider);
      setFormState((prev) => ({
        ...prev,
        success: "Google account successfully linked!",
      }));
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error: "Error linking Google account. It may already be linked.",
      }));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error: "Error signing out. Please try again.",
      }));
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, error: "", success: "" }));

    try {
      const { currentPassword, newEmail } = formState;

      if (isEmailProvider) {
        const credential = EmailAuthProvider.credential(email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updateEmail(auth.currentUser, newEmail);

        dispatch(
          setUser({
            email: newEmail,
            id: auth.currentUser.uid,
            token: auth.currentUser.accessToken,
            isPremium: auth.currentUser.isPremium,
          })
        );
      } else {
        try {
          const newCredential = EmailAuthProvider.credential(
            newEmail,
            formState.newPassword
          );

          await auth.currentUser.linkWithCredential(newCredential);

          for (const provider of auth.currentUser.providerData) {
            if (provider.providerId === "google.com") {
              await auth.currentUser.unlink("google.com");
            }
          }

          dispatch(
            setUser({
              email: newEmail,
              id: auth.currentUser.uid,
              token: auth.currentUser.accessToken,
              isPremium: auth.currentUser.isPremium,
            })
          );
        } catch (error) {
          if (error.code === "auth/email-already-in-use") {
            throw new Error(t("This email is already in use"));
          } else if (error.code === "auth/weak-password") {
            throw new Error(t("Password should be at least 6 characters"));
          } else {
            throw error;
          }
        }
      }

      setFormState((prev) => ({
        ...prev,
        success: t("Email successfully updated!"),
        newEmail: "",
        currentPassword: "",
        newPassword: "",
      }));
      setShowEmailChangePopup(false);
    } catch (error) {
      let errorMessage = error.message;

      if (error.code === "auth/wrong-password") {
        errorMessage = t("Incorrect current password");
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = t("Please log in again to change your email");
      } else if (error.code === "auth/invalid-email") {
        errorMessage = t("Invalid email format");
      }

      setFormState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const success = await cancelSubscription(userId);
      if (success) {
        setFormState((prev) => ({
          ...prev,
          success: t(
            "Subscription auto-renewal has been cancelled successfully"
          ),
        }));
        setSubscriptionInfo((prev) => ({
          ...prev,
          isAutoRenewal: false,
        }));
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error: t("Error canceling subscription. Please try again."),
      }));
    } finally {
      setShowCancelPopup(false);
    }
  };

  const handleRestoreSubscription = async () => {
    try {
      const success = await restoreSubscription(userId);
      if (success) {
        setFormState((prev) => ({
          ...prev,
          success: t(
            "Subscription auto-renewal has been restored successfully"
          ),
        }));
        setSubscriptionInfo((prev) => ({
          ...prev,
          isAutoRenewal: true,
        }));
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error: t("Error restoring subscription. Please try again."),
      }));
    }
  };

  const handleEmailMethodSelect = async (method) => {
    setShowEmailMethodPopup(false);

    if (method === "google") {
      try {
        const provider = new GoogleAuthProvider();
        const result = await linkWithPopup(auth.currentUser, provider);

        dispatch(
          setUser({
            email: result.user.email,
            id: result.user.uid,
            token: result.user.accessToken,
            isPremium: auth.currentUser.isPremium,
          })
        );

        setFormState((prev) => ({
          ...prev,
          success: t("Email successfully changed to Google account"),
        }));
      } catch (error) {
        setFormState((prev) => ({
          ...prev,
          error: t("Error linking Google account. It may already be linked."),
        }));
      }
    } else {
      setShowEmailChangePopup(true);
    }
  };

  const EmailChangePopup = () => (
    <div className="settings-popup">
      <div className="popup-content">
        <button
          className="close-popup"
          onClick={() => setShowEmailChangePopup(false)}
        >
          ×
        </button>
        <h3>{t("Change Email Address")}</h3>

        <form onSubmit={handleEmailChange} className="email-form">
          {isEmailProvider && (
            <div className="email-input-group">
              <label className="input-label">{t("Current Password")}</label>
              <input
                type="password"
                className="security-input"
                value={formState.currentPassword}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder={t("Enter current password")}
                required
              />
            </div>
          )}

          <div className="email-input-group">
            <label className="input-label">{t("New Email")}</label>
            <input
              type="email"
              className="security-input"
              value={formState.newEmail}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  newEmail: e.target.value,
                }))
              }
              placeholder={t("Enter new email")}
              required
            />
          </div>

          {!isEmailProvider && (
            <div className="email-input-group">
              <label className="input-label">{t("New Password")}</label>
              <input
                type="password"
                className="security-input"
                value={formState.newPassword}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                placeholder={t("Create new password")}
                required
              />
            </div>
          )}

          <button type="submit" className="action-button">
            {t("Update Email")}
          </button>
        </form>
      </div>
    </div>
  );

  const renderForm = (type) => {
    const { currentPassword, newPassword, newEmail } = formState;

    const commonInputProps = {
      className: "security-input",
      onChange: (e) =>
        setFormState((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        })),
    };

    if (type === "password") {
      return (
        <form
          onSubmit={(e) => handleFormSubmit(e, "updatePassword")}
          className="security-form"
        >
          <input
            type="password"
            name="currentPassword"
            placeholder={t("Current Password")}
            value={currentPassword}
            {...commonInputProps}
          />
          <input
            type="password"
            name="newPassword"
            placeholder={t("New Password")}
            value={newPassword}
            {...commonInputProps}
          />
          <button type="submit" className="submit-button">
            {t("Update Password")}
          </button>
        </form>
      );
    }

    if (type === "email") {
      return (
        <form
          onSubmit={(e) =>
            handleFormSubmit(
              e,
              isEmailProvider ? "updateEmail" : "linkEmailPassword"
            )
          }
          className="security-form"
        >
          {isEmailProvider && (
            <input
              type="password"
              name="currentPassword"
              placeholder={t("Current Password")}
              value={currentPassword}
              {...commonInputProps}
            />
          )}
          <input
            type="email"
            name="newEmail"
            placeholder={t("New Email")}
            value={newEmail}
            {...commonInputProps}
          />
          {!isEmailProvider && (
            <input
              type="password"
              name="newPassword"
              placeholder={t("Password")}
              value={newPassword}
              {...commonInputProps}
            />
          )}
          <button type="submit" className="submit-button">
            {isEmailProvider ? t("Update Email") : t("Add Email and Password")}
          </button>
        </form>
      );
    }
  };

  return (
    <div className="account-container">
      <div className="account-card">
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

              <div className="settings-section">
                <h4>{t("Email Management")}</h4>
                <button
                  className="action-button"
                  onClick={() => {
                    setShowEmailMethodPopup(true);
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
                      d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                    />
                  </svg>
                  {isEmailProvider
                    ? t("Change Email")
                    : t("Change Google Account")}
                </button>

                {isEmailProvider && (
                  <button
                    className="action-button google-button"
                    onClick={handleGoogleLink}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.545,12.151L12.545,12.151c0,1.054,0.952,1.91,2.127,1.91h2.127v2.127h-2.127c-2.341,0-4.254-1.799-4.254-4.037 V7.913c0-2.238,1.913-4.037,4.254-4.037h4.254v2.127h-4.254c-1.175,0-2.127,0.856-2.127,1.91V12.151z M21.328,12.151L21.328,12.151 c0,1.054-0.952,1.91-2.127,1.91h-2.127v2.127h2.127c2.341,0,4.254-1.799,4.254-4.037V7.913c0-2.238-1.913-4.037-4.254-4.037h-4.254 v2.127h4.254c1.175,0,2.127,0.856,2.127,1.91V12.151z"
                      />
                    </svg>
                    {t("Link Google Account")}
                  </button>
                )}
              </div>

              <div className="settings-section">
                <h4>{t("Security")}</h4>
                {isEmailProvider && (
                  <button
                    className="action-button"
                    onClick={() => {
                      handleFormVisibility("password");
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
                )}
              </div>

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

        {showEmailChangePopup && <EmailChangePopup />}

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

          {formState.showPasswordForm && renderForm("password")}
          {formState.showEmailForm && renderForm("email")}

          {formState.error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                />
              </svg>
              {formState.error}
            </div>
          )}
          {formState.success && (
            <div className="success-message">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                />
              </svg>
              {formState.success}
            </div>
          )}
        </div>

        {showCancelPopup && (
          <CancelSubscriptionPopup
            onConfirm={handleCancelSubscription}
            onCancel={() => setShowCancelPopup(false)}
            daysLeft={calculateDaysLeft()}
          />
        )}

        {showEmailMethodPopup && (
          <EmailChangeMethodPopup
            onClose={() => setShowEmailMethodPopup(false)}
            onSelectMethod={handleEmailMethodSelect}
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
