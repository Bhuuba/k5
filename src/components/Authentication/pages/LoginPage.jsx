import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Login from "../components/Login";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../config/firebase";
import "./LoginPage.css";

const LoginPage = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setError(""); // Сбрасываем ошибку при новой попытке
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google auth error:", {
        code: error.code,
        message: error.message,
      });

      // Определяем тип ошибки и показываем соответствующее сообщение
      switch (error.code) {
        case "auth/popup-closed-by-user":
          setError(t("Вхід через Google було скасовано. Спробуйте ще раз."));
          break;
        case "auth/popup-blocked":
          setError(
            t(
              "Спливаюче вікно було заблоковано браузером. Будь ласка, дозвольте спливаючі вікна та спробуйте знову."
            )
          );
          break;
        case "auth/account-exists-with-different-credential":
          setError(
            t(
              "Обліковий запис з цією електронною поштою вже існує з іншим способом входу."
            )
          );
          break;
        case "auth/network-request-failed":
          setError(
            t("Помилка мережі. Перевірте ваше з'єднання та спробуйте знову.")
          );
          break;
        default:
          setError(t("Помилка при вході через Google. Спробуйте пізніше."));
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{t("Welcome Back")}</h1>
          <p>{t("Sign in to your account")}</p>
        </div>

        {error && <div className="auth-error-message">{error}</div>}

        <Login />

        <div className="auth-footer">
          <span>{t("Don't have an account?")} </span>
          <NavLink to="/register" className="auth-link">
            {t("Register")}
          </NavLink>
        </div>

        <div className="auth-divider">
          <span>{t("or")}</span>
        </div>

        <button onClick={handleGoogleLogin} className="auth-social-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-google"
            viewBox="0 0 16 16"
          >
            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
          </svg>
          {t("Continue with Google")}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
