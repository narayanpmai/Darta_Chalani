"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Download, Printer, Filter, Calendar } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { NepaliDatePickerComponent } from "@/components/ui/nepali-date-picker"

export default function DartaChalaniReportPage() {
  const [activeTab, setActiveTab] = useState<"darta" | "chalani">("darta")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data State
  const [dartaList, setDartaList] = useState<any[]>([])
  const [chalaniList, setChalaniList] = useState<any[]>([])

  // Filters State
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const loadData = async () => {
    setLoading(true)
    setError(null)

    // Load from cache first
    const cachedDarta = localStorage.getItem("lgoms_dartas")
    if (cachedDarta) {
      try { setDartaList(JSON.parse(cachedDarta)) } catch {}
    }
    const cachedChalani = localStorage.getItem("lgoms_chalanis")
    if (cachedChalani) {
      try { setChalaniList(JSON.parse(cachedChalani)) } catch {}
    }

    try {
      // Fetch Darta from backend
      const dartaData = await fetchApi('/Darta')
      if (Array.isArray(dartaData) && dartaData.length > 0) {
        const formattedDarta = dartaData.map(item => ({
          id: item.id,
          dartaNo: item.dartaNumber,
          sender: item.senderName,
          subject: item.subject,
          date: item.miti || (item.registrationDate ? item.registrationDate.split('T')[0] : ""),
          priority: item.priority || "सामान्य",
          status: item.status || "दर्ता भएको"
        }))
        setDartaList(formattedDarta)
        localStorage.setItem("lgoms_dartas", JSON.stringify(formattedDarta))
      }

      // Fetch Chalani from backend
      const chalaniData = await fetchApi('/Chalani')
      if (Array.isArray(chalaniData) && chalaniData.length > 0) {
        const formattedChalani = chalaniData.map(item => ({
          id: item.id,
          chalaniNo: item.chalaniNumber || item.dispatchNumber,
          receiver: item.receiverName,
          subject: item.subject,
          date: item.miti || (item.dispatchDate ? item.dispatchDate.split('T')[0] : ""),
          method: item.deliveryMethod || "Physical",
          status: item.status || "स्वीकृत"
        }))
        setChalaniList(formattedChalani)
        localStorage.setItem("lgoms_chalanis", JSON.stringify(formattedChalani))
      }
    } catch (err: any) {
      console.warn("Backend fetch failed, using local cached lists:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Clear filters
  const handleResetFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setStartDate("")
    setEndDate("")
  }

  // Normalize nepali date string for comparison: remove Devanagari digits, keep ASCII
  const normalizeDate = (d: string) => {
    if (!d) return ""
    // Convert Nepali/Devanagari digits to ASCII digits
    return d.replace(/[०-९]/g, (ch) => String(ch.charCodeAt(0) - 0x0966))
  }

  // Filter lists
  const filteredDarta = dartaList.filter(item => {
    const matchSearch = [item.dartaNo, item.sender, item.subject].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = statusFilter === "all" || item.status === statusFilter
    const normDate = normalizeDate(item.date)
    const matchStart = !startDate || normDate >= normalizeDate(startDate)
    const matchEnd = !endDate || normDate <= normalizeDate(endDate)
    return matchSearch && matchStatus && matchStart && matchEnd
  })

  const filteredChalani = chalaniList.filter(item => {
    const matchSearch = [item.chalaniNo, item.receiver, item.subject].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = statusFilter === "all" || item.status === statusFilter
    const normDate = normalizeDate(item.date)
    const matchStart = !startDate || normDate >= normalizeDate(startDate)
    const matchEnd = !endDate || normDate <= normalizeDate(endDate)
    return matchSearch && matchStatus && matchStart && matchEnd
  })

  // Export to CSV
  const handleExport = () => {
    let headers = []
    let rows = []
    let filename = ""

    if (activeTab === "darta") {
      headers = ["दर्ता नम्बर", "दर्ता मिति", "पठाउने कार्यालय", "विषय", "प्राथमिकता", "स्थिति"]
      rows = filteredDarta.map(item => [item.dartaNo, item.date, item.sender, item.subject, item.priority, item.status])
      filename = "Darta_Report.csv"
    } else {
      headers = ["चलानी नम्बर", "चलानी मिति", "प्राप्तकर्ता कार्यालय", "विषय", "निकासा माध्यम", "स्थिति"]
      rows = filteredChalani.map(item => [item.chalaniNo, item.date, item.receiver, item.subject, item.method, item.status])
      filename = "Chalani_Report.csv"
    }

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Print Report
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4 md:p-6 pb-20 print:p-0 print:pb-0">
      {/* Title block */}
      <div className="flex items-center justify-between border-b pb-4 print:border-none print:pb-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            दर्ता चलानी प्रतिवेदन (Darta Chalani Report)
          </h1>
          <p className="text-muted-foreground mt-1 print:hidden">
            दर्ता र चलानी भएका सबै पत्रहरूको विस्तृत प्रतिवेदन तथा विश्लेषण।
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button onClick={handlePrint} variant="outline" className="flex gap-2 items-center">
            <Printer className="h-4 w-4" /> प्रिन्ट गर्नुहोस्
          </Button>
          <Button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700 text-white flex gap-2 items-center">
            <Download className="h-4 w-4" /> एक्सपोर्ट (Excel/CSV)
          </Button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200 print:hidden">
        <button
          onClick={() => { setActiveTab("darta"); handleResetFilters(); }}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all ${
            activeTab === "darta"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          दर्ता प्रतिवेदन (Darta Register)
        </button>
        <button
          onClick={() => { setActiveTab("chalani"); handleResetFilters(); }}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all ${
            activeTab === "chalani"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          चलानी प्रतिवेदन (Chalani Register)
        </button>
      </div>

      {/* Filters block */}
      <Card className="border-slate-200 shadow-sm print:hidden overflow-visible">
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <Label className="text-xs font-bold text-gray-500 uppercase">खोज्नुहोस्</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={activeTab === "darta" ? "दर्ता नं, पठाउने कार्यालय वा विषय खोज्नुहोस्..." : "चलानी नं, प्राप्तकर्ता कार्यालय वा विषय..."}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 border-slate-300 h-8"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-500 uppercase">मिति देखि</Label>
            <div className="relative">
              <NepaliDatePickerComponent
                value={startDate}
                onChange={setStartDate}
              />
              <Calendar className="absolute right-2.5 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-500 uppercase">मिति सम्म</Label>
            <div className="relative">
              <NepaliDatePickerComponent
                value={endDate}
                onChange={setEndDate}
              />
              <Calendar className="absolute right-2.5 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tables */}
      <Card className="border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        <CardHeader className="bg-slate-50 border-b print:bg-white print:border-none">
          <CardTitle className="text-lg font-bold text-slate-800">
            {activeTab === "darta" ? "दर्ता प्रतिवेदन विवरण" : "चलानी प्रतिवेदन विवरण"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {activeTab === "darta" ? (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[180px] font-bold text-slate-700">दर्ता नम्बर</TableHead>
                  <TableHead className="font-bold text-slate-700">दर्ता मिति</TableHead>
                  <TableHead className="font-bold text-slate-700">पठाउने कार्यालय</TableHead>
                  <TableHead className="font-bold text-slate-700">विषय</TableHead>
                  <TableHead className="font-bold text-slate-700">प्राथमिकता</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">स्थिति</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDarta.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-bold text-blue-600">{item.dartaNo}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.sender}</TableCell>
                    <TableCell className="font-medium">{item.subject}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={item.priority === "जरुरी" || item.priority === "अति जरुरी" ? "border-red-200 text-red-700 bg-red-50" : "border-slate-200 text-slate-700"}>
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'दर्ता भएको' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'दर्ता भएको' ? 'bg-green-500' : 'bg-blue-500'}`} />
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDarta.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500 font-medium">कुनै दर्ता रेकर्डहरू फेला परेनन्।</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[180px] font-bold text-slate-700">चलानी नम्बर</TableHead>
                  <TableHead className="font-bold text-slate-700">चलानी मिति</TableHead>
                  <TableHead className="font-bold text-slate-700">प्राप्तकर्ता कार्यालय</TableHead>
                  <TableHead className="font-bold text-slate-700">विषय</TableHead>
                  <TableHead className="font-bold text-slate-700">निकासा माध्यम</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">स्थिति</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChalani.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-bold text-blue-600">{item.chalaniNo}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.receiver}</TableCell>
                    <TableCell className="font-medium">{item.subject}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-200 text-slate-700 bg-slate-50">
                        {item.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'स्वीकृत' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'स्वीकृत' ? 'bg-green-500' : 'bg-orange-500'}`} />
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredChalani.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500 font-medium">कुनै चलानी रेकर्डहरू फेला परेनन्।</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
