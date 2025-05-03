import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Prising.module.css";
import { initiatePremiumPurchase } from "../../utils/premiumService";

const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, signature } = await initiatePremiumPurchase(user.id);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://www.liqpay.ua/api/3/checkout";
      form.acceptCharset = "utf-8";

      const dataInput = document.createElement("input");
      dataInput.type = "hidden";
      dataInput.name = "data";
      dataInput.value = data;

      const signatureInput = document.createElement("input");
      signatureInput.type = "hidden";
      signatureInput.name = "signature";
      signatureInput.value = signature;

      form.appendChild(dataInput);
      form.appendChild(signatureInput);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      console.error("Error initiating payment:", error);
      setError(t("Payment initialization failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("Tariff plans")}</h2>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.pricingGrid}>
        <div className={styles.pricingCard}>
          <h3 className={styles.planTitle}>{t("Free")}</h3>
          <p className={styles.price}>0 ₴</p>
          <ul className={styles.features}>
            <li>10 {t("PDF parsings")}</li>
            <li>10 {t("video analysis")}</li>
            <li>{t("Basic support")}</li>
          </ul>
          <button className={styles.button} disabled={user?.isPremium}>
            {user?.isPremium ? t("Current plan") : t("Free of charge")}
          </button>
        </div>

        <div
          className={`${styles.pricingCard} ${
            user?.isPremium ? styles.activePlan : ""
          }`}
        >
          <h3 className={styles.planTitle}>{t("Premium")}</h3>
          <p className={styles.price}>100 ₴</p>
          <ul className={styles.features}>
            <li>{t("Unlimited PDF parsing")}</li>
            <li>{t("Unlimited video analysis")}</li>
            <li>{t("Priority support")}</li>
            <li>{t("Access to all functions")}</li>
          </ul>
          <button
            className={styles.button}
            onClick={handleSubscribe}
            disabled={user?.isPremium || isLoading}
          >
            {isLoading
              ? t("Processing...")
              : user?.isPremium
              ? t("Active")
              : t("Buy now")}
          </button>
          {user?.isPremium && (
            <div className={styles.activeBadge}>{t("Current plan")}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
