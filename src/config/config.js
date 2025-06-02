const config = {
  API_URL: process.env.REACT_APP_API_URL || "http://18.184.60.63",
  endpoints: {
    VIDEO_SUMMARY: "/api/v1/yt/summary",
    PDF_SUMMARY: "/api/v1/summarize/pdf",
  },
};

export default config;
