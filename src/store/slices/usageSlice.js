import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pdfUsage: 0,
  videoUsage: 0,
  isPremium: false,
};

const usageSlice = createSlice({
  name: "usage",
  initialState,
  reducers: {
    incrementPdfUsage(state) {
      state.pdfUsage += 1;
    },
    setPdfUsage(state, action) {
      state.pdfUsage = action.payload;
    },
    incrementVideoUsage(state) {
      state.videoUsage += 1;
    },
    setVideoUsage(state, action) {
      state.videoUsage = action.payload;
    },
    resetUsage(state) {
      state.pdfUsage = 0;
      state.videoUsage = 0;
    },
    setPremium(state, action) {
      state.isPremium = action.payload;
    },
  },
});

export const {
  incrementPdfUsage,
  setPdfUsage,
  incrementVideoUsage,
  setVideoUsage,
  resetUsage,
  setPremium,
} = usageSlice.actions;
export default usageSlice.reducer;
