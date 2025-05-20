
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Home, PillBottle, Bell, Smile, User, ClipboardList } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PillBottle size={24} />
          <h1 className="text-2xl font-semibold">MediCare</h1>
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
            to="/contatos"
            className={({ isActive }) =>
              `flex flex-col items-center p-3 flex-1 ${
                isActive ? "text-primary" : "text-gray-500"
              }`
            }
          >
            <User size={24} />
            <span className="text-xs mt-1">Contatos</span>
          </NavLink>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
