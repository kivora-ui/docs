"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@kivora/nextjs";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useDemoData } from "@/components/demo/data-provider";
import { monthlySignupsSeed } from "@/lib/demo/seed";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default function DemoPage() {
  const { titles, subscribers } = useDemoData();

  const activeSubscribers = subscribers.filter((s) => s.status === "active");
  const mrrCents = activeSubscribers.reduce((sum, s) => sum + s.monthlyPriceCents, 0);
  const totalViews = titles.reduce((sum, t) => sum + t.viewsLast30Days, 0);
  const topTitles = [...titles].sort((a, b) => b.viewsLast30Days - a.viewsLast30Days).slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">Suscriptores activos</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{activeSubscribers.length}</p>
        </div>
        <div className="rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">Ingresos mensuales (MRR)</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{formatCents(mrrCents)}</p>
        </div>
        <div className="rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">Visualizaciones (30 días)</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{totalViews.toLocaleString("es-ES")}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border p-6">
        <p className="mb-4 text-sm font-semibold text-foreground">Altas de suscriptores (últimos 6 meses)</p>
        <ChartContainer
          config={{ signups: { label: "Altas", color: "var(--color-primary)" } }}
          className="h-64 w-full"
        >
          <BarChart data={monthlySignupsSeed}>
            <CartesianGrid vertical={false} strokeDasharray="4 5" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="signups" name="Altas" fill="var(--color-primary)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="rounded-lg border border-border p-6">
        <p className="mb-4 text-sm font-semibold text-foreground">Contenido más visto</p>
        <ol className="flex flex-col gap-2">
          {topTitles.map((title) => (
            <li key={title.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{title.name}</span>
              <span className="text-muted-foreground">{title.viewsLast30Days.toLocaleString("es-ES")}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
