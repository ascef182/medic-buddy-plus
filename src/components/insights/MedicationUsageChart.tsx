
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { MedicationType } from "@/context/MedicationContext";

interface MedicationUsageChartProps {
  medications: MedicationType[];
  dateRange: {
    from: Date;
    to: Date;
  };
}

// Função para gerar cores diferentes
const generateColors = (count: number) => {
  const baseColors = [
    "#2563eb", "#8b5cf6", "#ec4899", "#f97316", "#84cc16", 
    "#06b6d4", "#14b8a6", "#f59e0b", "#ef4444"
  ];
  
  return Array.from({ length: count }).map((_, i) => 
    baseColors[i % baseColors.length]
  );
};

const MedicationUsageChart = ({ medications, dateRange }: MedicationUsageChartProps) => {
  // Preparar dados para o gráfico
  const chartData = useMemo(() => {
    const medicationsByType = medications.reduce((acc, med) => {
      const type = med.type || "Outros";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(medicationsByType).map(([name, value]) => ({
      name: name.length > 8 ? name.substring(0, 8) + "..." : name,
      fullName: name,
      value,
    }));
  }, [medications]);

  const colors = generateColors(chartData.length);

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-muted-foreground text-xs">Nenhum medicamento encontrado.</p>
      </div>
    );
  }

  const config = {
    primary: { label: "Medicamentos", color: "#2563eb" },
    secondary: { label: "Quantidade", color: "#8b5cf6" },
  };

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md p-2 shadow-md">
          <p className="text-xs font-medium">{data.fullName}</p>
          <p className="text-xs">{data.value} medicamentos</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.1) return null; // Não mostrar labels para fatias muito pequenas
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="10"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-3">
      <Card className="p-3">
        <div className="text-sm font-medium mb-2">Medicamentos por tipo</div>
        <div className="h-[200px]">
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
                  label={renderCustomLabel}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip content={customTooltip} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>

      <Card className="p-3">
        <div className="text-sm font-medium mb-3">Top Medicamentos</div>
        <div className="space-y-2">
          {medications
            .slice()
            .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
            .slice(0, 3)
            .map((medication) => (
              <div key={medication.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                <div className="font-medium text-xs truncate flex-1 mr-2">{medication.name}</div>
                <div className="text-xs text-muted-foreground flex-shrink-0">
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
