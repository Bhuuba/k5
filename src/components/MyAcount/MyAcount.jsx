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
      <div className="account-content">
        <h1 className="account-title">Ваш профіль</h1>
        <div className="account-info">
          <p className="account-email">{email}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Вийти з акаунту
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
