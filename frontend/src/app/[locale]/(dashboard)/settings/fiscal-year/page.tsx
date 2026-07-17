"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, CheckCircle2 } from "lucide-react"
import { NepaliDatePickerComponent } from "@/components/ui/nepali-date-picker"

export default function FiscalYearSettingsPage() {
  const [fiscalYears, setFiscalYears] = useState<any[]>([])
  const [newFy, setNewFy] = useState({ name: "", startDate: "", endDate: "" })
  const [loading, setLoading] = useState(false)

  // Note: We use mock data for now in case the DB connection fails
  useEffect(() => {
    fetchFiscalYears()
  }, [])

  const fetchFiscalYears = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/fiscalyear")
      if (res.ok) {
        const data = await res.json()
        setFiscalYears(data)
      } else {
        loadLocalData()
      }
    } catch {
      loadLocalData()
    }
  }

  const loadLocalData = () => {
    const stored = localStorage.getItem("lgoms_fiscal_years")
    if (stored) {
      setFiscalYears(JSON.parse(stored))
    } else {
      const seed = [
        { id: "1", name: "२०८१/०८२", startDate: "2024-07-16T00:00:00", endDate: "2025-07-15T00:00:00", isActive: true },
        { id: "2", name: "२०८०/०८१", startDate: "2023-07-17T00:00:00", endDate: "2024-07-15T00:00:00", isActive: false },
      ]
      setFiscalYears(seed)
      localStorage.setItem("lgoms_fiscal_years", JSON.stringify(seed))
    }
  }

  const handleAdd = async () => {
    if (!newFy.name || !newFy.startDate || !newFy.endDate) return
    setLoading(true)
    
    const newItem = {
      id: Date.now().toString(),
      name: newFy.name,
      startDate: newFy.startDate.includes("T") ? newFy.startDate : `${newFy.startDate}T00:00:00`,
      endDate: newFy.endDate.includes("T") ? newFy.endDate : `${newFy.endDate}T00:00:00`,
      isActive: false
    }

    try {
      const res = await fetch("http://localhost:5000/api/fiscalyear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFy)
      })
      if (res.ok) {
        await fetchFiscalYears()
        setNewFy({ name: "", startDate: "", endDate: "" })
      } else {
        saveLocal(newItem)
      }
    } catch {
      saveLocal(newItem)
    }
    setLoading(false)
  }

  const saveLocal = (newItem: any) => {
    const updated = [...fiscalYears, newItem]
    setFiscalYears(updated)
    localStorage.setItem("lgoms_fiscal_years", JSON.stringify(updated))
    setNewFy({ name: "", startDate: "", endDate: "" })
  }

  const handleSetActive = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/fiscalyear/${id}/set-active`, {
        method: "POST"
      })
      if (res.ok) {
        await fetchFiscalYears()
        window.location.reload()
      } else {
        setActiveLocal(id)
      }
    } catch {
      setActiveLocal(id)
    }
    setLoading(false)
  }

  const setActiveLocal = (id: string) => {
    const updated = fiscalYears.map(fy => ({
      ...fy,
      isActive: fy.id === id
    }))
    setFiscalYears(updated)
    localStorage.setItem("lgoms_fiscal_years", JSON.stringify(updated))
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Fiscal Year Settings</h1>
        <p className="text-muted-foreground mt-1">Manage and set active fiscal years for the platform.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit shadow-sm border-t-4 border-t-blue-600 overflow-visible">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Add Fiscal Year
            </CardTitle>
            <CardDescription>Create a new fiscal year period.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name (e.g. २०८१/०८२)</Label>
              <Input 
                value={newFy.name} 
                onChange={e => setNewFy({...newFy, name: e.target.value})} 
                placeholder="२०८१/०८२" 
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <NepaliDatePickerComponent 
                value={newFy.startDate} 
                onChange={date => setNewFy({...newFy, startDate: date})} 
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <NepaliDatePickerComponent 
                value={newFy.endDate} 
                onChange={date => setNewFy({...newFy, endDate: date})} 
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAdd} disabled={loading}>
              Save Fiscal Year
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Fiscal Years List
            </CardTitle>
            <CardDescription>Only one fiscal year can be active at a time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fiscalYears.map((fy) => (
                  <TableRow key={fy.id}>
                    <TableCell className="font-medium">{fy.name}</TableCell>
                    <TableCell>{fy.startDate.split('T')[0]}</TableCell>
                    <TableCell>{fy.endDate.split('T')[0]}</TableCell>
                    <TableCell>
                      {fy.isActive ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!fy.isActive && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSetActive(fy.id)}
                          disabled={loading}
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Set Active
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
