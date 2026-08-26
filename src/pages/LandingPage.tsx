import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProductPreview } from "@/components/landing/ProductPreview";
import {
  Calendar,
  FileText,
  Heart,
  LineChart,
  Phone,
  Pill,
  Users,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Pill,
    title: "Controle de medicamentos",
    description:
      "Doses, horários e estoque em um só lugar, com alertas automáticos quando um remédio está acabando.",
  },
  {
    icon: Calendar,
    title: "Consultas",
    description:
      "Organize consultas médicas e nunca perca uma data importante — tudo visível de relance.",
  },
  {
    icon: FileText,
    title: "Exames",
    description: "Guarde e acompanhe exames realizados, sem depender de papel ou pastas soltas.",
  },
  {
    icon: LineChart,
    title: "Humor e insights",
    description:
      "Registre o humor do dia a dia e veja gráficos de tendência para identificar padrões cedo.",
  },
  {
    icon: Users,
    title: "Vários pacientes",
    description:
      "Cuida de mais de uma pessoa? Gerencie o perfil de cada paciente separadamente, sem misturar dados.",
  },
  {
    icon: Phone,
    title: "Contatos de emergência",
    description: "Tenha médicos e contatos importantes sempre à mão, prontos para quando precisar.",
  },
];

const steps = [
  {
    number: "01",
    title: "Crie sua conta",
    description: "Cadastro rápido com email e senha, protegido por verificação em duas etapas.",
  },
  {
    number: "02",
    title: "Adicione um paciente",
    description: "Cadastre quem você cuida — pode ser um familiar ou mais de um.",
  },
  {
    number: "03",
    title: "Acompanhe no dia a dia",
    description:
      "Medicamentos, consultas, exames e humor, com lembretes automáticos pra você não esquecer nada.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">BuddyDoctor</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#recursos" className="transition-colors hover:text-foreground">
              Recursos
            </a>
            <a href="#como-funciona" className="transition-colors hover:text-foreground">
              Como funciona
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={() => navigate("/auth")} className="rounded-full px-5">
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative mx-auto grid gap-12 px-4 py-20 md:grid-cols-2 md:items-center md:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Heart className="h-3.5 w-3.5 text-primary" />
              Feito para cuidadores
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Cuide melhor de quem você ama
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              BuddyDoctor reúne medicamentos, consultas, exames e bem-estar num só lugar, com
              lembretes automáticos — pra você nunca perder o controle dos cuidados de um familiar.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="gap-2 rounded-full px-7 text-base"
              >
                Começar agora
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                variant="outline"
                size="lg"
                className="rounded-full px-7 text-base"
              >
                Já tenho conta
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center md:justify-end"
          >
            <ProductPreview />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="recursos" className="border-t border-border/60 bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tudo que um cuidador precisa
            </h2>
            <p className="mt-4 text-muted-foreground">
              Seis áreas do cuidado diário, organizadas num só app.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
                className="group rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Como funciona</h2>
            <p className="mt-4 text-muted-foreground">Três passos simples pra começar.</p>
          </motion.div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative text-center md:text-left"
              >
                <span className="text-4xl font-extrabold text-primary/20">{step.number}</span>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-border/60 bg-primary py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
            Comece a cuidar melhor hoje mesmo
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
            Crie sua conta gratuitamente e organize os cuidados de saúde da sua família em minutos.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            variant="secondary"
            size="lg"
            className="mt-8 gap-2 rounded-full px-8 text-base"
          >
            Criar conta grátis
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-background py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" />
            </div>
            <span className="font-semibold">BuddyDoctor</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#recursos" className="transition-colors hover:text-foreground">
              Recursos
            </a>
            <a href="#como-funciona" className="transition-colors hover:text-foreground">
              Como funciona
            </a>
            <button onClick={() => navigate("/auth")} className="transition-colors hover:text-foreground">
              Entrar
            </button>
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BuddyDoctor
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
