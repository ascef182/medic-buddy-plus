
import { ReactNode, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, PillBottle, Bell, Smile, User, ClipboardList, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import PatientSelector from "@/components/PatientSelector";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    localStorage.getItem("selectedPatientId")
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta.",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePatientSelect = (id: string) => {
    setSelectedPatientId(id);
    localStorage.setItem("selectedPatientId", id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PillBottle size={24} />
          <h1 className="text-2xl font-semibold">MediCare</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {user && (
            <>
              <PatientSelector 
                selectedPatientId={selectedPatientId} 
                onPatientSelect={handlePatientSelect} 
              />
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut size={20} />
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">{children}</main>

      <footer className="border-t bg-white">
        <nav className="flex justify-around items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center p-3 flex-1 ${
                isActive ? "text-primary" : "text-gray-500"
              }`
            }
            end
          >
            <Home size={24} />
            <span className="text-xs mt-1">Início</span>
          </NavLink>
          <NavLink
            to="/medicamentos"
            className={({ isActive }) =>
              `flex flex-col items-center p-3 flex-1 ${
                isActive ? "text-primary" : "text-gray-500"
              }`
            }
          >
            <PillBottle size={24} />
            <span className="text-xs mt-1">Remédios</span>
          </NavLink>
          <NavLink
            to="/lembretes"
            className={({ isActive }) =>
              `flex flex-col items-center p-3 flex-1 ${
                isActive ? "text-primary" : "text-gray-500"
              }`
            }
          >
            <Bell size={24} />
            <span className="text-xs mt-1">Lembretes</span>
          </NavLink>
          <NavLink
            to="/humor"
            className={({ isActive }) =>
              `flex flex-col items-center p-3 flex-1 ${
                isActive ? "text-primary" : "text-gray-500"
              }`
            }
          >
            <Smile size={24} />
            <span className="text-xs mt-1">Humor</span>
          </NavLink>
          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `flex flex-col items-center p-3 flex-1 ${
                isActive ? "text-primary" : "text-gray-500"
              }`
            }
          >
            <ClipboardList size={24} />
            <span className="text-xs mt-1">Ficha Médica</span>
          </NavLink>
          <NavLink
            to="/pacientes"
            className={({ isActive }) =>
              `flex flex-col items-center p-3 flex-1 ${
                isActive ? "text-primary" : "text-gray-500"
              }`
            }
          >
            <User size={24} />
            <span className="text-xs mt-1">Pacientes</span>
          </NavLink>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
