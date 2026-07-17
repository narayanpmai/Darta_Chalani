"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Settings, Trash2 } from "lucide-react"
import { Link } from "@/i18n/routing"

export default function SifarisTemplatesPage() {
  const t = useTranslations("Sidebar") // Reusing some common translations for now
  const [templates, setTemplates] = useState<any[]>([])

  useEffect(() => {
    // In a real app, fetch from backend
    // fetch('/api/SifarisTemplate').then(res => res.json()).then(setTemplates)
    // For now we use mock data to demonstrate the UI
    setTemplates([
      { id: "1", title: "नागरिकता सिफारिस", category: "Citizenship", isActive: true },
      { id: "2", title: "जन्म दर्ता सिफारिस", category: "Citizenship", isActive: true },
      { id: "3", title: "व्यवसाय दर्ता सिफारिस", category: "Business", isActive: true },
    ])
  }, [])

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">e-Recommendation Templates</h1>
          <p className="text-muted-foreground mt-1">Manage standard government recommendation formats (ई-सिफारिस ढाँचा)</p>
        </div>
        <Link href="/sifaris/templates/new">
          <Button className="bg-[#427DF3] hover:bg-blue-600 text-white shadow-sm gap-2">
            <Plus className="w-4 h-4" />
            Create New Template
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map(template => (
          <Card key={template.id} className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-4 text-lg">{template.title}</CardTitle>
              <CardDescription>{template.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <span className={`flex h-2 w-2 rounded-full ${template.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-muted-foreground">{template.isActive ? 'Active' : 'Draft'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
