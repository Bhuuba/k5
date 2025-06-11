// components/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/Authentication/hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { isAuth, id } = useAuth();
  if (isAuth && id) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PublicRoute;
