import sha1 from "crypto-js/sha1";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";

const LIQPAY_PUBLIC_KEY = "sandbox_i47939971818";
const LIQPAY_PRIVATE_KEY = "sandbox_fkhm08Wt84msGcbYs9zOfZolm1Hitvtg0388mdu0";

export const createLiqPayForm = (userId, paymentId) => {
  if (!userId || !paymentId) {
    throw new Error("Both userId and paymentId are required");
  }

  const now = new Date();
  const formattedDate = now.toISOString().replace("T", " ").split(".")[0];

  const subscriptionData = {
    version: 3,
    public_key: LIQPAY_PUBLIC_KEY,
    action: "pay", // Изменено с 'subscribe' на 'pay' для тестового режима
    amount: "100",
    currency: "UAH",
    description: "Monthly Premium subscription",
    order_id: paymentId,
    sandbox: "1", // Включаем тестовый режим
    result_url: `${window.location.origin}/payment-success`,
    server_url: `${window.location.origin}/api/payment-webhook`,
    info: JSON.stringify({ userId }),
  };

  const jsonString = btoa(JSON.stringify(subscriptionData));
  const signString = LIQPAY_PRIVATE_KEY + jsonString + LIQPAY_PRIVATE_KEY;
  const signature = Base64.stringify(sha1(signString));

  return {
    data: jsonString,
    signature: signature,
  };
};
