"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

const data = [
  { name: "बैशाख", darta: 120, chalani: 80 },
  { name: "जेठ", darta: 150, chalani: 95 },
  { name: "असार", darta: 210, chalani: 140 },
  { name: "साउन", darta: 250, chalani: 190 },
  { name: "भदौ", darta: 180, chalani: 110 },
  { name: "असोज", darta: 140, chalani: 100 },
  { name: "कार्तिक", darta: 90, chalani: 60 },
  { name: "मंसिर", darta: 110, chalani: 85 },
  { name: "पुष", darta: 130, chalani: 105 },
  { name: "माघ", darta: 160, chalani: 125 },
  { name: "फागुन", darta: 190, chalani: 155 },
  { name: "चैत", darta: 220, chalani: 175 },
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
