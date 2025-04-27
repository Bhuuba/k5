import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { removeUser } from "../../store/slices/userSlice";
import { cancelSubscription } from "../../utils/premiumService";
import "./MyAccount.css";

const MyAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, isPremium, id: userId } = useSelector((state) => state.user);

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
            placeholder="Current Password"
            value={currentPassword}
            {...commonInputProps}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={newPassword}
            {...commonInputProps}
          />
          <button type="submit" className="submit-button">
            Update Password
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
              placeholder="Current Password"
              value={currentPassword}
              {...commonInputProps}
            />
          )}
          <input
            type="email"
            name="newEmail"
            placeholder="New Email"
            value={newEmail}
            {...commonInputProps}
          />
          {!isEmailProvider && (
            <input
              type="password"
              name="newPassword"
              placeholder="Password"
              value={newPassword}
              {...commonInputProps}
            />
          )}
          <button type="submit" className="submit-button">
            {isEmailProvider ? "Update Email" : "Add Email and Password"}
          </button>
        </form>
      );
    }
  };

  return (
    <div className="account-container">
      <div className="account-card">
        <div className="account-header">
          <div className="profile-avatar">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`}
              alt="Profile"
              className="avatar-image"
            />
          </div>
          <h2>Profile Settings</h2>
          <p className="account-email">{email}</p>
          {isPremium && <div className="premium-badge">Premium</div>}
        </div>

        <div className="account-body">
          <div className="account-section subscription-section">
            <h3>Subscription</h3>
            {isPremium && subscriptionInfo ? (
              <>
                <div className="status-container">
                  <span className="status-label">Status:</span>
                  <span className="premium-status">Premium Active</span>
                </div>
                <div className="subscription-details">
                  <div className="detail-item">
                    <span className="detail-label">Valid until:</span>
                    <span className="detail-value">
                      {subscriptionInfo.endDate?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Auto-renewal:</span>
                    <span className="detail-value">
                      {subscriptionInfo.isAutoRenewal ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
                {subscriptionInfo.isAutoRenewal && (
                  <button
                    className="action-button cancel-button"
                    onClick={() => cancelSubscription(userId)}
                  >
                    Cancel Auto-renewal
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="status-text">Free Plan</p>
                <button
                  className="upgrade-button"
                  onClick={() => navigate("/pricing")}
                >
                  Upgrade to Premium
                </button>
              </>
            )}
          </div>

          <div className="account-section security-section">
            <h3>Security Settings</h3>
            {isEmailProvider ? (
              <>
                <div className="security-options">
                  <button
                    className="action-button"
                    onClick={() => handleFormVisibility("password")}
                  >
                    Change Password
                  </button>
                  <button
                    className="action-button"
                    onClick={() => handleFormVisibility("email")}
                  >
                    Change Email
                  </button>
                  <button
                    className="action-button google-button"
                    onClick={handleGoogleLink}
                  >
                    Link Google Account
                  </button>
                </div>

                {formState.showPasswordForm && renderForm("password")}
                {formState.showEmailForm && renderForm("email")}
              </>
            ) : (
              <>
                <div className="google-profile-info">
                  <p>Sign in with Google</p>
                  <button
                    className="action-button"
                    onClick={() => handleFormVisibility("email")}
                  >
                    Add Email and Password
                  </button>
                </div>
                {formState.showEmailForm && renderForm("email")}
              </>
            )}
          </div>

          {formState.error && (
            <div className="error-message">{formState.error}</div>
          )}
          {formState.success && (
            <div className="success-message">{formState.success}</div>
          )}
        </div>

        <div className="account-footer">
          <button onClick={handleLogout} className="logout-button">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
