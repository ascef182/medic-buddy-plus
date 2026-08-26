
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Heart, Bell, ShieldCheck } from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Header/Navigation */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">BuddyDoctor</span>
        </div>
        <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90">
          Entrar
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Cuide melhor da saúde dos seus entes queridos
            </h1>
            <p className="text-lg text-gray-600">
              BuddyDoctor é o assistente ideal para gerenciar medicamentos, consultas e cuidados para idosos e pessoas que precisam de atenção especial.
            </p>
            <Button 
              onClick={() => navigate("/auth")} 
              size="lg" 
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
            >
              Experimente Agora
            </Button>
          </div>
          <div className="rounded-lg shadow-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" 
              alt="Cuidador e idoso" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefícios do BuddyDoctor</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lembretes Inteligentes</h3>
              <p className="text-gray-600">
                Receba lembretes personalizados para medicamentos, consultas e exames para nunca mais esquecer um compromisso importante.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Controle de Medicamentos</h3>
              <p className="text-gray-600">
                Gerencie facilmente doses, horários e estoque de medicamentos, com alertas automáticos quando estiver acabando.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Monitoramento de Saúde</h3>
              <p className="text-gray-600">
                Acompanhe o humor, pressão arterial e outros indicadores de saúde para identificar padrões e melhorar o bem-estar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-linear-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">O que nossos usuários dizem</h2>
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <p className="text-lg italic text-gray-600 mb-6">
              "O BuddyDoctor transformou a forma como cuido da minha mãe. Agora posso gerenciar todos os medicamentos e consultas dela facilmente, e recebo alertas no momento certo. É como ter um assistente de saúde pessoal 24 horas por dia!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-bold">Maria Silva</p>
                <p className="text-sm text-gray-500">Cuidadora</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Comece a cuidar melhor hoje mesmo</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Experimente o BuddyDoctor gratuitamente e descubra como é fácil gerenciar os cuidados de saúde da sua família.
          </p>
          <Button 
            onClick={() => navigate("/auth")} 
            variant="secondary"
            size="lg" 
            className="text-lg px-8 py-6"
          >
            Experimente Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-white" />
              <span className="font-bold text-xl">BuddyDoctor</span>
            </div>
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} BuddyDoctor. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
