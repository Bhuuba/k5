import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Profile from "../pages/profile/Profile";
import Videoai from "../pages/video/Video";
import Pdf from "../pages/pdf/Pdf";
import MyAccountPage from "../components/Authentication/components/account/AccountPage";
import Login from "../components/Authentication/pages/LoginPage";
import RegisterPage from "../components/Authentication/pages/RegisterPage";
import Chat from "../pages/chat/Chat";
import Pricing from "../pages/pricing/Pricing";
import PaymentSuccess from "../components/Premium/components/PaymentSuccess/PaymentSuccess";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Profile />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/videoai" element={<Videoai />} />
      <Route path="/pdfai" element={<Pdf />} />
      <Route path="/account" element={<MyAccountPage />} />
    </Route>
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
    <Route path="/chat" element={<Chat />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/payment-success" element={<PaymentSuccess />} />
  </Routes>
);

export default AppRoutes;
