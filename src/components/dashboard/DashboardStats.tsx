
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Pill, User, Calendar, Heart, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface DashboardStatsProps {
  totalPatients: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ totalPatients }) => {
  const { user } = useAuth();
  const [allPatientStats, setAllPatientStats] = useState({
    totalMedications: 0,
    todayActivities: 0,
    averageMood: 3,
    totalMoodEntries: 0
  });

  useEffect(() => {
    const fetchAllPatientsData = async () => {
      if (!user) return;

      try {
        // Get all patients for this caregiver
        const { data: patientsData, error: patientsError } = await supabase
          .from("patients")
          .select("id")
          .eq("caregiver_id", user.id);

        if (patientsError) throw patientsError;

        const patientIds = patientsData?.map(p => p.id) || [];
        
        if (patientIds.length === 0) return;

        // Get all medications for all patients
        const { data: medicationsData } = await supabase
          .from("patient_medications")
          .select("id")
          .in("patient_id", patientIds);

        // Get today's appointments, events, and exams for all patients
        const todayString = new Date().toISOString().split('T')[0];
        
        const [appointmentsData, eventsData, examsData] = await Promise.all([
          supabase
            .from("patient_appointments")
            .select("id")
            .in("patient_id", patientIds)
            .gte("appointment_date", todayString)
            .lt("appointment_date", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
          
          supabase
            .from("patient_events")
            .select("id")
            .in("patient_id", patientIds)
            .gte("event_date", todayString)
            .lt("event_date", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
          
          supabase
            .from("patient_exams")
            .select("id")
            .in("patient_id", patientIds)
            .gte("exam_date", todayString)
            .lt("exam_date", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        ]);

        // Get mood entries for the last 7 days for all patients
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data: moodData } = await supabase
          .from("patient_mood_entries")
          .select("mood")
          .in("patient_id", patientIds)
          .gte("date", sevenDaysAgo.toISOString());

        // Calculate stats
        const totalMedications = medicationsData?.length || 0;
        const todayActivities = (appointmentsData.data?.length || 0) + 
                               (eventsData.data?.length || 0) + 
                               (examsData.data?.length || 0);

        // Calculate average mood
        const moodValues = { "muito_feliz": 5, "feliz": 4, "neutro": 3, "triste": 2, "muito_triste": 1 };
        const moodEntries = moodData || [];
        const averageMood = moodEntries.length > 0 
          ? moodEntries.reduce((sum, entry) => sum + (moodValues[entry.mood as keyof typeof moodValues] || 3), 0) / moodEntries.length
          : 3;

        setAllPatientStats({
          totalMedications,
          todayActivities,
          averageMood,
          totalMoodEntries: moodEntries.length
        });

      } catch (error) {
        console.error("Error fetching all patients data:", error);
      }
    };

    fetchAllPatientsData();
  }, [user]);

  // Chart data based on all patients
  const activityData = [
    { name: "Medicamentos", value: allPatientStats.totalMedications, color: "#4A89DC" },
    { name: "Atividades Hoje", value: allPatientStats.todayActivities, color: "#4A89DC" }
  ];

  const chartConfig = {
    value: {
      label: "Quantidade",
      color: "#4A89DC",
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
          <div className="text-2xl font-bold">{allPatientStats.totalMedications}</div>
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
          <div className="text-2xl font-bold">{allPatientStats.todayActivities}</div>
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
          <div className="text-2xl font-bold">{allPatientStats.averageMood.toFixed(1)}/5</div>
          <p className="text-xs text-muted-foreground">
            baseado em {allPatientStats.totalMoodEntries} registros
          </p>
        </CardContent>
      </Card>

      {(allPatientStats.totalMedications > 0 || allPatientStats.todayActivities > 0) && (
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
                  <Bar dataKey="value" fill="#4A89DC" />
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
