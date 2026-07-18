"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, Filter, FileText, Send, MessageSquare, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function ReportsPage() {
  const [stats, setStats] = useState({
    totalDarta: 0,
    totalChalani: 0,
    totalTippani: 0,
    totalSifaris: 0,
  })

  // Simulated chart data
  const [wardData, setWardData] = useState([
    { name: "Ward 1", revenue: 4000, requests: 24 },
    { name: "Ward 2", revenue: 3000, requests: 13 },
    { name: "Ward 3", revenue: 2000, requests: 98 },
    { name: "Ward 4", revenue: 2780, requests: 39 },
    { name: "Ward 5", revenue: 1890, requests: 48 },
  ])

  const [documentTypes, setDocumentTypes] = useState([
    { name: "Citizenship", value: 400 },
    { name: "Relationship", value: 300 },
    { name: "Birth Reg", value: 300 },
    { name: "Business", value: 200 },
  ])

  useEffect(() => {
    // In a real application, we would fetch from the backend:
    // fetch('/api/reports/dashboard-stats')
    //   .then(res => res.json())
    //   .then(data => setStats(data))
    
    // Using mock values initially so the UI looks complete even if DB is empty
    setStats({
      totalDarta: 1420,
      totalChalani: 850,
      totalTippani: 234,
      totalSifaris: 3450,
    })
  }, [])

  return (
    <div className="flex flex-col gap-6 w-full mx-auto p-2 md:p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights into municipal operations (ई-सुशासन प्रतिवेदन)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter Data</Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"><Download className="h-4 w-4" /> Export Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Darta (दर्ता)</CardTitle>
            <FolderOpenIcon className="w-5 h-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalDarta}</div>
            <p className="text-xs opacity-80 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Chalani (चलानी)</CardTitle>
            <Send className="w-5 h-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalChalani}</div>
            <p className="text-xs opacity-80 mt-1">+4% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Tippani (टिप्पणी)</CardTitle>
            <MessageSquare className="w-5 h-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTippani}</div>
            <p className="text-xs opacity-80 mt-1">12 pending approval</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Sifaris (सिफारिस)</CardTitle>
            <FileText className="w-5 h-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSifaris}</div>
            <p className="text-xs opacity-80 mt-1">+34% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-4">
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Revenue & Service Requests by Ward</CardTitle>
            <CardDescription>Comparison across top 5 active wards.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="#6B7280" tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#6B7280" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue (Rs x1000)" fill="#427DF3" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="requests" name="Service Requests" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">e-Recommendation Breakdown</CardTitle>
            <CardDescription>Types of certificates issued this month.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={documentTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {documentTypes.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function FolderOpenIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  )
}
