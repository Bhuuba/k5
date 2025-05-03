import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setPremium } from "../../store/slices/userSlice";
import { updateSubscriptionStatus } from "../../utils/premiumService";
import styles from "./PaymentSuccess.module.css";
import { useTranslation } from "react-i18next";

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const handlePaymentResult = async () => {
      if (!user || !user.id) {
        navigate("/login");
        return;
      }

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentData = {
          order_id: urlParams.get("order_id") || `test_${Date.now()}`,
          payment_id: urlParams.get("payment_id") || `test_${Date.now()}`,
          status: urlParams.get("status") || "success",
          time: new Date().toISOString(),
        };

        // Проверяем различные статусы ответа от LiqPay
        if (paymentData.status === "success") {
          setStatus("activating");
          const result = await updateSubscriptionStatus(
            user.id,
            "success",
            paymentData
          );

          if (result) {
            setStatus("success");
            dispatch(setPremium(true));
          } else {
            setStatus("error");
          }
        } else if (paymentData.status === "failure") {
          setStatus("failed");
        } else if (paymentData.status === "error") {
          setStatus("error");
        } else if (["canceled", "cancelled"].includes(paymentData.status)) {
          setStatus("cancelled");
        } else {
          setStatus("failed");
        }

        // Перенаправляем на страницу тарифов через 3 секунды
        setTimeout(() => {
          navigate("/pricing");
        }, 3000);
      } catch (error) {
        console.error("Error processing payment:", error);
        setStatus("error");
      }
    };

    handlePaymentResult();
  }, [user, navigate, dispatch]);

  const renderMessage = () => {
    switch (status) {
      case "processing":
        return t("Processing payment...");
      case "activating":
        return t("Activating premium status...");
      case "success":
        return t(
          "Thank you for your purchase. Premium status has been activated."
        );
      case "cancelled":
        return t("Payment was cancelled. You can try again at any time.");
      case "failed":
        return t("Payment failed. Please try again.");
      case "error":
        return t("Error processing payment. Please contact support.");
      default:
        return t("Processing...");
    }
  };

  const getTitle = () => {
    switch (status) {
      case "success":
        return t("Payment successful!");
      case "cancelled":
        return t("Payment cancelled");
      case "failed":
        return t("Payment failed");
      case "error":
        return t("Payment error");
      default:
        return t("Payment processing");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{getTitle()}</h1>
        <p className={styles.message}>{renderMessage()}</p>
        {["error", "failed", "cancelled"].includes(status) && (
          <button
            className={styles.button}
            onClick={() => navigate("/pricing")}
          >
            {t("Return to Pricing")}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
