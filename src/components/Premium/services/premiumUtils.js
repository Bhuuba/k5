import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

export const checkPremiumStatus = async (userId) => {
  if (!userId) return false;

  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      const now = new Date();
      const subscriptionEndDate = data.subscriptionEndDate?.toDate();

      return (
        subscriptionEndDate &&
        now < subscriptionEndDate &&
        (data.isAutoRenewal ||
          now.getTime() + 24 * 60 * 60 * 1000 < subscriptionEndDate.getTime())
      );
    }
    return false;
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
};
