"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Printer, Save, FileText } from "lucide-react"
import { NepaliDatePickerComponent } from "@/components/ui/nepali-date-picker"
import NepaliDate from "nepali-datetime"

export default function PatraLekhanPage() {
  const [formData, setFormData] = useState({
    patraSankhya: "२०८१/०८२",
    chalaniNo: "",
    miti: "",
    receiverName: "",
    receiverAddress: "",
    subject: "",
    bodyText: "",
    senderName: "",
    senderDesignation: "प्रमुख प्रशासकीय अधिकृत"
  })

  useEffect(() => {
    const today = new NepaliDate()
    setFormData(prev => ({ ...prev, miti: today.format('YYYY-MM-DD') }))
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Patra Lekhan (पत्र लेखन)</h1>
          <p className="text-muted-foreground mt-1">Create official government letters with standard letterhead.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
          <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Printer className="w-4 h-4 mr-2" /> Print Letter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        
        {/* Editor Form - Hidden when printing */}
        <div className="lg:col-span-4 space-y-6 print:hidden h-[calc(100vh-180px)] overflow-y-auto pr-2">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" /> Letter Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>पत्र संख्या</Label>
                  <Input value={formData.patraSankhya} onChange={e => handleInputChange('patraSankhya', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>चलानी नं.</Label>
                  <Input value={formData.chalaniNo} onChange={e => handleInputChange('chalaniNo', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>मिति</Label>
                <NepaliDatePickerComponent value={formData.miti} onChange={val => handleInputChange('miti', val)} />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>प्राप्तकर्ता (श्री ...)</Label>
                <Input value={formData.receiverName} onChange={e => handleInputChange('receiverName', e.target.value)} placeholder="जस्तै: श्रीमान् प्रमुख जिल्ला अधिकारी ज्यू" />
              </div>
              <div className="space-y-2">
                <Label>ठेगाना</Label>
                <Input value={formData.receiverAddress} onChange={e => handleInputChange('receiverAddress', e.target.value)} placeholder="जस्तै: जिल्ला प्रशासन कार्यालय, सिन्धुपाल्चोक" />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>विषय</Label>
                <Input value={formData.subject} onChange={e => handleInputChange('subject', e.target.value)} placeholder="पत्रको विषय लेख्नुहोस्" />
              </div>

              <div className="space-y-2">
                <Label>पत्रको व्यहोरा (Body)</Label>
                <textarea 
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.bodyText} 
                  onChange={e => handleInputChange('bodyText', e.target.value)}
                  placeholder="महोदय, उपरोक्त सम्बन्धमा..."
                />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>हस्ताक्षरकर्ताको नाम</Label>
                <Input value={formData.senderName} onChange={e => handleInputChange('senderName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>पद</Label>
                <Input value={formData.senderDesignation} onChange={e => handleInputChange('senderDesignation', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* A4 Preview container */}
        <div className="lg:col-span-8 flex justify-center bg-gray-100 p-8 rounded-lg overflow-x-auto print:p-0 print:bg-white print:block">
          
          <div className="bg-white w-[21cm] min-h-[29.7cm] shadow-lg print:shadow-none p-10 relative mx-auto text-black">
            
            {/* Header: Exact Letterhead from Screenshot */}
            <div className="flex justify-between items-start text-red-600 relative z-10">
              {/* Left Logo */}
              <div className="w-[120px] h-[120px]">
                <img src="/logos/nepal-logo.png" alt="Nepal Gov Logo" className="w-full h-full object-contain" />
              </div>

              {/* Center Text */}
              <div className="text-center flex-1 mt-1">
                <p className="text-[15px] font-semibold">स्थानीय सरकार</p>
                <h1 className="text-3xl font-extrabold mt-1">पाँचपोखरी थाङ्पाल गाउँपालिका</h1>
                <h2 className="text-[14px] font-bold mt-1 tracking-wider uppercase">Panchpokhari Thangpal Rural Municipality</h2>
                <h3 className="text-2xl font-bold mt-2">गाउँकार्यपालिकाको कार्यालय</h3>
                <p className="text-[15px] mt-1">थाङ्पालधाप, सिन्धुपाल्चोक</p>
              </div>

              {/* Right Logo */}
              <div className="w-[120px] h-[120px]">
                <img src="/logos/mun-logo.png" alt="Municipality Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            
            {/* Established / Province info on the right */}
            <div className="text-right text-red-600 text-[15px] font-semibold -mt-5 mb-2 mr-2">
              <p>बागमती प्रदेश, नेपाल</p>
              <p className="mr-8">२०७३</p>
            </div>

            {/* Black Line */}
            <div className="border-b-[3px] border-black mb-3"></div>

            {/* Letter Meta & Date */}
            <div className="flex justify-between font-bold text-[15px] mb-8">
              <div>
                <p>पत्र संख्या : {formData.patraSankhya}</p>
                <p>चलानी : {formData.chalaniNo}</p>
              </div>
              <div className="text-right">
                <p className="underline underline-offset-4">मिति: {formData.miti}</p>
                <p className="underline underline-offset-4 mt-1">नेपाल संवत ११४५</p>
              </div>
            </div>

            {/* Receiver */}
            <div className="mb-8 font-bold text-lg">
              <p>{formData.receiverName || "श्री ........................................................"}</p>
              <p>{formData.receiverAddress || "........................................................"}</p>
            </div>

            {/* Subject */}
            <div className="text-center font-bold mb-8 text-lg">
              <p>विषय: <u>{formData.subject || "........................................................"}</u></p>
            </div>

            {/* Body */}
            <div className="text-justify leading-[2] text-[17px] whitespace-pre-wrap min-h-[250px] font-medium">
              {formData.bodyText || "महोदय,\nउपरोक्त सम्बन्धमा..."}
            </div>

            {/* Signatory */}
            <div className="mt-20 flex justify-end">
              <div className="text-center">
                <p className="mb-12">................................</p>
                <p className="font-bold text-lg">{formData.senderName || "(नाम)"}</p>
                <p className="text-[15px]">{formData.senderDesignation || "(पद)"}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-10 right-10 flex justify-between items-end">
              <div className="flex-1 text-center text-red-600">
                <p className="text-lg font-bold mb-1">"शिक्षा, स्वास्थ्य, कृषि र पर्यटन: समृद्ध पाँचपोखरीको मूलधन"</p>
                <p className="text-[11px] font-medium">Website: <a href="#" className="text-blue-600 underline">http://panchpokharithangpalmun.gov.np/</a> | Email: <span className="text-blue-600 underline">ito.panchpokharithangpalmun@gmail.com</span></p>
              </div>
              <div className="w-[60px] h-[60px] ml-4 bg-gray-200">
                 {/* QR Code Placeholder matching the screenshot */}
                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Panchpokhari+Thangpal" alt="QR" className="w-full h-full object-cover" />
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
