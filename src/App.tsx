
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MedicationProvider } from "./context/MedicationContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Medications from "./pages/Medications";
import AddMedication from "./pages/AddMedication";
import Reminders from "./pages/Reminders";
import MoodPage from "./pages/MoodPage";
import Contacts from "./pages/Contacts";
import PatientProfile from "./pages/PatientProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MedicationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/medicamentos" element={<Medications />} />
            <Route path="/medicamentos/adicionar" element={<AddMedication />} />
            <Route path="/lembretes" element={<Reminders />} />
            <Route path="/humor" element={<MoodPage />} />
            <Route path="/contatos" element={<Contacts />} />
            <Route path="/perfil" element={<PatientProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MedicationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
