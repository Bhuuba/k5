import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { store, persistor } from "./store/index.js";
import { setUser, removeUser } from "./store/slices/userSlice.js";
import Loader from "./components/Loader/Loader";
import App from "./App";

// Компонент для отслеживания состояния аутентификации
const AuthStateListener = ({ children }) => {
  const dispatch = useDispatch();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.accessToken,
          })
        );
      } else {
        dispatch(removeUser());
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return children;
};

const AppWrapper = () => (
  <Provider store={store}>
    <PersistGate loading={<Loader />} persistor={persistor}>
      <Router>
        <AuthStateListener>
          <App />
        </AuthStateListener>
      </Router>
    </PersistGate>
  </Provider>
);

export default AppWrapper;
