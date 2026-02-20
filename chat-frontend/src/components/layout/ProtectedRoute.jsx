import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const stored = localStorage.getItem("chatUser");
  const isLoggedIn = !!stored;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children; 
}

export default ProtectedRoute;
