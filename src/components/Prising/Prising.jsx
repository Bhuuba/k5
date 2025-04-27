import React from "react";
import s from "./Prising.module.css";
import { useDispatch, useSelector } from "react-redux";
import { createLiqPayForm } from "../../utils/liqpay";
import { useNavigate } from "react-router-dom";

const Prising = () => {
  const { isPremium, isAuth } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const initiateLiqPayPayment = () => {
    if (!isAuth) {
      navigate("/login");
      return;
    }

    const { data, signature } = createLiqPayForm();

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://www.liqpay.ua/api/3/checkout";
    form.target = "_blank";

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
  };

  return (
    <div className={s.container}>
      <h2 className={s.title}>Tariff plans</h2>
      <div className={s.pricingGrid}>
        <div className={s.pricingCard}>
          <h3 className={s.planTitle}>Free</h3>
          <p className={s.price}>0 ₴</p>
          <ul className={s.features}>
            <li>10 PDF parsings</li>
            <li>10 video analysis</li>
            <li>Basic support</li>
          </ul>
          <button className={s.button} disabled={isPremium}>
            {isPremium ? "Current plan" : "Free of charge"}
          </button>
        </div>

        <div className={`${s.pricingCard} ${isPremium ? s.activePlan : ""}`}>
          <h3 className={s.planTitle}>Premium</h3>
          <p className={s.price}>100 ₴</p>
          <ul className={s.features}>
            <li>Unlimited PDF parsing</li>
            <li>Unlimited video analysis</li>
            <li>Priority support</li>
            <li>Access to all functions</li>
          </ul>
          <button
            className={s.button}
            onClick={initiateLiqPayPayment}
            disabled={isPremium}
          >
            {isPremium ? "Active" : "Buy now"}
          </button>
          {isPremium && <div className={s.activeBadge}>Current plan</div>}
        </div>
      </div>
    </div>
  );
};

export default Prising;
