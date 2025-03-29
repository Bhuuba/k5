// components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./form/hooks/use-auth";
import AuthPopup from "components/AuthPopup/AuthPopup";

const ProtectedRoute = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Outlet /> : <AuthPopup />;
};

export default ProtectedRoute;
