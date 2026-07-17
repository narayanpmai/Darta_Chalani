"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

const data = [
  { name: "Jan", darta: 400, chalani: 240 },
  { name: "Feb", darta: 300, chalani: 139 },
  { name: "Mar", darta: 200, chalani: 980 },
  { name: "Apr", darta: 278, chalani: 390 },
  { name: "May", darta: 189, chalani: 480 },
  { name: "Jun", darta: 239, chalani: 380 },
  { name: "Jul", darta: 349, chalani: 430 },
]

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderRadius: "8px",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
          itemStyle={{ color: "hsl(var(--foreground))" }}
          cursor={{ fill: "hsl(var(--muted)/0.4)" }}
        />
        <Legend wrapperStyle={{ paddingTop: "20px" }} />
        <Bar dataKey="darta" name="Darta (दर्ता)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="chalani" name="Chalani (चलानी)" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
