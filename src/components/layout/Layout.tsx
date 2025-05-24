
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Pill,
  Clock,
  FileText,
  User,
  Menu,
  LogOut,
  Users,
  ChartBar,
  Calendar,
  CalendarPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import PatientSelector from "@/components/PatientSelector";
import { useMedication } from "@/context/MedicationContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPatientId, setSelectedPatientId } = useMedication();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handlePatientSelect = (id: string) => {
    setSelectedPatientId(id);
    localStorage.setItem("selectedPatientId", id);
  };

  const menuItems = [
    {
      title: "Início",
      path: "/",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Medicamentos",
      path: "/medicamentos",
      icon: <Pill className="h-4 w-4" />,
    },
    {
      title: "Lembretes",
      path: "/lembretes",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: "Consultas",
      path: "/consultas",
      icon: <CalendarPlus className="h-4 w-4" />,
    },
    {
      title: "Eventos",
      path: "/eventos",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Humor",
      path: "/humor",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Insights",
      path: "/insights",
      icon: <ChartBar className="h-4 w-4" />,
    },
    {
      title: "Contatos",
      path: "/contatos",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Perfil Médico",
      path: "/perfil",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex items-center justify-between h-16 px-4 max-w-full">
          <div className="flex items-center gap-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col h-full">
                  <div className="py-6">
                    <h2 className="text-lg font-semibold">BuddyDoctor</h2>
                    <p className="text-sm text-muted-foreground">
                      Assistente de Cuidados para Idosos
                    </p>
                  </div>
                  <Separator />
                  <div className="my-4">
                    <PatientSelector 
                      selectedPatientId={selectedPatientId} 
                      onPatientSelect={handlePatientSelect} 
                    />
                  </div>
                  <Separator />
                  <nav className="flex-1 py-4">
                    <div className="space-y-1">
                      {menuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                            location.pathname === item.path &&
                              "bg-accent text-accent-foreground"
                          )}
                        >
                          {item.icon}
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </nav>
                  <Separator />
                  <div className="pt-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <User className="h-6 w-6 text-primary" />
              <span className="hidden sm:inline-block">BuddyDoctor</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <PatientSelector 
                selectedPatientId={selectedPatientId} 
                onPatientSelect={handlePatientSelect} 
              />
            </div>
            <div className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="pt-16 flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 bg-background border-r">
          <div className="flex flex-col w-full py-6 px-4">
            <nav className="flex-1">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      location.pathname === item.path &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64">
          <div className="container mx-auto py-6 px-4 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
