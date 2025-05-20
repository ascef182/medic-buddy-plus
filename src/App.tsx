
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
              <Route path="/auth/reset-password" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/medicamentos"
                element={
                  <ProtectedRoute>
                    <Medications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/medicamentos/adicionar"
                element={
                  <ProtectedRoute>
                    <AddMedication />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/humor"
                element={
                  <ProtectedRoute>
                    <MoodPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/consultas"
                element={
                  <ProtectedRoute>
                    <Appointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exames"
                element={
                  <ProtectedRoute>
                    <Exams />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/eventos"
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contatos"
                element={
                  <ProtectedRoute>
                    <Contacts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <PatientProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pacientes"
                element={
                  <ProtectedRoute>
                    <PatientList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pacientes/adicionar"
                element={
                  <ProtectedRoute>
                    <AddPatient />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pacientes/editar/:id"
                element={
                  <ProtectedRoute>
                    <EditPatient />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lembretes"
                element={
                  <ProtectedRoute>
                    <Reminders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insights"
                element={
                  <ProtectedRoute>
                    <InsightsPage />
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
