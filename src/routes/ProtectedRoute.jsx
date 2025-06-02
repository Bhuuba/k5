// components/ProtectedRoute.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../components/Authentication/hooks/use-auth";
import AuthPopup from "../components/Authentication/components/AuthPopup";

const ProtectedRoute = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Outlet /> : <AuthPopup />;
};

export default ProtectedRoute;
