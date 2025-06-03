import React from "react";
import ReactDOM from "react-dom/client";
import { getAuth } from "firebase/auth";
import "./config/firebase"; // Убедитесь, что Firebase инициализируется первым
import AppWrapper from "./AppWrapper";
import "./index.css";
import "./config/i18n";
import reportWebVitals from "./reportWebVitals";

// Инициализируем Firebase Auth
const auth = getAuth();
auth.onAuthStateChanged((user) => {
  console.log("Initial auth state:", user ? "User is signed in" : "No user");
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

reportWebVitals();
