import React, { useState } from "react";
import s from "./Header.module.css";
import { NavLink } from "react-router-dom";
import logo from "./logo.jpg";
import { useAuth } from "../form/hooks/use-auth";
import userIcon from "./user-icon.svg";
import AuthPopup from "components/AuthPopup/AuthPopup";

const Header = () => {
  const { isAuth, email } = useAuth();
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const handleProtectedClick = (e) => {
    if (!isAuth) {
      e.preventDefault();
      setShowAuthPopup(true);
    }
  };

  return (
    <div className={s.headerWrapper}>
      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}

      <div className={s.item}>
        <div>
          <NavLink to="/" className={s.a}>
            <img className={s.logo} src={logo} alt="Logo" />
          </NavLink>
        </div>

        <div className={s.navLinks}>
          {/* Умовне відображення для захищених посилань */}
          {isAuth ? (
            <>
              <NavLink to="/videoai" className={s.a}>
                YTVideo AI
              </NavLink>
              <NavLink to="/pdfai" className={s.a}>
                PDF AI
              </NavLink>
            </>
          ) : (
            <>
              <span className={s.disabledLink} onClick={handleProtectedClick}>
                YTVideo AI
              </span>
              <span className={s.disabledLink} onClick={handleProtectedClick}>
                PDF AI
              </span>
            </>
          )}

          <NavLink to="/music" className={s.a}>
            AI CHATBOTS
          </NavLink>
          <NavLink to="/pricing" className={s.a}>
            Pricing
          </NavLink>

          {isAuth ? (
            <NavLink to="/account" className={s.profileLink}>
              <img
                src={userIcon}
                alt="My Account"
                className={s.userIcon}
                title={email}
              />
            </NavLink>
          ) : (
            <NavLink to="/login" className={s.a}>
              <button className={s.btn}>Sign Up</button>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
