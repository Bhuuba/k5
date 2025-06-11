import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Pricing.module.css";
import { initiatePremiumPurchase } from "../../components/Premium/services/premiumService";
import config from "../../config/config";

const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { subscription } = config;

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
      <h1 className={styles.title}>{t("Обрати свій план")}</h1>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.pricingGrid}>
        {/* Free Plan Card */}
        <div className={styles.pricingCard}>
          <div className={styles.ribbon}>{t("Базовий")}</div>
          <h2 className={styles.planTitle}>{t("Free")}</h2>
          <p className={styles.price}>0 ₴</p>
          <ul className={styles.features}>
            {subscription.features.free.map((feature, index) => (
              <li key={index}>
                <span className={styles.featureIcon}>✓</span>
                {t(feature)}
              </li>
            ))}
          </ul>
          <button className={styles.button} disabled={user?.isPremium}>
            {user?.isPremium ? t("Поточний план") : t("Розпочати безкоштовно")}
          </button>
        </div>

        {/* Premium Plan Card */}
        <div
          className={`${styles.pricingCard} ${
            user?.isPremium ? styles.activePlan : ""
          }`}
        >
          <div className={styles.ribbon}>{t("Premium")}</div>
          <h2 className={styles.planTitle}>{t("Premium")}</h2>
          <p className={styles.price}>
            {subscription.price.amount} {subscription.price.currency}
            <span className={styles.period}>{t("/місяць")}</span>
          </p>
          <ul className={styles.features}>
            {subscription.features.premium.map((feature, index) => (
              <li key={index}>
                <span className={styles.featureIcon}>✓</span>
                {t(feature)}
              </li>
            ))}
          </ul>
          <button
            className={`${styles.button} ${
              user?.isPremium ? styles.activeButton : ""
            }`}
            onClick={handleSubscribe}
            disabled={user?.isPremium || isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.loadingSpinner}></span>
                {t("Обробка...")}
              </>
            ) : user?.isPremium ? (
              t("Активний")
            ) : (
              t("Оформити Premium")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
