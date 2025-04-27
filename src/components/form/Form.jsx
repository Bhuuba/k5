import { useState } from "react";
import PropTypes from "prop-types";
import "./form.css";

const Form = ({ title, handleClick }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const validatePassword = (password) => password.length >= 6;

  const handleSubmit = () => {
    let newErrors = { email: "", password: "" };

    if (!validateEmail(email)) {
      newErrors.email = "Невірний формат email";
    }

    if (!validatePassword(pass)) {
      newErrors.password = "Пароль повинен містити мінімум 6 символів";
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    setErrors({ email: "", password: "" });
    handleClick(email, pass);
  };
  return (
    <div className="form-container">
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Пароль:</label>
        <div className="password-input">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••"
            className={errors.password ? "input-error" : ""}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="submit-btn"
        disabled={!email || !pass}
      >
        {title}
      </button>
    </div>
  );
};

Form.propTypes = {
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default Form;
