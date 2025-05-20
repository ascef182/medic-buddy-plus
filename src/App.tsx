
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MedicationProvider } from "./context/MedicationContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Medications from "./pages/Medications";
import AddMedication from "./pages/AddMedication";
import Reminders from "./pages/Reminders";
import MoodPage from "./pages/MoodPage";
import Contacts from "./pages/Contacts";
import PatientProfile from "./pages/PatientProfile";
import Auth from "./pages/Auth";
import PatientList from "./pages/PatientList";
import AddPatient from "./pages/AddPatient";
import EditPatient from "./pages/EditPatient";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MedicationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/medicamentos" element={<ProtectedRoute><Medications /></ProtectedRoute>} />
              <Route path="/medicamentos/adicionar" element={<ProtectedRoute><AddMedication /></ProtectedRoute>} />
              <Route path="/lembretes" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
              <Route path="/humor" element={<ProtectedRoute><MoodPage /></ProtectedRoute>} />
              <Route path="/contatos" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
              <Route path="/pacientes" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
              <Route path="/adicionar-paciente" element={<ProtectedRoute><AddPatient /></ProtectedRoute>} />
              <Route path="/editar-paciente/:id" element={<ProtectedRoute><EditPatient /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MedicationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
