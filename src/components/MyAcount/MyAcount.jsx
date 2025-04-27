import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signOut,
  linkWithPopup,
  GoogleAuthProvider,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../../firebase";
import { removeUser } from "../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { cancelSubscription } from "../../utils/premiumService";
import "./MyAccount.css";

const MyAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, isPremium, id: userId } = useSelector((state) => state.user);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (isPremium && userId) {
        const db = getFirestore();
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setSubscriptionInfo({
            startDate: data.subscriptionStartDate?.toDate(),
            endDate: data.subscriptionEndDate?.toDate(),
            isAutoRenewal: data.isAutoRenewal,
            status: data.subscriptionStatus,
          });
        }
      }
    };

    fetchSubscriptionInfo();
  }, [isPremium, userId]);

  const handleCancelSubscription = async () => {
    try {
      const success = await cancelSubscription(userId);
      if (success) {
        setSuccess(
          "Subscription auto-renewal has been cancelled. Your Premium access will remain until the end of the current period."
        );
        if (subscriptionInfo) {
          setSubscriptionInfo({
            ...subscriptionInfo,
            isAutoRenewal: false,
            status: "cancelled",
          });
        }
      }
    } catch (error) {
      setError("Failed to cancel subscription. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Помилка виходу:", error);
    }
  };

  const handleGoogleLink = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await linkWithPopup(auth.currentUser, provider);
      setSuccess("Google account successfully linked!");
    } catch (error) {
      setError("Error when linking a Google account");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Реаутентификация пользователя перед сменой пароля
      const credential = EmailAuthProvider.credential(email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Смена пароля
      await updatePassword(auth.currentUser, newPassword);
      setSuccess("Password successfully changed!");
      setShowPasswordForm(false);
      setNewPassword("");
      setCurrentPassword("");
    } catch (error) {
      setError("Error when changing password. Check the current password.");
    }
  };

  return (
    <div className="account-container">
      <div className="account-card">
        <div className="account-header">
          <div className="profile-avatar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-brightness-alt-high"
              viewBox="0 0 16 16"
            >
              <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3m8 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5m-13.5.5a.5.5 0 0 0 0-1h-2a.5.5 0 0 0 0 1zm11.157-6.157a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m-9.9 2.121a.5.5 0 0 0 .707-.707L3.05 5.343a.5.5 0 1 0-.707.707zM8 7a4 4 0 0 0-4 4 .5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5 4 4 0 0 0-4-4m0 1a3 3 0 0 1 2.959 2.5H5.04A3 3 0 0 1 8 8" />
            </svg>
          </div>
          <h2>Welcome!</h2>
          <p className="account-email">{email}</p>
          {isPremium && <div className="premium-badge">Premium</div>}
        </div>

        <div className="account-body">
          <div className="account-section">
            <h3>Subscription Details</h3>
            {isPremium && subscriptionInfo ? (
              <>
                <p className="status-text">
                  Status: <span className="premium-status">Premium Active</span>
                </p>
                <p className="subscription-details">
                  Valid until: {subscriptionInfo.endDate?.toLocaleDateString()}
                </p>
                <p className="subscription-details">
                  Auto-renewal:{" "}
                  {subscriptionInfo.isAutoRenewal ? "Enabled" : "Disabled"}
                </p>
                {subscriptionInfo.isAutoRenewal && (
                  <button
                    className="action-button cancel-button"
                    onClick={handleCancelSubscription}
                  >
                    Cancel Auto-renewal
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="status-text">Status: Free Plan</p>
                <button
                  className="upgrade-button"
                  onClick={() => navigate("/pricing")}
                >
                  Upgrade to Premium
                </button>
              </>
            )}
          </div>

          <div className="account-section">
            <h3>Security</h3>
            <button
              className="action-button"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Change Password
            </button>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="password-form">
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="password-input"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="password-input"
                />
                <button type="submit" className="submit-button">
                  Save new password
                </button>
              </form>
            )}

            <button
              className="action-button google-button"
              onClick={handleGoogleLink}
            >
              Link Google Account
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
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
