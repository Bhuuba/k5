import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import "./form.css";

const SignUpForm = ({ title, handleClick }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [serverError, setServerError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  useEffect(() => {
    // Оцениваем сложность пароля
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++;
    setPasswordStrength(strength);
  }, [pass]);

  const handleSubmit = async () => {
    setServerError("");
    let newErrors = { email: "", password: "", confirmPassword: "" };
    let hasErrors = false;

    if (!validateEmail(email)) {
      newErrors.email = t("Невірний формат email");
      hasErrors = true;
    }

    if (pass.length < 8) {
      newErrors.password = t("Мінімум 8 символів");
      hasErrors = true;
    }

    if (pass !== confirmPass) {
      newErrors.confirmPassword = t("Паролі не співпадають");
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      await handleClick(email, pass);
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <div className="form-container">
      {serverError && <div className="server-error">{serverError}</div>}

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("email@example.com")}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">{t("Пароль")}:</label>
        <div className="password-input">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
            className={errors.password ? "input-error" : ""}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-eye-slash-fill"
                viewBox="0 0 16 16"
              >
                <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-eye-fill"
                viewBox="0 0 16 16"
              >
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
              </svg>
            )}
          </button>
        </div>
        {passwordStrength > 0 && (
          <div className="password-strength-wrapper">
            <div className="password-strength">
              <div className="strength-bar">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className={`strength-segment ${
                      index < passwordStrength ? "active" : ""
                    }`}
                  />
                ))}
              </div>
              <div className="password-tooltip">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-question-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                </svg>
                <div className="tooltip-content">
                  <p>{t("Вимоги до пароля")}:</p>
                  <ul>
                    <li className={pass.length >= 8 ? "met" : ""}>
                      {t("Мінімум 8 символів")}
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(pass) && /[a-z]/.test(pass) ? "met" : ""
                      }
                    >
                      {t("Великі та малі літери")}
                    </li>
                    <li className={/\d/.test(pass) ? "met" : ""}>
                      {t("Хоча б одна цифра")}
                    </li>
                    <li
                      className={
                        /[!@#$%^&*(),.?":{}|<>]/.test(pass) ? "met" : ""
                      }
                    >
                      {t("Хоча б один спецсимвол")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">{t("Підтвердіть пароль")}:</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          placeholder="••••••••"
          className={errors.confirmPassword ? "input-error" : ""}
        />
        {errors.confirmPassword && (
          <span className="error-message">{errors.confirmPassword}</span>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="submit-btn"
        disabled={!email || !pass || !confirmPass || passwordStrength < 3}
      >
        {t(title)}
      </button>
    </div>
  );
};

SignUpForm.propTypes = {
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default SignUpForm;
