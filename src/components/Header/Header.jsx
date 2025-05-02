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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleProtectedClick = (e) => {
    if (!isAuth) {
      e.preventDefault();
      setShowAuthPopup(true);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? "hidden" : "auto";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className={s.headerWrapper}>
      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}

      <div className={s.item}>
        <div className={s.headerLeft}>
          <NavLink to="/" className={s.a} onClick={closeMenu}>
            <img className={s.logo} src={logo} alt="Logo" />
          </NavLink>
        </div>

        <div
          className={`${s.burgerBtn} ${isMenuOpen ? s.active : ""}`}
          onClick={toggleMenu}
        >
          <div className={s.burgerLines}>
            <span className={s.line}></span>
            <span className={s.line}></span>
            <span className={s.line}></span>
          </div>
        </div>

        <div className={`${s.navLinks} ${isMenuOpen ? s.active : ""}`}>
          {/* Умовне відображення для захищених посилань */}
          {isAuth ? (
            <>
              <NavLink to="/videoai" className={s.a} onClick={closeMenu}>
                YTVideo AI
              </NavLink>
              <NavLink to="/pdfai" className={s.a} onClick={closeMenu}>
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

          <NavLink to="/chat" className={s.a} onClick={closeMenu}>
            AI CHATBOTS
          </NavLink>
          <NavLink to="/pricing" className={s.a}>
            Pricing
          </NavLink>

          {isAuth ? (
            <NavLink
              to="/account"
              className={s.profileLink}
              onClick={closeMenu}
            >
              <img
                src={userIcon}
                alt="My Account"
                className={s.userIcon}
                title={email}
              />
            </NavLink>
          ) : (
            <NavLink to="/login" className={s.a} onClick={closeMenu}>
              <button className={s.btn}>Sign Up</button>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
