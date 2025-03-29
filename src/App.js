import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { useDispatch } from "react-redux";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setUser, removeUser } from "./store/slices/userSlice";
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
import "./App.css";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            email: user.email,
            token: user.accessToken,
            id: user.uid,
          })
        );
      } else {
        dispatch(removeUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Provider store={store}>
      <PersistGate loading={<div>Завантаження...</div>} persistor={persistor}>
        <BrowserRouter>
          <div className="container-fluide">
            <div className="col-xxl-12 col-xl-12 col-lg-12 col-12">
              <div className="row">
                <Header />
                <Routes>
                  <Route path="/" element={<Profile />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/videoai" element={<Videoai />} />
                    <Route path="/pdfai" element={<Pdf />} />
                    <Route path="/account" element={<MyAccountPage />} />
                  </Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/music" element={<Music />} />
                  <Route path="/pricing" element={<Prising />} />
                </Routes>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
