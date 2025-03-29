import React from "react";
import "./App.css";
import Profile from "./components/Profile/Profile";
import Header from "./components/Header/Header";
import Videoai from "./components/Video/Video";
import Music from "./components/Music/Music";
import Prising from "./components/Prising/Prising";
import Pdf from "./components/Pdf/Pdf";
import RegisterPage from "./components/pagesAuthorisation/SingUp/RegisterPage";
import Login from "./components/pagesAuthorisation/Login/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import "./firebase";
import ProtectedRoute from "components/ProtectedRoute";
import MyAccountPage from "components/MyAcount/MyAcount";

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <div className="container-fluide">
          <div className="col-xxl-12 col-xl-12 col-lg-12 col-12">
            <div className="row">
              <Header />
              <Routes>
                <Route path="/" element={<Profile />} />

                {/* Захищені маршрути */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/videoai" element={<Videoai />} />
                  <Route path="/pdfai" element={<Pdf />} />
                  <Route path="/account" element={<MyAccountPage />} />
                </Route>

                {/* Публічні маршрути */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/music" element={<Music />} />
                <Route path="/pricing" element={<Prising />} />
              </Routes>
            </div>
          </div>
        </div>
      </Provider>
    </BrowserRouter>
  );
};

export default App;
