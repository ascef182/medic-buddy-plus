
import { useMemo } from "react";
import { format, isWithinInterval, subDays, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { MoodType, MoodEntry } from "@/context/MedicationContext";

interface MoodTrendsChartProps {
  moodEntries: MoodEntry[];
  dateRange: {
    from: Date;
    to: Date;
  };
}

// Valores para representação numérica dos humores
const MOOD_VALUES: Record<MoodType, number> = {
  happy: 8,
  neutral: 5,
  sad: 3,
  anxious: 4,
  afraid: 2,
  tense: 4,
  nervous: 3,
  depressed: 1,
};

// Rótulos para os tipos de humor
const MOOD_LABELS: Record<MoodType, string> = {
  happy: "Feliz",
  neutral: "Neutro",
  sad: "Triste",
  anxious: "Ansioso",
  afraid: "Medo",
  tense: "Tenso",
  nervous: "Nervoso",
  depressed: "Deprimido",
};

// Cores para cada tipo de humor
const MOOD_COLORS: Record<MoodType, string> = {
  happy: "#84cc16", // lime-500
  neutral: "#3b82f6", // blue-500
  sad: "#f43f5e", // rose-500
  anxious: "#f59e0b", // amber-500
  afraid: "#f97316", // orange-500
  tense: "#8b5cf6", // violet-500
  nervous: "#ef4444", // red-500
  depressed: "#64748b", // slate-500
};

// Emoji para cada tipo de humor
const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: "😊",
  neutral: "😐",
  sad: "😔",
  anxious: "😰",
  afraid: "😨",
  tense: "😖",
  nervous: "😤",
  depressed: "😞",
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
      const entriesForDay = moodEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return isWithinInterval(entryDate, {
          start: new Date(day.setHours(0, 0, 0, 0)),
          end: new Date(day.setHours(23, 59, 59, 999))
        });
      });
      
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
      let totalMoodValue = 0;
      
      for (const entry of entriesForDay) {
        totalMoodValue += MOOD_VALUES[entry.mood as MoodType];
      }
      
      const avgMoodValue = totalMoodValue / entriesForDay.length;
      
      // Determinar o humor predominante baseado no valor médio
      // Encontrar o humor mais próximo com base no valor médio
      let predominantMood: MoodType = "neutral";
      let closestDistance = Infinity;
      
      for (const [mood, value] of Object.entries(MOOD_VALUES)) {
        const distance = Math.abs(avgMoodValue - value);
        if (distance < closestDistance) {
          closestDistance = distance;
          predominantMood = mood as MoodType;
        }
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
    const moodCounts: Record<string, number> = {};
    
    for (const entry of moodEntries) {
      const moodType = entry.mood as MoodType;
      moodCounts[moodType] = (moodCounts[moodType] || 0) + 1;
    }
    
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
    anxious: { label: "Ansioso", color: MOOD_COLORS.anxious },
    afraid: { label: "Medo", color: MOOD_COLORS.afraid },
    tense: { label: "Tenso", color: MOOD_COLORS.tense },
    nervous: { label: "Nervoso", color: MOOD_COLORS.nervous },
    depressed: { label: "Deprimido", color: MOOD_COLORS.depressed },
  };

  // Se não houver dados, mostrar mensagem
  if (moodEntries.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Nenhum registro de humor encontrado para o período selecionado.</p>
      </div>
    );
  }

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md p-2 shadow-md">
          <p className="text-sm font-medium">{data.formattedDate}</p>
          {data.mood && (
            <div className="flex items-center gap-1 mt-1">
              <span>{MOOD_EMOJIS[data.mood]}</span>
              <span className="text-sm">{MOOD_LABELS[data.mood]}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="text-lg font-medium mb-2">Tendência de Humor</div>
        {/* Reduzir altura do gráfico para dispositivos móveis */}
        <div className="h-[180px] sm:h-[220px]">
          <ChartContainer config={config} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 8 }}
                  tickMargin={5}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => value.split('/')[0]} // Mostrar apenas o dia
                />
                <YAxis 
                  domain={[0, 9]}
                  ticks={[1, 3, 5, 8]}
                  tickFormatter={(value) => {
                    if (value === 1) return "Dep";
                    if (value === 3) return "Tris";
                    if (value === 5) return "Neu";
                    if (value === 8) return "Fel";
                    return "";
                  }}
                  width={30}
                />
                <Tooltip content={customTooltip} />
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
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        {moodStats.sort((a, b) => b.count - a.count).slice(0, 8).map((stat) => (
          <Card key={stat.mood}>
            <CardContent className="p-3 flex flex-col items-center">
              <div className="text-2xl mb-1">
                {MOOD_EMOJIS[stat.mood]}
              </div>
              <div className="text-xs font-medium">{MOOD_LABELS[stat.mood]}</div>
              <div className="text-xs text-muted-foreground">
                {stat.count} ({stat.percentage.toFixed(0)}%)
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MoodTrendsChart;
