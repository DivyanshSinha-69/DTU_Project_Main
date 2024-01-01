// PrivateRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";

const PrivateRoute = ({ element, allowedRoles }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.user.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (!allowedRoles.includes(userRole)) {
    // Redirect to unauthorized page or show an error message
    return <Navigate to="/unauthorized" />;       
  }
  
  return <Dashboard/>;
};

export default PrivateRoute;
