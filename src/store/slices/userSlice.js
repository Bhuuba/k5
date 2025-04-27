import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  token: null,
  id: null,
  isAuth: false,
  isPremium: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.isAuth = true;
      state.isPremium = action.payload.isPremium || false;
    },
    removeUser: (state) => {
      state.email = null;
      state.token = null;
      state.id = null;
      state.isAuth = false;
      state.isPremium = false;
    },
    setPremium: (state, action) => {
      state.isPremium = action.payload;
    },
  },
});

export const { setUser, removeUser, setPremium } = userSlice.actions;
export default userSlice.reducer;
