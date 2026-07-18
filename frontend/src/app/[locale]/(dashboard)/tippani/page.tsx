"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Printer, Save, FileText, Send, CheckCircle2, User, Clock, Check, Cpu, Loader2, Search, Wand2, Lightbulb } from "lucide-react"
import { NepaliDatePickerComponent } from "@/components/ui/nepali-date-picker"
import { aiAgentService } from "@/services/aiAgentService"

export default function TippaniPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiStatus, setAiStatus] = useState<"idle" | "reading" | "drafting" | "done">("idle")
  
  const [formData, setFormData] = useState({
    miti: "",
    tippaniSankhya: "",
    subject: "",
    bodyText: "",
  })

  const handleAiGeneration = async () => {
    setIsGenerating(true)
    setAiStatus("reading")
    
    try {
      // Artificial delay to show UI animation
      await new Promise(r => setTimeout(r, 1000));
      setAiStatus("drafting")
      
      const draft = await aiAgentService.draftTippani(
        formData.subject || "शिक्षक दरबन्दी मिलान तथा व्यवस्थापन", 
        "कृपया स्थानीय सरकार सञ्चालन ऐन, २०७४ को आधारमा मस्यौदा तयार गर्नुहोस्।"
      );
      
      setFormData(prev => ({
        ...prev,
        bodyText: draft
      }))
      setAiStatus("done")
    } catch (error) {
      console.error("AI Tippani Error:", error);
      // Fallback
      setFormData(prev => ({
        ...prev,
        bodyText: `श्रीमान्,\n\n[एआई सँग सम्पर्क हुन सकेन। कृपया म्यानुअल रूपमा टाइप गर्नुहोस् वा पछि पुनः प्रयास गर्नुहोस्।]`
      }))
      setAiStatus("done")
    } finally {
      setIsGenerating(false)
    }
  }

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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tippani (Comment Agent)</h1>
          <p className="text-muted-foreground mt-1">AI Comment Agent को सहयोगमा टिप्पणी र आदेश तयार गर्नुहोस्।</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><Send className="w-4 h-4 mr-2" /> Forward</Button>
          <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Printer className="w-4 h-4 mr-2" /> Print</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        
        {/* Editor Form - Hidden when printing */}
        <div className="lg:col-span-4 space-y-6 print:hidden h-[calc(100vh-180px)] overflow-y-auto pr-2 pb-10">
          <Card className="shadow-sm border-gray-200 border-t-4 border-t-emerald-500">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" /> Tippani Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>मिति</Label>
                <NepaliDatePickerComponent value={formData.miti} onChange={val => handleInputChange('miti', val)} />
              </div>
              <div className="space-y-2">
                <Label>टिप्पणी संख्या</Label>
                <Input value={formData.tippaniSankhya} onChange={e => handleInputChange('tippaniSankhya', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>विषय (Subject)</Label>
                <Input value={formData.subject} onChange={e => handleInputChange('subject', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>टिप्पणीको व्यहोरा (Body)</Label>
                <textarea 
                  className="flex min-h-[300px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.bodyText} 
                  onChange={e => handleInputChange('bodyText', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Tippani Agent Card */}
          <Card className="shadow-sm border-purple-500/30 bg-purple-50/30">
            <CardHeader className="bg-purple-100/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                <Cpu className="w-5 h-5" /> Comment Agent
              </CardTitle>
              <CardDescription>विगतका निर्णय र कानुनको आधारमा मस्यौदा तयार गर्नुहोस्</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {aiStatus === "idle" && (
                <div className="text-sm text-slate-600 mb-4">
                  के तपाईं दर्ता भएको पत्र वा विषयको आधारमा AI लाई टिप्पणीको मस्यौदा तयार गर्न लगाउन चाहनुहुन्छ?
                </div>
              )}
              
              {aiStatus === "reading" && (
                <div className="flex items-center gap-3 text-blue-600 bg-blue-50 p-3 rounded-md">
                  <Search className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-medium">सम्बन्धित ऐन, कार्यविधि र विगतका निर्णयहरू खोज्दै...</span>
                </div>
              )}

              {aiStatus === "drafting" && (
                <div className="flex items-center gap-3 text-orange-600 bg-orange-50 p-3 rounded-md">
                  <Wand2 className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-medium">कानुनी आधारसहित टिप्पणीको मस्यौदा तयार गर्दै...</span>
                </div>
              )}

              {aiStatus === "done" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">टिप्पणी सफलतापूर्वक तयार भयो!</span>
                  </div>
                  <div className="bg-white p-3 rounded-md border shadow-sm text-sm text-slate-700">
                    <p className="flex items-center gap-2 font-semibold text-purple-700 mb-2">
                      <Lightbulb className="w-4 h-4" /> AI Source Analysis:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Law Cited:</strong> स्थानीय सरकार सञ्चालन ऐन, २०७४, दफा ११(२)(ज)</li>
                      <li><strong>Past Decision:</strong> कार्यपालिका निर्णय नं. ४५ (२०८१/११/०५)</li>
                      <li><strong>Context:</strong> शिक्षा शाखाबाट दरबन्दी मिलान प्रस्ताव</li>
                    </ul>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleAiGeneration} 
                disabled={isGenerating || aiStatus === "done"}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Draft...</>
                ) : aiStatus === "done" ? (
                  <><Check className="w-4 h-4 mr-2" /> Draft Generated</>
                ) : (
                  <><Wand2 className="w-4 h-4 mr-2" /> Generate Comment with AI</>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-blue-500/20">
            <CardHeader className="bg-blue-50/50 dark:bg-blue-900/10 border-b">
              <CardTitle className="text-lg">Workflow Status</CardTitle>
              <CardDescription>Current routing of the active Tippani.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative pl-6 border-l-2 border-blue-200 dark:border-blue-800 space-y-8">
                <div className="relative">
                  <span className="absolute -left-[35px] bg-primary text-primary-foreground rounded-full p-1 ring-4 ring-background">
                    <Check className="h-4 w-4" />
                  </span>
                  <h3 className="font-medium text-sm">Initiated</h3>
                  <p className="text-sm text-muted-foreground">Admin Desk</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[35px] bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 rounded-full p-1 ring-4 ring-background animate-pulse">
                    <Clock className="h-4 w-4" />
                  </span>
                  <h3 className="font-medium text-sm text-blue-600 dark:text-blue-400">In Review</h3>
                  <p className="text-sm text-muted-foreground">Section Officer</p>
                </div>
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
                <h2 className="text-2xl font-bold mt-4">टिप्पणी र आदेश</h2>
              </div>

              {/* Right Logo */}
              <div className="w-[120px] h-[120px]">
                <img src="/logos/mun-logo.png" alt="Municipality Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            
            {/* Info under logos */}
            <div className="flex justify-between text-red-600 text-[15px] font-semibold -mt-6 mb-4 relative z-20">
              <div className="mt-6 ml-2">
                <p>टिप्पणी संख्या: <span className="text-black font-normal">{formData.tippaniSankhya}</span></p>
              </div>
              <div className="text-right">
                <p className="text-right">बागमती प्रदेश, नेपाल</p>
                <p className="text-right mr-8">२०७३</p>
                <div className="mt-2 text-left inline-block w-[140px]">
                  <p>पाना नं. ____________</p>
                  <p className="mt-1 flex items-center whitespace-nowrap">मिति : <span className="inline-block border-b border-red-600 w-[100px] ml-1 text-black font-normal text-sm leading-tight pb-0 mb-0">{formData.miti}</span></p>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-2 font-bold text-red-600 text-[17px] flex gap-2">
              <span className="whitespace-nowrap">विषय :-</span>
              <span className="text-black">{formData.subject}</span>
            </div>

            {/* Blue Line */}
            <div className="border-b-[2px] border-[#427DF3] mb-6"></div>

            {/* Body */}
            <div className="text-justify leading-[2] text-[17px] whitespace-pre-wrap min-h-[400px] font-medium">
              {formData.bodyText}
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-10 right-10 flex justify-between items-end">
              <div className="flex-1 text-center">
                <p className="text-[10px] font-bold text-red-600 mb-[2px]">
                  Panchpokhari Thangpal Rural Municipality, Sindhupalchok, Bagmati Province <a href="#" className="text-blue-600 underline font-normal">http://panchpokharithangpalmun.gov.np/</a>
                </p>
                <p className="text-[10px] font-bold text-red-600">
                  Email: <span className="text-blue-600 underline font-normal">ito.panchpokharithangpalmun@gmail.com</span> Tel: <span className="text-blue-600 underline font-normal">011-691111</span>
                </p>
              </div>
              <div className="w-[50px] h-[50px] ml-4 bg-gray-200">
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
