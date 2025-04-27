import sha1 from "crypto-js/sha1";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";

const LIQPAY_PUBLIC_KEY = "sandbox_i47939971818";
const LIQPAY_PRIVATE_KEY = "sandbox_fkhm08Wt84msGcbYs9zOfZolm1Hitvtg0388mdu0";

export const createLiqPayForm = () => {
  // Форматируем дату в нужный формат YYYY-MM-DD HH:mm:ss
  const now = new Date();
  const formattedDate =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    " " +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");

  const subscriptionData = {
    version: 3,
    public_key: LIQPAY_PUBLIC_KEY,
    action: "subscribe",
    amount: "100",
    currency: "UAH",
    description: "Monthly Premium subscription",
    order_id: Date.now().toString(),
    subscribe: 1,
    subscribe_date_start: formattedDate,
    subscribe_periodicity: "month",
    result_url: window.location.origin + "/payment-success",
  };

  const jsonString = btoa(JSON.stringify(subscriptionData));
  const signString = LIQPAY_PRIVATE_KEY + jsonString + LIQPAY_PRIVATE_KEY;
  const signature = Base64.stringify(sha1(signString));

  return {
    data: jsonString,
    signature: signature,
  };
};
