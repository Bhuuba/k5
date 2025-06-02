import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./AppWrapper";
import "./index.css";
import "./config/i18n";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

reportWebVitals();
