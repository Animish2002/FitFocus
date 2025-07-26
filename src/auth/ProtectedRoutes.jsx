// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Adjust path as needed

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // If the user is authenticated, render the child routes
  // Otherwise, redirect them to the authentication page
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
