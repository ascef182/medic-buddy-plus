
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";

interface ProtectedRouteProps {
  children: JSX.Element;
  patientOnly?: boolean;
  caregiverOnly?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  patientOnly = false, 
  caregiverOnly = false 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user is a patient (has patient_id in metadata)
  const isPatient = user.user_metadata && user.user_metadata.patient_id;
  
  // If this route is patient-only and user is not a patient, redirect to dashboard
  if (patientOnly && !isPatient) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If this route is caregiver-only and user is a patient, redirect to patient dashboard
  if (caregiverOnly && isPatient) {
    return <Navigate to="/paciente/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
