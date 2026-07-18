"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Send } from "lucide-react"

export default function ApplySifarisPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [placeholders, setPlaceholders] = useState<string[]>([])

  useEffect(() => {
    // Mock templates since backend DB might not be seeded
    setTemplates([
      { 
        id: "1", 
        title: "नागरिकता सिफारिस (Citizenship Recommendation)", 
        htmlContent: "श्रीमान वडा अध्यक्ष ज्यू,\nवडा नं. {{WardNo}}, {{Municipality}}।\n\nविषय: नागरिकता सिफारिस सम्बन्धमा।\n\nमहोदय,\nउपरोक्त सम्बन्धमा मेरो नाम {{ApplicantName}} र मेरो बुवाको नाम {{FatherName}} हो। मलाई नागरिकता प्रमाणपत्रको आवश्यकता परेकोले सिफारिस गरिदिनुहुन अनुरोध गर्दछु।\n\nनिवेदक,\n{{ApplicantName}}"
      },
      { 
        id: "2", 
        title: "जन्म दर्ता सिफारिस (Birth Registration)", 
        htmlContent: "जन्म दर्ता प्रमाणपत्र\nनाम: {{ChildName}}\nजन्म मिति: {{BirthDate}}\nबाबुको नाम: {{FatherName}}\nआमाको नाम: {{MotherName}}"
      }
    ])
  }, [])

  const handleTemplateSelect = (id: string | null) => {
    if (!id) return;
    const template = templates.find(t => t.id === id)
    setSelectedTemplate(template)
    
    if (template) {
      // Extract placeholders like {{ApplicantName}}
      const regex = /{{(.*?)}}/g
      const matches = [...template.htmlContent.matchAll(regex)]
      const uniquePlaceholders = Array.from(new Set(matches.map(m => m[1])))
      setPlaceholders(uniquePlaceholders)
      setFormData({})
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    alert("Application submitted successfully for workflow approval!")
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Apply for e-Recommendation</h1>
        <p className="text-muted-foreground mt-1">Select a template to auto-generate the application form.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Sifaris Type</CardTitle>
          <CardDescription>Choose the type of recommendation you need.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleTemplateSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Select Template --" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTemplate && (
        <Card className="border-blue-200 shadow-sm">
          <CardHeader className="bg-blue-50/50 border-b">
            <CardTitle className="text-blue-800">Application Form</CardTitle>
            <CardDescription>Fill out the required dynamic fields.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {placeholders.map(key => (
                <div key={key} className="grid gap-2">
                  <Label htmlFor={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                  <Input 
                    id={key}
                    value={formData[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder={`Enter ${key}`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Button variant="outline"><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Send className="w-4 h-4 mr-2" /> Submit Application
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
