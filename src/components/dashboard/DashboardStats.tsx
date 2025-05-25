
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Pill, User, Calendar, FileText, Heart, Activity } from "lucide-react";
import { useMedication } from "@/context/MedicationContext";
import { useAppointment } from "@/context/AppointmentContext";

interface DashboardStatsProps {
  totalPatients: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ totalPatients }) => {
  const { medications, moodEntries } = useMedication();
  const { appointments, events, exams } = useAppointment();

  // Calculate stats
  const totalMedications = medications.length;
  const todayString = new Date().toISOString().split('T')[0];
  
  const todayAppointments = appointments.filter(apt => 
    apt.appointment_date.startsWith(todayString)
  ).length;
  
  const todayEvents = events.filter(event => 
    event.event_date.startsWith(todayString)
  ).length;
  
  const todayExams = exams.filter(exam => 
    exam.exam_date.startsWith(todayString)
  ).length;

  // Calculate average mood (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentMoods = moodEntries.filter(entry => 
    new Date(entry.date) >= sevenDaysAgo
  );

  const moodValues = { "muito_feliz": 5, "feliz": 4, "neutro": 3, "triste": 2, "muito_triste": 1 };
  const averageMood = recentMoods.length > 0 
    ? recentMoods.reduce((sum, entry) => sum + (moodValues[entry.mood as keyof typeof moodValues] || 3), 0) / recentMoods.length
    : 3;

  // Chart data
  const activityData = [
    { name: "Medicamentos", value: totalMedications, color: "#3b82f6" },
    { name: "Consultas Hoje", value: todayAppointments, color: "#10b981" },
    { name: "Eventos Hoje", value: todayEvents, color: "#f59e0b" },
    { name: "Exames Hoje", value: todayExams, color: "#ef4444" }
  ];

  const chartConfig = {
    value: {
      label: "Quantidade",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPatients}</div>
          <p className="text-xs text-muted-foreground">
            {totalPatients === 1 ? "paciente cadastrado" : "pacientes cadastrados"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Medicamentos</CardTitle>
          <Pill className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMedications}</div>
          <p className="text-xs text-muted-foreground">
            medicamentos cadastrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atividades Hoje</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todayAppointments + todayEvents + todayExams}
          </div>
          <p className="text-xs text-muted-foreground">
            consultas, eventos e exames
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Humor Médio (7 dias)</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageMood.toFixed(1)}/5</div>
          <p className="text-xs text-muted-foreground">
            baseado em {recentMoods.length} registros
          </p>
        </CardContent>
      </Card>

      {activityData.some(item => item.value > 0) && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Resumo de Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardStats;
