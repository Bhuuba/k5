import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setUser, removeUser } from "./store/slices/userSlice";
import { checkPremiumStatus } from "./utils/premiumService";
import Header from "./components/Header/Header";
import Profile from "./components/Profile/Profile";
import Videoai from "./components/Video/Video";
import Music from "./components/Music/Music";
import Prising from "./components/Prising/Prising";
import Pdf from "./components/Pdf/Pdf";
import RegisterPage from "./components/pagesAuthorisation/SingUp/RegisterPage";
import Login from "./components/pagesAuthorisation/Login/LoginPage";
import MyAccountPage from "./components/MyAcount/MyAcount";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "components/MyAcount/PublicRoute";
import Loader from "./components/Loader/Loader";
import "./App.css";
import Footer from "components/futer/Futer";
import PaymentSuccess from "./components/PaymentSuccess/PaymentSuccess";

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Проверяем премиум статус при авторизации
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
      setLoading(false); // аутентифікація завершена
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Показуємо Loader до завершення аутентифікації
  if (loading) {
    return <Loader />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <Router>
          <div className="container-fluide">
            <div className="col-xxl-12 col-xl-12 col-lg-12 col-sm-12 col-5">
              <div className="row">
                <Header />
                <Routes>
                  <Route path="/" element={<Profile />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/videoai" element={<Videoai />} />
                    <Route path="/pdfai" element={<Pdf />} />
                    <Route path="/account" element={<MyAccountPage />} />
                  </Route>
                  {/* Використовуємо PublicRoute для сторінок логіну та реєстрації */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <RegisterPage />
                      </PublicRoute>
                    }
                  />
                  <Route path="/music" element={<Music />} />
                  <Route path="/pricing" element={<Prising />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                </Routes>
                {/* <Footer /> */}
              </div>
            </div>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
