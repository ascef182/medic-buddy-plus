
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, CalendarIcon, ChartBar, ChartLine } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMedication } from "@/context/MedicationContext";
import MedicationUsageChart from "@/components/insights/MedicationUsageChart";
import MoodTrendsChart from "@/components/insights/MoodTrendsChart";

const TIME_PERIODS = {
  "7d": "7 dias",
  "30d": "30 dias",
  "all": "Todo período"
};

type TimePeriod = "7d" | "30d" | "all";

const InsightsPage = () => {
  const navigate = useNavigate();
  const { medications, moodEntries, patientProfile, selectedPatientId } = useMedication();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(selectedPatientId);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30d");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });

  // Calculate date range based on selected time period
  const handleTimePeriodChange = (value: TimePeriod) => {
    setTimePeriod(value);
    
    const today = new Date();
    let fromDate = today;
    
    if (value === "7d") {
      fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    } else if (value === "30d") {
      fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    } else if (value === "all") {
      // Use the earliest date available in data or default to 90 days ago
      const earliestMood = moodEntries.length > 0 
        ? new Date(Math.min(...moodEntries.map(e => new Date(e.date).getTime())))
        : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);
      
      fromDate = earliestMood;
    }
    
    setDateRange({ from: fromDate, to: today });
  };

  // Filter data based on selected date range and patient
  const filteredMoodEntries = useMemo(() => {
    return moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= dateRange.from && 
             entryDate <= dateRange.to;
    });
  }, [moodEntries, dateRange]);

  const filteredMedications = useMemo(() => {
    return medications;
  }, [medications]);

  return (
    <Layout>
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Insights</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Time period filter */}
          <Select
            value={timePeriod}
            onValueChange={(value) => handleTimePeriodChange(value as TimePeriod)}
          >
            <SelectTrigger className="w-[180px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TIME_PERIODS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Custom date range picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">
                  {dateRange.from && dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    "Selecione período"
                  )}
                </span>
                <span className="sm:hidden">
                  {dateRange.from && dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM")} - {format(dateRange.to, "dd/MM")}
                    </>
                  ) : (
                    "Período"
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                    setTimePeriod("all"); // Custom range
                  }
                }}
                numberOfMonths={1}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="medicacoes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="medicacoes">
            <ChartBar className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Medicações</span>
            <span className="sm:hidden">Med</span>
          </TabsTrigger>
          <TabsTrigger value="humor">
            <ChartLine className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Humor</span>
            <span className="sm:hidden">Humor</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medicacoes">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Uso de Medicamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <MedicationUsageChart 
                medications={filteredMedications}
                dateRange={dateRange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="humor">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tendências de Humor</CardTitle>
            </CardHeader>
            <CardContent>
              <MoodTrendsChart 
                moodEntries={filteredMoodEntries}
                dateRange={dateRange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default InsightsPage;
