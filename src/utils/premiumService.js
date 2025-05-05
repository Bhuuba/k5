import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { store } from "../store";
import { setPremium } from "../store/slices/userSlice";
import i18n from "../i18n";
import { createLiqPayForm } from "./liqpay";

const db = getFirestore();

export const initiatePremiumPurchase = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const paymentId = `${userId}_${Date.now()}`;

    // Создаем запись о платеже
    await setDoc(doc(collection(db, "payments"), paymentId), {
      userId: userId,
      status: "pending",
      createdAt: serverTimestamp(),
      amount: 100,
      currency: "UAH",
    });

    // Создаем форму LiqPay после успешного создания записи в Firebase
    const form = createLiqPayForm(userId, paymentId);
    return form;
  } catch (error) {
    console.error("Error initiating premium purchase:", error);
    throw error;
  }
};

export const activatePremium = async (userId, paymentData) => {
  try {
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        isPremium: true,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: subscriptionEndDate,
        isAutoRenewal: true,
        subscriptionStatus: "active",
        lastPaymentData: paymentData,
      },
      { merge: true }
    );

    store.dispatch(setPremium(true));
    return true;
  } catch (error) {
    console.error("Error activating premium:", error);
    return false;
  }
};

export const checkPremiumStatus = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      store.dispatch(setPremium(false));
      return false;
    }

    const userData = userDoc.data();
    const now = new Date();
    const endDate = userData.subscriptionEndDate?.toDate();

    // Проверяем статус подписки с учетом точного времени
    const isPremium =
      userData.isPremium &&
      userData.subscriptionStatus === "active" &&
      endDate > now;

    store.dispatch(setPremium(isPremium));

    // Если подписка истекла, но включено автопродление
    if (userData.isAutoRenewal && endDate <= now) {
      const newEndDate = new Date();
      // Устанавливаем время окончания в то же время дня, что и в предыдущей подписке
      newEndDate.setHours(
        endDate.getHours(),
        endDate.getMinutes(),
        endDate.getSeconds(),
        endDate.getMilliseconds()
      );
      newEndDate.setMonth(newEndDate.getMonth() + 1);

      await setDoc(
        userRef,
        {
          subscriptionEndDate: newEndDate,
        },
        { merge: true }
      );
    }

    return isPremium;
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
};

export const cancelSubscription = async (userId) => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      isAutoRenewal: false,
    });

    // Получаем текущие данные пользователя
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    // Обновляем состояние в Redux без перезагрузки страницы
    store.dispatch(setPremium(userData.isPremium));

    return true;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
};

export const handleSubscriptionCancel = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return false;

    const userData = userDoc.data();
    const currentEndDate = userData.subscriptionEndDate?.toDate();

    await setDoc(
      userRef,
      {
        isAutoRenewal: false,
        // Сохраняем премиум до конца оплаченного периода
        subscriptionStatus:
          currentEndDate > new Date() ? "active" : "cancelled",
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return false;
  }
};

export const restoreSubscription = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return false;

    const userData = userDoc.data();
    const currentEndDate = userData.subscriptionEndDate?.toDate();
    const now = new Date();

    // Если подписка еще активна, просто включаем автопродление
    if (currentEndDate > now) {
      await setDoc(
        userRef,
        {
          isAutoRenewal: true,
          subscriptionStatus: "active",
        },
        { merge: true }
      );
      return true;
    }

    // Если подписка истекла, нужна новая оплата
    return false;
  } catch (error) {
    console.error("Error restoring subscription:", error);
    return false;
  }
};

export const updateSubscriptionStatus = async (
  userId,
  paymentStatus,
  paymentData
) => {
  try {
    const userRef = doc(db, "users", userId);

    // В тестовом режиме сразу активируем премиум
    if (
      paymentData.order_id.startsWith("test_") ||
      paymentStatus === "success"
    ) {
      const now = new Date();
      const newEndDate = new Date(now);
      newEndDate.setMonth(newEndDate.getMonth() + 1);

      // Обновляем документ пользователя
      await setDoc(
        userRef,
        {
          isPremium: true,
          isAutoRenewal: true,
          subscriptionStatus: "active",
          subscriptionStartDate: now,
          subscriptionEndDate: newEndDate,
          lastPaymentData: paymentData,
          lastPaymentDate: now,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Создаем или обновляем запись о платеже
      const paymentRef = doc(db, "payments", paymentData.order_id);
      await setDoc(
        paymentRef,
        {
          status: "completed",
          completedAt: serverTimestamp(),
          paymentDetails: paymentData,
          userId: userId,
          amount: 100,
          currency: "UAH",
        },
        { merge: true }
      );

      store.dispatch(setPremium(true));
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error updating subscription status:", error);
    return false;
  }
};
