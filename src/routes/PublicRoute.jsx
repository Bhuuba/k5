// components/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/Authentication/hooks/use-auth";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user && user.id) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PublicRoute;
