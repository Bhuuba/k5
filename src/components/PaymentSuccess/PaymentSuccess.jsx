import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { activatePremium } from "../../utils/premiumService";
import { resetUsage } from "../../store/slices/usageSlice";
import s from "./PaymentSuccess.module.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: userId, isAuth } = useSelector((state) => state.user);

  useEffect(() => {
    const handleSuccess = async () => {
      if (!isAuth || !userId) {
        navigate("/login");
        return;
      }

      const success = await activatePremium(userId);
      if (success) {
        // Сбрасываем счетчики использования при успешной активации премиума
        dispatch(resetUsage());
      } else {
        alert(
          "Произошла ошибка при активации премиум статуса. Пожалуйста, обратитесь в поддержку."
        );
      }

      // Через 3 секунды перенаправляем на главную
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    };

    handleSuccess();
  }, [navigate, userId, isAuth, dispatch]);

  return (
    <div className={s.container}>
      <div className={s.card}>
        <h1 className={s.title}>Оплата успешна!</h1>
        <p className={s.message}>
          Спасибо за покупку. Премиум статус активирован.
        </p>
        <p className={s.redirect}>
          Вы будете перенаправлены на главную страницу через несколько секунд...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
