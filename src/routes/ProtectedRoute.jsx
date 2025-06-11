// components/ProtectedRoute.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../components/Authentication/hooks/useAuth";
import AuthPopup from "../components/Authentication/components/AuthPopup";

const ProtectedRoute = () => {
  const auth = useAuth();
  return auth.isAuth ? <Outlet /> : <AuthPopup />;
};

export default ProtectedRoute;
