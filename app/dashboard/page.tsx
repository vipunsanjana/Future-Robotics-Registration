"use client";

import { useEffect, useState } from "react";
import { ClipboardList, TrendingUp, Bot, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  totalCourse: number;
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
    { name: "Online Registraion", value: stats.normal },
    { name: "Recording Registraion", value: stats.recording },
  ];

  const cards = [
    { label: "Total Registrations", value: stats.total, icon: ClipboardList, color: "text-primary" },
    { label: "Online Mode Registraion", value: stats.normal, icon: Bot, color: "text-accent" },
    { label: "Recording Mode Registraion", value: stats.recording, icon: TrendingUp, color: "text-chart-3" },
    { label: "Total Courses", value: stats.totalCourse, icon: BookOpen, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Overview of registrations.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Registrations by Course</CardTitle>
          </CardHeader>
          <CardContent>
            {courseData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No registrations yet.</p>
            ) : (
              <div className="h-64 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseData} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10 }} 
                      interval={0} 
                      angle={-25} 
                      textAnchor="end" 
                      height={55} 
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Mode Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.total === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No registrations yet.</p>
            ) : (
              <div className="h-64 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={modeData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={80} 
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {modeData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
