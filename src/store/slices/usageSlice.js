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
    incrementPdfUsage: (state) => {
      state.pdfUsage += 1;
    },
    incrementVideoUsage: (state) => {
      state.videoUsage += 1;
    },
    setPremium: (state, action) => {
      state.isPremium = action.payload;
    },
    resetUsage: (state) => {
      state.pdfUsage = 0;
      state.videoUsage = 0;
    },
  },
});

export const {
  incrementPdfUsage,
  incrementVideoUsage,
  setPremium,
  resetUsage,
} = usageSlice.actions;
export default usageSlice.reducer;
