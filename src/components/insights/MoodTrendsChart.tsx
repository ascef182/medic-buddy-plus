
import { useMemo } from "react";
import { format, isWithinInterval, subDays, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { MoodEntry, MoodType } from "@/context/MedicationContext";

interface MoodTrendsChartProps {
  moodEntries: MoodEntry[];
  dateRange: {
    from: Date;
    to: Date;
  };
}

const MOOD_VALUES: Record<MoodType, number> = {
  happy: 3,
  neutral: 2,
  sad: 1,
};

const MOOD_LABELS: Record<MoodType, string> = {
  happy: "Feliz",
  neutral: "Neutro",
  sad: "Triste",
};

const MOOD_COLORS: Record<MoodType, string> = {
  happy: "#84cc16", // lime-500
  neutral: "#3b82f6", // blue-500
  sad: "#f43f5e", // rose-500
};

const MoodTrendsChart = ({ moodEntries, dateRange }: MoodTrendsChartProps) => {
  // Preparar dados para o gráfico agrupados por dia
  const chartData = useMemo(() => {
    // Se não houver dados, retornar array vazio
    if (moodEntries.length === 0) {
      return [];
    }
    
    // Criar uma entrada para cada dia no intervalo de datas
    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    
    return days.map(day => {
      // Filtrar entradas de humor para este dia
      const entriesForDay = moodEntries.filter(entry => 
        isWithinInterval(new Date(entry.date), {
          start: new Date(day.setHours(0, 0, 0, 0)),
          end: new Date(day.setHours(23, 59, 59, 999))
        })
      );
      
      // Se não houver entradas para este dia, retornar null para valor de humor
      if (entriesForDay.length === 0) {
        return {
          date: day,
          formattedDate: format(day, "dd/MM", { locale: ptBR }),
          moodValue: null,
          mood: null as MoodType | null,
        };
      }
      
      // Calcular humor médio para o dia (média dos valores numéricos)
      const totalMoodValue = entriesForDay.reduce(
        (sum, entry) => sum + MOOD_VALUES[entry.mood], 
        0
      );
      
      const avgMoodValue = totalMoodValue / entriesForDay.length;
      
      // Determinar o humor predominante baseado no valor médio
      let predominantMood: MoodType;
      if (avgMoodValue > 2.5) {
        predominantMood = "happy";
      } else if (avgMoodValue >= 1.5) {
        predominantMood = "neutral";
      } else {
        predominantMood = "sad";
      }
      
      return {
        date: day,
        formattedDate: format(day, "dd/MM", { locale: ptBR }),
        moodValue: avgMoodValue,
        mood: predominantMood,
      };
    });
  }, [moodEntries, dateRange]);

  // Calcular estatísticas de humor
  const moodStats = useMemo(() => {
    const moodCounts = moodEntries.reduce(
      (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      },
      {} as Record<MoodType, number>
    );
    
    const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood: mood as MoodType,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }, [moodEntries]);

  // Configuração do gráfico
  const config = {
    happy: { label: "Feliz", color: MOOD_COLORS.happy },
    neutral: { label: "Neutro", color: MOOD_COLORS.neutral },
    sad: { label: "Triste", color: MOOD_COLORS.sad },
  };

  // Se não houver dados, mostrar mensagem
  if (moodEntries.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Nenhum registro de humor encontrado para o período selecionado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="text-lg font-medium mb-2">Tendência de Humor</div>
        <div className="h-80">
          <ChartContainer config={config} className="h-full">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 4]}
                ticks={[1, 2, 3]}
                tickFormatter={(value) => {
                  if (value === 1) return "Triste";
                  if (value === 2) return "Neutro";
                  if (value === 3) return "Feliz";
                  return "";
                }}
              />
              <ChartTooltip>
                <ChartTooltipContent />
              </ChartTooltip>
              <Area
                type="monotone"
                dataKey="moodValue"
                stroke="#3b82f6"
                fill="url(#colorMood)"
                connectNulls
              />
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ChartContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["happy", "neutral", "sad"] as MoodType[]).map((moodType) => {
          const stat = moodStats.find(s => s.mood === moodType) || { count: 0, percentage: 0 };
          
          return (
            <Card key={moodType}>
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-4xl mb-2">
                  {moodType === "happy" ? "😊" : moodType === "neutral" ? "😐" : "😔"}
                </div>
                <div className="text-lg font-medium">{MOOD_LABELS[moodType]}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.count} registros ({stat.percentage.toFixed(0)}%)
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MoodTrendsChart;
