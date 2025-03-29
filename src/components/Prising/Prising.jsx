import React, { useState } from "react";
import s from "./Prising.module.css";

const Prising = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleBuyNow = (plan) => {
    setSelectedPlan(plan);
    setShowPopup(true);
  };

  return (
    <div className={s.container}>
      <h2 className={s.title}>Pricing Plans</h2>
      <div className={s.pricingGrid}>
        {["Basic", "Pro", "Enterprise"].map((plan, index) => (
          <div key={index} className={s.pricingCard}>
            <h3 className={s.planTitle}>{plan}</h3>
            <p className={s.price}>
              {plan === "Basic"
                ? "$9/month"
                : plan === "Pro"
                ? "$19/month"
                : "Contact Us"}
            </p>
            <ul className={s.features}>
              {plan === "Basic" && (
                <>
                  <li>Access to basic features</li>
                  <li>Email support</li>
                  <li>Single user</li>
                </>
              )}
              {plan === "Pro" && (
                <>
                  <li>All Basic features</li>
                  <li>Priority support</li>
                  <li>Multi-user access</li>
                  <li>Advanced analytics</li>
                </>
              )}
              {plan === "Enterprise" && (
                <>
                  <li>All Pro features</li>
                  <li>Dedicated support</li>
                  <li>Custom solutions</li>
                  <li>Unlimited users</li>
                  <li>Advanced integrations</li>
                </>
              )}
            </ul>
            <button className={s.button} onClick={() => handleBuyNow(plan)}>
              {plan === "Enterprise" ? "Contact Sales" : "Buy Now"}
            </button>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className={s.popupOverlay}>
          <div className={s.popup}>
            <h2 className={s.popupTitle}>Purchase {selectedPlan} Plan</h2>
            <form className={s.form}>
              <input
                type="text"
                placeholder="Cardholder Name"
                className={s.input}
              />
              <input
                type="text"
                placeholder="Card Number"
                className={s.input}
              />
              <div className={s.row}>
                <input
                  type="text"
                  placeholder="Expiry Date (MM/YY)"
                  className={s.smallInput}
                />
                <input type="text" placeholder="CVV" className={s.smallInput} />
              </div>
              <button type="submit" className={s.confirmButton}>
                Confirm Payment
              </button>
            </form>
            <button
              className={s.closeButton}
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prising;
