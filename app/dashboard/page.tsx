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

// Expanded color palette for the Bar and Pie charts
const CHART_COLORS = [
  "hsl(221 83% 53%)", // Blue
  "hsl(346 87% 60%)", // Pink
  "hsl(142 71% 45%)", // Green
  "hsl(38 92% 50%)",  // Yellow/Orange
  "hsl(271 91% 65%)", // Purple
  "hsl(199 89% 48%)", // Light Blue
  "hsl(10 80% 55%)",  // Coral
  "hsl(160 60% 45%)", // Teal
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStats(d))
      .catch((err) => console.error("Failed to fetch stats:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No data available.
      </div>
    );
  }

  const courseData = Object.entries(stats.byCourse || {}).map(
    ([name, value]) => ({ name, value })
  );

  const modeData = [
    { name: "Online Registration", value: stats.normal || 0 },
    { name: "Recording Registration", value: stats.recording || 0 },
  ].filter((data) => data.value > 0);

  const cards = [
    {
      label: "Total Registrations",
      value: stats.total || 0,
      icon: ClipboardList,
      color: "text-primary",
    },
    {
      label: "Online Mode Registration",
      value: stats.normal || 0,
      icon: Bot,
      color: "text-accent",
    },
    {
      label: "Recording Mode Registration",
      value: stats.recording || 0,
      icon: TrendingUp,
      color: "text-chart-3",
    },
    {
      label: "Total Courses",
      value: stats.totalCourse || 0,
      icon: BookOpen,
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Overview of registrations.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
              <c.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 min-w-0">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Registrations by Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            {courseData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No registrations yet.
              </p>
            ) : (
              <div className="h-[420px] w-full min-w-0 overflow-x-auto pb-4">
                <div
                  style={{
                    // Assigns ~80px of width per bar to ensure it never gets squished.
                    // Falls back to 100% width if there are only a few courses.
                    minWidth: courseData.length > 5 ? `${courseData.length * 80}px` : "100%",
                    height: "100%",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={courseData}
                      margin={{ top: 10, right: 10, left: 30, bottom: 20 }}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={160}
                      />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip cursor={{ fill: "transparent" }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {/* Maps through the data and assigns a unique color from CHART_COLORS */}
                        {courseData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Mode Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {modeData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No mode data available.
              </p>
            ) : (
              <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      label={({ percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {modeData.map((_, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
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
