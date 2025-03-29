import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { removeUser } from "../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import "./MyAccount.css";

const MyAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Помилка виходу:", error);
    }
  };

  return (
    <div className="account-container">
      <div className="account-card">
        <div className="account-header">
          <div className="profile-avatar">
            {/* Можна замінити на динамічне зображення користувача */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-brightness-alt-high"
              viewBox="0 0 16 16"
            >
              <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3m8 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5m-13.5.5a.5.5 0 0 0 0-1h-2a.5.5 0 0 0 0 1zm11.157-6.157a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m-9.9 2.121a.5.5 0 0 0 .707-.707L3.05 5.343a.5.5 0 1 0-.707.707zM8 7a4 4 0 0 0-4 4 .5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5 4 4 0 0 0-4-4m0 1a3 3 0 0 1 2.959 2.5H5.04A3 3 0 0 1 8 8" />
            </svg>
          </div>
          <h2>Ласкаво просимо!</h2>
          <p className="account-email">{email}</p>
        </div>
        <div className="account-body">
          <h3>Ваш профіль</h3>
          <p>
            Тут відображаються ваші дані, налаштування та інша інформація, що
            стосується вашого акаунту.
          </p>
          {/* Додаткові секції або інформацію можна додати тут */}
        </div>
        <div className="account-footer">
          <button onClick={handleLogout} className="logout-button">
            Вийти з акаунту
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
