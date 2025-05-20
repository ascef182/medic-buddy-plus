
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
  const { signOut, user } = useAuth();
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
      path: "/dashboard",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Medicamentos",
      path: "/medicamentos",
      icon: <Pill className="h-5 w-5" />,
    },
    {
      title: "Lembretes",
      path: "/lembretes",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      title: "Humor",
      path: "/humor",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Insights",
      path: "/insights",
      icon: <ChartBar className="h-5 w-5" />,
    },
    {
      title: "Contatos",
      path: "/contatos",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Perfil Médico",
      path: "/perfil",
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="container flex items-center h-16 px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex flex-col h-full">
                <div className="py-4">
                  <h2 className="text-lg font-semibold">BuddyDoctor</h2>
                  <p className="text-sm text-muted-foreground">
                    Assistente de Cuidados para Idosos
                  </p>
                </div>
                <Separator />
                <div className="mt-4 mb-4">
                  <PatientSelector 
                    selectedPatientId={selectedPatientId} 
                    onPatientSelect={handlePatientSelect} 
                  />
                </div>
                <Separator />
                <nav className="flex-1 py-4">
                  <div className="grid gap-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          location.pathname === item.path &&
                            "bg-accent text-accent-foreground font-medium"
                        )}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </nav>
                <Separator />
                <Button
                  variant="ghost"
                  className="mt-4 justify-start gap-3"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <User className="h-6 w-6" />
            <span className="hidden md:inline-block">BuddyDoctor</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:block">
              <PatientSelector 
                selectedPatientId={selectedPatientId} 
                onPatientSelect={handlePatientSelect} 
              />
            </div>
          </div>
        </div>
      </header>
      <div className="hidden md:flex">
        <aside className="fixed inset-y-0 left-0 w-64 bg-background border-r pt-16">
          <div className="flex flex-col h-full py-6 px-4">
            <nav className="flex-1">
              <div className="grid gap-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      location.pathname === item.path &&
                        "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </div>
            </nav>
            <Separator className="my-4" />
            <Button
              variant="ghost"
              className="justify-start gap-3"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sair
            </Button>
          </div>
        </aside>
        <main className="flex-1 pl-64">
          <div className="container py-6 px-4">{children}</div>
        </main>
      </div>
      <div className="flex md:hidden">
        <main className="flex-1">
          <div className="container py-6 px-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
