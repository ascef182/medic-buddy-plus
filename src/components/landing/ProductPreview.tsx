import { Bell, Check, Clock, Heart } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Preview estático do produto pro hero da landing — mockup construído com os
// mesmos primitivos de UI do dashboard real (Card/Badge), no lugar da antiga
// foto de banco de imagens que não tinha nenhuma relação com o software.
const mockSchedule = [
  { time: "08:00", name: "Losartana 50mg", done: true },
  { time: "12:30", name: "Metformina 850mg", done: true },
  { time: "19:00", name: "Sinvastatina 20mg", done: false },
];

export function ProductPreview() {
  return (
    <Card className="w-full max-w-md overflow-hidden border-border/60 shadow-2xl shadow-primary/10">
      <CardHeader className="flex-row items-center justify-between space-y-0 border-b bg-muted/40 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Dona Alice</p>
            <p className="text-xs text-muted-foreground">Hoje, medicamentos</p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Bell className="h-3 w-3" />
          2 lembretes
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {mockSchedule.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  item.done ? "bg-secondary/15 text-secondary" : "bg-primary/10 text-primary"
                }`}
              >
                {item.done ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
            <Badge variant={item.done ? "secondary" : "outline"} className="text-[10px]">
              {item.done ? "Tomado" : "Pendente"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
