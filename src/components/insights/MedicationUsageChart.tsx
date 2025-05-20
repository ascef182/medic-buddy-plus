
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Medication } from "@/context/MedicationContext";

interface MedicationUsageChartProps {
  medications: Medication[];
  dateRange: {
    from: Date;
    to: Date;
  };
}

// Função para gerar cores diferentes
const generateColors = (count: number) => {
  const baseColors = [
    "#2563eb", // blue-600
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#f97316", // orange-500
    "#84cc16", // lime-500
    "#06b6d4", // cyan-500
    "#14b8a6", // teal-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
  ];
  
  // Se tivermos mais medicamentos que cores na base, vamos repetir as cores
  return Array.from({ length: count }).map((_, i) => 
    baseColors[i % baseColors.length]
  );
};

const MedicationUsageChart = ({ medications, dateRange }: MedicationUsageChartProps) => {
  // Preparar dados para o gráfico
  const chartData = useMemo(() => {
    // Agrupar medicamentos por tipo
    const medicationsByType = medications.reduce((acc, med) => {
      const type = med.type || "Outros";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Converter para formato adequado para o gráfico
    return Object.entries(medicationsByType).map(([name, value]) => ({
      name,
      value,
    }));
  }, [medications]);

  const colors = generateColors(chartData.length);

  // Se não houver dados, mostrar mensagem
  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Nenhum medicamento encontrado para o período selecionado.</p>
      </div>
    );
  }

  // Configuração do gráfico
  const config = {
    primary: { label: "Medicamentos", color: "#2563eb" }, // blue-600
    secondary: { label: "Quantidade", color: "#8b5cf6" }, // violet-500
  };

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md p-2 shadow-md">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm">{data.value} medicamentos</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="text-lg font-medium mb-2">Medicamentos por tipo</div>
        {/* Aumentar altura do gráfico para melhor visualização */}
        <div className="h-[250px] sm:h-[300px]">
          <ChartContainer 
            config={config}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip content={customTooltip} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-lg font-medium mb-4">Top Medicamentos</div>
        <div className="space-y-2">
          {medications
            .slice()
            .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
            .slice(0, 5)
            .map((medication) => (
              <div key={medication.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 rounded-md bg-muted/50">
                <div className="font-medium truncate">{medication.name}</div>
                <div className="text-sm text-muted-foreground mt-1 sm:mt-0">
                  {medication.quantity} {medication.unit}
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default MedicationUsageChart;
