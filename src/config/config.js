const config = {
  API_URL: process.env.REACT_APP_API_URL || "http://18.184.60.63",
  endpoints: {
    VIDEO_SUMMARY: "/api/v1/yt/summary",
    PDF_SUMMARY: "/api/v1/summarize/pdf",
  },
  subscription: {
    price: {
      amount: 100,
      currency: "UAH",
    },
    freeLimits: {
      video: 10,
      pdf: 10,
      chat: 50,
    },
    features: {
      free: [
        "Basic AI Video Analysis",
        "Basic PDF Analysis",
        "Limited Chat Messages",
        "Standard Support",
      ],
      premium: [
        "Advanced AI Video Analysis",
        "Full PDF Document Analysis",
        "Unlimited Chat Messages",
        "Priority Support",
        "Custom Summarization Rules",
        "API Access",
      ],
    },
    duration: {
      trial: 7, // days
      subscription: 30, // days
    },
  },
};

export default config;
