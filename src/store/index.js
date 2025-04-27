import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import usageReducer from "./slices/usageSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "usage"],
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedUsageReducer = persistReducer(persistConfig, usageReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    usage: persistedUsageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
