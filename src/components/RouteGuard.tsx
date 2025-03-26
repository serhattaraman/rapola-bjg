
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RouteGuardProps {
  allowedRoles?: Array<'admin' | 'manager' | 'staff'>;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ allowedRoles }) => {
  const { isAuthenticated, currentUser } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user doesn't have required role
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default RouteGuard;
