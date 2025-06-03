// components/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/Authentication/hooks/use-auth";

const PublicRoute = ({ children }) => {
  const { isAuth, id } = useAuth();
  console.log("PublicRoute - Auth state:", { isAuth, id });
  if (isAuth && id) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PublicRoute;
