
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Medications from "./pages/Medications";
import AddMedication from "./pages/AddMedication";
import MoodPage from "./pages/MoodPage";
import Appointments from "./pages/Appointments";
import Exams from "./pages/Exams";
import Events from "./pages/Events";
import Contacts from "./pages/Contacts";
import PatientProfile from "./pages/PatientProfile";
import PatientList from "./pages/PatientList";
import AddPatient from "./pages/AddPatient";
import EditPatient from "./pages/EditPatient";
import Reminders from "./pages/Reminders";
import InsightsPage from "./pages/InsightsPage";
import NotFound from "./pages/NotFound";
import PatientDashboard from "./pages/PatientDashboard"; 
import { MedicationProvider } from "./context/MedicationContext";
import { AuthProvider } from "./context/AuthContext";
import { AppointmentProvider } from "./context/AppointmentContext";

// Inicializar o QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MedicationProvider>
          <AppointmentProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Caregiver routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute caregiverOnly>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/medicamentos"
                element={
                  <ProtectedRoute caregiverOnly>
                    <Medications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/medicamentos/adicionar"
                element={
                  <ProtectedRoute caregiverOnly>
                    <AddMedication />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/humor"
                element={
                  <ProtectedRoute caregiverOnly>
                    <MoodPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/consultas"
                element={
                  <ProtectedRoute caregiverOnly>
                    <Appointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exames"
                element={
                  <ProtectedRoute caregiverOnly>
                    <Exams />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/eventos"
                element={
                  <ProtectedRoute caregiverOnly>
                    <Events />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contatos"
                element={
                  <ProtectedRoute caregiverOnly>
                    <Contacts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute caregiverOnly>
                    <PatientProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pacientes"
                element={
                  <ProtectedRoute caregiverOnly>
                    <PatientList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pacientes/adicionar"
                element={
                  <ProtectedRoute caregiverOnly>
                    <AddPatient />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pacientes/editar/:id"
                element={
                  <ProtectedRoute caregiverOnly>
                    <EditPatient />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lembretes"
                element={
                  <ProtectedRoute caregiverOnly>
                    <Reminders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insights"
                element={
                  <ProtectedRoute caregiverOnly>
                    <InsightsPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Patient routes */}
              <Route
                path="/paciente/dashboard"
                element={
                  <ProtectedRoute patientOnly>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster richColors />
          </AppointmentProvider>
        </MedicationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
