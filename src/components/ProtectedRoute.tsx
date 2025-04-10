
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // If not authenticated and not loading, show a toast
    if (!isAuthenticated && !isLoading) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You need to be logged in to access this page.",
      });
    }
  }, [isAuthenticated, isLoading, toast]);

  // Show loading state if auth is still being determined
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }
  
  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
