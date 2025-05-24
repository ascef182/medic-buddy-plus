
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // Save the attempted URL for redirecting after login
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
