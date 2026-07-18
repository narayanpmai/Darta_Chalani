"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText, Send, AlertTriangle, FileSignature, FolderOpen, MessageSquare } from "lucide-react"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { fetchApi } from "@/lib/api"

function toNepaliNumber(num: number | string): string {
  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"]
  return num
    .toString()
    .split("")
    .map(digit => {
      const parsed = parseInt(digit)
      return isNaN(parsed) ? digit : nepaliDigits[parsed]
    })
    .join("")
}

function isToday(dateInput: any): boolean {
  if (!dateInput) return false
  try {
    const d = new Date(dateInput)
    const today = new Date()
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear()
  } catch {
    return false
  }
}

export default function Dashboard() {
  const [counts, setCounts] = useState({
    letters: 0,
    lettersDraft: 0,
    applications: 0,
    applicationsApproved: 0,
    dartas: 0,
    dartasToday: 0,
    chalanis: 0,
    chalanisToday: 0,
    tippanis: 0,
    tippanisPending: 0,
    sifaris: 0,
    sifarisIssued: 0
  })

  const loadData = () => {
    // 1. Fetch from local cache fallbacks
    const cachedDarta = localStorage.getItem("lgoms_dartas")
    const dartaList = cachedDarta ? JSON.parse(cachedDarta) : []
    
    const cachedChalani = localStorage.getItem("lgoms_chalanis")
    const chalaniList = cachedChalani ? JSON.parse(cachedChalani) : []

    const dTodayLocal = dartaList.filter((d: any) => isToday(d.registrationDate) || isToday(d.date)).length
    const cTodayLocal = chalaniList.filter((c: any) => isToday(c.dispatchDate) || isToday(c.date)).length

    setCounts(prev => ({
      ...prev,
      dartas: dartaList.length,
      dartasToday: dTodayLocal,
      chalanis: chalaniList.length,
      chalanisToday: cTodayLocal
    }))

    // 2. Fetch live data from backend APIs
    fetchApi('/Darta')
      .then(data => {
        if (Array.isArray(data)) {
          const dToday = data.filter((d: any) => isToday(d.registrationDate)).length
          setCounts(prev => ({ ...prev, dartas: data.length, dartasToday: dToday }))
        }
      })
      .catch(() => {})

    fetchApi('/Chalani')
      .then(data => {
        if (Array.isArray(data)) {
          const cToday = data.filter((c: any) => isToday(c.dispatchDate)).length
          setCounts(prev => ({ ...prev, chalanis: data.length, chalanisToday: cToday }))
        }
      })
      .catch(() => {})

    fetchApi('/Tippani')
      .then(data => {
        if (Array.isArray(data)) {
          const pending = data.filter((t: any) => t.status === "Pending" || t.status === "Draft" || t.status === "विचाराधीन").length
          setCounts(prev => ({ ...prev, tippanis: data.length, tippanisPending: pending }))
        }
      })
      .catch(() => {})

    fetchApi('/Sifaris')
      .then(data => {
        if (Array.isArray(data)) {
          const issued = data.filter((s: any) => s.status === "Issued" || s.status === "Approved" || s.status === "जारी गरियो").length
          setCounts(prev => ({ ...prev, sifaris: data.length, sifarisIssued: issued }))
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">कार्यसम्पादन विवरण (Performance Overview)</h1>
          <p className="text-muted-foreground mt-1">नेपाल सरकारको मापदण्ड अनुसारको ड्यासबोर्ड र समग्र स्थिति विवरण</p>
        </div>
      </div>

      <div className="flex flex-col space-y-6 w-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* 1. Letter (पत्र लेखन) */}
            <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold">पत्र लेखन (Letter)</CardTitle>
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{toNepaliNumber(counts.letters)}</div>
                <p className="text-xs font-medium mt-1 text-orange-600">{toNepaliNumber(counts.lettersDraft)} मस्यौदा (Drafts)</p>
              </CardContent>
            </Card>
            
            {/* 2. Application (निवेदन) */}
            <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold">निवेदन (Application)</CardTitle>
                <div className="bg-red-100 p-2 rounded-full">
                  <FileSignature className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{toNepaliNumber(counts.applications)}</div>
                <p className="text-xs font-medium mt-1 text-green-600">{toNepaliNumber(counts.applicationsApproved)} स्वीकृत (Approved)</p>
              </CardContent>
            </Card>

            {/* 3. Registration (दर्ता) */}
            <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-purple-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold">दर्ता (Registration)</CardTitle>
                <div className="bg-purple-100 p-2 rounded-full">
                  <FolderOpen className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{toNepaliNumber(counts.dartas)}</div>
                <p className="text-xs font-medium mt-1 text-blue-600">आजको दर्ता: +{toNepaliNumber(counts.dartasToday)}</p>
              </CardContent>
            </Card>

            {/* 4. Dispatch (चलानी) */}
            <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold">चलानी (Dispatch)</CardTitle>
                <div className="bg-orange-100 p-2 rounded-full">
                  <Send className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{toNepaliNumber(counts.chalanis)}</div>
                <p className="text-xs font-medium mt-1 text-blue-600">आजको चलानी: +{toNepaliNumber(counts.chalanisToday)}</p>
              </CardContent>
            </Card>

            {/* 5. e-Comment (टिप्पणी) */}
            <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-green-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold">टिप्पणी (e-Comment)</CardTitle>
                <div className="bg-green-100 p-2 rounded-full">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{toNepaliNumber(counts.tippanis)}</div>
                <p className="text-xs font-medium mt-1 text-orange-600">{toNepaliNumber(counts.tippanisPending)} विचाराधीन (Pending)</p>
              </CardContent>
            </Card>

            {/* 6. e-Recommendation (सिफारिस) */}
            <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-amber-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold">सिफारिस (e-Sifaris)</CardTitle>
                <div className="bg-amber-100 p-2 rounded-full">
                  <FileSignature className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{toNepaliNumber(counts.sifaris)}</div>
                <p className="text-xs font-medium mt-1 text-green-600">{toNepaliNumber(counts.sifarisIssued)} जारी गरियो (Issued)</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <CardTitle className="text-lg">दर्ता / चलानी विवरण (Darta/Chalani Chart)</CardTitle>
                <CardDescription>मासिक रुपमा दर्ता र चलानी भएका पत्रहरूको विवरण (नेपाली क्यालेन्डर अनुसार)</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] pl-2 pt-6">
                <OverviewChart />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-orange-200 shadow-sm">
              <CardHeader className="bg-orange-50/50 border-b border-orange-100 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-orange-800">AI सुझाव र अलर्टहरू</CardTitle>
                    <CardDescription className="text-orange-600/80">प्रणालीले दिएका महत्वपूर्ण सूचनाहरू</CardDescription>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-orange-600 animate-pulse" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-lg border border-orange-100 p-3 bg-white hover:bg-orange-50/30 transition-colors shadow-sm">
                    <div className="mt-1 h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-800">असामान्य ढिलाइ (Delay Alert)</p>
                      <p className="text-sm text-slate-600">फाइल #२०८२-०१-४५ प्रशासन शाखामा ३ दिनदेखि विचाराधीन छ।</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 rounded-lg border border-blue-100 p-3 bg-white hover:bg-blue-50/30 transition-colors shadow-sm">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-800">कार्यप्रवाह सुझाव (Workflow)</p>
                      <p className="text-sm text-slate-600">५ वटा &apos;बिदा निवेदन&apos; हरू स्वीकृतिको लागि बाँकी छन्।</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <CardTitle className="text-lg">पछिल्लो गतिविधिहरू (Recent Activities)</CardTitle>
                <CardDescription>कार्यालयका विभिन्न शाखाहरूमा भएका पछिल्ला कामहरूको टाइमलाइन</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ActivityTimeline />
              </CardContent>
            </Card>
          </div>
      </div>
    </div>
  )
}
