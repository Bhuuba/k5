import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  token: null,
  id: null,
  isPremium: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.isPremium = Boolean(action.payload.isPremium);
    },
    removeUser(state) {
      state.email = null;
      state.token = null;
      state.id = null;
      state.isPremium = false;
    },
    setPremium(state, action) {
      state.isPremium = Boolean(action.payload);
    },
  },
});

export const { setUser, removeUser, setPremium } = userSlice.actions;

// Селектор для получения данных пользователя
export const selectUser = (state) => state.user;

export default userSlice.reducer;
