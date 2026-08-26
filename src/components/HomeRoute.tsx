import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import Index from "@/pages/Index";
import LandingPage from "@/pages/LandingPage";

// A rota "/" atende dois públicos diferentes: quem já está logado deve cair
// direto no dashboard (comportamento antigo, preservado), quem não está
// logado deve ver a landing page pública — hoje em SaaS é padrão a home ser
// a própria landing, não um redirecionamento cego pro login.
const HomeRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return user ? <Index /> : <LandingPage />;
};

export default HomeRoute;
