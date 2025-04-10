
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Get the intended destination from state, or default to home
  const from = location.state?.from || '/';

  // Show loading state if auth is still being determined
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Redirect to home or intended destination if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  
  // Render children if not authenticated
  return <>{children}</>;
};

export default PublicOnlyRoute;
