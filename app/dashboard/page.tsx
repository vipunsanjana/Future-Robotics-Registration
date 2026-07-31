"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Users, Wallet, TrendingUp, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Stats {
  total: number;
  normal: number;
  recording: number;
  revenue: number;
  byCourse: Record<string, number>;
}

const PIE_COLORS = ["hsl(221 83% 53%)", "hsl(199 89% 48%)", "hsl(142 71% 45%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)"];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStats(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">No data available.</div>;
  }

  const courseData = Object.entries(stats.byCourse).map(([name, value]) => ({ name, value }));
  const modeData = [
    { name: "Normal", value: stats.normal },
    { name: "Recording", value: stats.recording },
  ];

  const cards = [
    { label: "Total Registrations", value: stats.total, icon: ClipboardList, color: "text-primary" },
    { label: "Normal Mode", value: stats.normal, icon: Bot, color: "text-accent" },
    { label: "Recording Mode", value: stats.recording, icon: TrendingUp, color: "text-chart-3" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of registrations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Registrations by Course</CardTitle>
          </CardHeader>
          <CardContent>
            {courseData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No registrations yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(221 83% 53%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mode Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.total === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No registrations yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={modeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {modeData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
