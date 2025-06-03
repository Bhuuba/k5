// components/ProtectedRoute.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../components/Authentication/hooks/use-auth";
import AuthPopup from "../components/Authentication/components/AuthPopup";

const ProtectedRoute = () => {
  const auth = useAuth();
  console.log("ProtectedRoute - Auth state:", auth);
  return auth.isAuth ? <Outlet /> : <AuthPopup />;
};

export default ProtectedRoute;
