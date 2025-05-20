
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { MedicationProvider } from "@/context/MedicationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Medications from "@/pages/Medications";
import AddMedication from "@/pages/AddMedication";
import PatientList from "@/pages/PatientList";
import AddPatient from "@/pages/AddPatient";
import EditPatient from "@/pages/EditPatient";
import Index from "@/pages/Index";
import MoodPage from "@/pages/MoodPage";
import Contacts from "@/pages/Contacts";
import PatientProfile from "@/pages/PatientProfile";
import Appointments from "@/pages/Appointments";
import Exams from "@/pages/Exams";
import Events from "@/pages/Events";
import Reminders from "@/pages/Reminders";
import Auth from "@/pages/Auth";
import LandingPage from "@/pages/LandingPage";
import InsightsPage from "@/pages/InsightsPage";
import NotFound from "@/pages/NotFound";

// Styling
import "@/App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MedicationProvider>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />

            <Route path="/medicamentos" element={<ProtectedRoute><Medications /></ProtectedRoute>} />
            <Route path="/medicamentos/adicionar" element={<ProtectedRoute><AddMedication /></ProtectedRoute>} />

            <Route path="/humor" element={<ProtectedRoute><MoodPage /></ProtectedRoute>} />

            <Route path="/contatos" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />

            <Route path="/ficha-medica" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />

            <Route path="/consultas" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />

            <Route path="/exames" element={<ProtectedRoute><Exams /></ProtectedRoute>} />

            <Route path="/eventos" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            
            <Route path="/lembretes" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />

            <Route path="/pacientes" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
            <Route path="/adicionar-paciente" element={<ProtectedRoute><AddPatient /></ProtectedRoute>} />
            <Route path="/editar-paciente/:id" element={<ProtectedRoute><EditPatient /></ProtectedRoute>} />

            <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />

            <Route path="/auth/*" element={<Auth />} />
            <Route path="/welcome" element={<LandingPage />} />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
          
          <Toaster />
        </MedicationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
