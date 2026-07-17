"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Printer, Save, FileSignature, Sparkles } from "lucide-react"
import { NepaliDatePickerComponent } from "@/components/ui/nepali-date-picker"

export default function NivedanLekhanPage() {
  const [formData, setFormData] = useState({
    miti: "",
    receiverTitle: "श्रीमान् वडा अध्यक्ष ज्यू",
    receiverOffice: "वडा नं. १ कार्यालय",
    receiverAddress: "पाँचपोखरी थाङ्पाल गाउँपालिका, सिन्धुपाल्चोक",
    subject: "सिफारिस पाऊँ भन्ने बारे।",
    bodyText: "महोदय,\nउपरोक्त सम्बन्धमा म यसै गाउँपालिकाको स्थायी निवासी भएकोले मलाई निम्न कार्यको लागि सिफारिसको आवश्यकता परेको हुँदा आवश्यक सिफारिस उपलब्ध गराईदिनुहुन यो निवेदन पेश गरेको छु।",
    applicantName: "",
    applicantAddress: "",
    applicantPhone: ""
  })

  useEffect(() => {
    setFormData(prev => ({ ...prev, miti: new Date().toLocaleDateString('ne-NP') }))
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col gap-6 w-full p-2 md:p-4 h-full">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">AI Nivedan Lekhan (निवेदन लेखन)</h1>
          <p className="text-muted-foreground mt-1">सर्वसाधारणका लागि AI मा आधारित निवेदन लेखन प्रणाली।</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
          <Button onClick={handlePrint} className="bg-red-500 hover:bg-red-600 text-white"><Printer className="w-4 h-4 mr-2" /> Print Nivedan</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        
        {/* Editor Form - Hidden when printing */}
        <div className="lg:col-span-4 space-y-6 print:hidden h-[calc(100vh-180px)] overflow-y-auto pr-2 pb-10">
          
          {/* AI Assistant Section */}
          <Card className="shadow-sm bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-indigo-800 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> GovAI Assistant
              </CardTitle>
              <CardDescription>AI लाई निर्देशन दिएर निवेदन तयार गर्नुहोस्</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="जस्तै: बिजुलीको पोल सार्नको लागि वडा अध्यक्षलाई निवेदन लेखिदिनुहोस्..." 
                className="mb-4 text-sm min-h-[100px]" 
              />
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                <Sparkles className="w-4 h-4 mr-2" /> Generate Nivedan
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200 border-t-4 border-t-red-500">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-red-500" /> Nivedan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>मिति</Label>
                <NepaliDatePickerComponent value={formData.miti} onChange={val => handleInputChange('miti', val)} />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>सम्बोधन (कसलाई)</Label>
                <Input value={formData.receiverTitle} onChange={e => handleInputChange('receiverTitle', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>कार्यालय</Label>
                <Input value={formData.receiverOffice} onChange={e => handleInputChange('receiverOffice', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ठेगाना</Label>
                <Input value={formData.receiverAddress} onChange={e => handleInputChange('receiverAddress', e.target.value)} />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>विषय</Label>
                <Input value={formData.subject} onChange={e => handleInputChange('subject', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>निवेदनको व्यहोरा (Body)</Label>
                <textarea 
                  className="flex min-h-[250px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.bodyText} 
                  onChange={e => handleInputChange('bodyText', e.target.value)}
                />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>निवेदकको नाम</Label>
                <Input value={formData.applicantName} onChange={e => handleInputChange('applicantName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>निवेदकको ठेगाना</Label>
                <Input value={formData.applicantAddress} onChange={e => handleInputChange('applicantAddress', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>सम्पर्क नं.</Label>
                <Input value={formData.applicantPhone} onChange={e => handleInputChange('applicantPhone', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* A4 Preview container */}
        <div className="lg:col-span-8 flex justify-center bg-gray-100 p-8 rounded-lg overflow-x-auto print:p-0 print:bg-white print:block">
          
          <div className="bg-white w-[21cm] min-h-[29.7cm] shadow-lg print:shadow-none p-16 relative mx-auto text-black">
            
            {/* Simple Letter Meta & Date */}
            <div className="flex justify-end font-bold text-[15px] mb-12">
              <div className="text-right">
                <p>मिति: {formData.miti}</p>
              </div>
            </div>

            {/* Receiver */}
            <div className="mb-8 font-bold text-lg">
              <p>{formData.receiverTitle || "श्री ........................................................"}</p>
              <p>{formData.receiverOffice || "........................................................"}</p>
              <p>{formData.receiverAddress || "........................................................"}</p>
            </div>

            {/* Subject */}
            <div className="text-center font-bold mb-10 text-lg">
              <p>विषय: <u>{formData.subject || "........................................................"}</u></p>
            </div>

            {/* Body */}
            <div className="text-justify leading-[2] text-[17px] whitespace-pre-wrap min-h-[250px] font-medium">
              {formData.bodyText}
            </div>

            {/* Applicant */}
            <div className="mt-20 flex justify-end">
              <div className="text-right">
                <p className="mb-12 font-bold text-lg">निवेदक</p>
                <p className="text-[17px]">दस्तखत: ................................</p>
                <p className="mt-2 text-[17px]">नाम: <strong>{formData.applicantName || "................................"}</strong></p>
                <p className="mt-1 text-[17px]">ठेगाना: {formData.applicantAddress || "................................"}</p>
                <p className="mt-1 text-[17px]">सम्पर्क नं: {formData.applicantPhone || "................................"}</p>
              </div>
            </div>
            
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { 
            size: A4 portrait; 
            margin: 0; 
          }
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            background: white;
          }
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
          }
        }
      `}} />
    </div>
  )
}
