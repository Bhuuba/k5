import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { store } from "../store";
import { setPremium } from "../store/slices/userSlice";

const db = getFirestore();

export const activatePremium = async (userId) => {
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

    // Check if subscription is active and not expired
    const isPremium =
      userData.isPremium &&
      userData.subscriptionStatus === "active" &&
      endDate > now;

    store.dispatch(setPremium(isPremium));

    // If subscription has expired but auto-renewal is on, trigger renewal
    if (userData.isAutoRenewal && endDate <= now) {
      // Here you would typically trigger LiqPay payment
      // For now, we'll just update the dates
      const newEndDate = new Date(endDate);
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
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        isAutoRenewal: false,
        subscriptionStatus: "cancelled",
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return false;
  }
};
