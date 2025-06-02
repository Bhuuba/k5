import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setUser, removeUser } from "./store/slices/userSlice";
import { checkPremiumStatus } from "./components/Premium/utils/premiumUtils";

import Header from "./components/Header/Header";
import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/Loader/Loader";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isPremium = await checkPremiumStatus(user.uid);

        dispatch(
          setUser({
            email: user.email,
            token: user.accessToken,
            id: user.uid,
            isPremium,
          })
        );
      } else {
        dispatch(removeUser());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container-fluid p-0">
      <div className="w-100">
        <Header />
        <div className="container-custom">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
};

export default App;
