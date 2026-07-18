"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadCloud, FileText, QrCode, Cpu, CheckCircle, Loader2 } from "lucide-react"
import { NepaliDatePickerComponent } from "@/components/ui/nepali-date-picker"
import { aiAgentService } from "@/services/aiAgentService"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
import NepaliDate from "nepali-datetime"
import { getDefaultDateForFiscalYear } from "@/lib/fiscal-year-utils"

export default function DartaPage() {
  const { user } = useAuth()
  const [activeFy, setActiveFy] = useState("")
  const [dartaNo, setDartaNo] = useState("")
  const [fileStatus, setFileStatus] = useState<"idle" | "scanning" | "done">("idle")
  const [formData, setFormData] = useState({
    sender: "",
    subject: "",
    department: "",
    priority: "",
    receivedLetterDate: "",
    receivedLetterNumber: "",
    remarks: "",
    entryTime: ""
  })
  const [miti, setMiti] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load initial settings and sequences
  useEffect(() => {
    // 1. Fetch Fiscal Year
    const fyStore = localStorage.getItem("lgoms_fiscal_years")
    if (fyStore) {
      const parsed = JSON.parse(fyStore)
      const active = parsed.find((f: any) => f.isActive)
      if (active) {
        setActiveFy(active.name)
        setMiti(getDefaultDateForFiscalYear(active.name))
      }
    } else {
      setActiveFy("२०८२/०८३") // fallback
      setMiti(getDefaultDateForFiscalYear("२०८२/०८३"))
    }
  }, [])

  // 2. Generate Auto Darta Number based on Role and FY
  useEffect(() => {
    if (!activeFy || !user) return

    // Ward users get a separate sequence per ward. Palika users share one sequence.
    // Appending activeFy ensures it restarts per fiscal year
    const safeFy = activeFy.replace(/\//g, "-")
    const seqKey = user.ward ? `lgoms_ward_${user.ward}_darta_seq_${safeFy}` : `lgoms_palika_darta_seq_${safeFy}`
    
    const currentSeq = parseInt(localStorage.getItem(seqKey) || "0", 10) + 1
    const seqPadded = currentSeq.toString().padStart(4, '0') // e.g. 0001
    const prefix = user.ward ? `W${user.ward}` : `P`
    
    // Result: २०८२/०८३-P-D-0001 OR २०८२/०८३-W1-D-0001
    const generated = `${activeFy}-${prefix}-D-${seqPadded}`
    
    setDartaNo(generated)
  }, [activeFy, user])

  const simulateAiExtraction = async () => {
    setFileStatus("scanning")
    try {
      const dummyText = "मिति २०८२/०४/१२ मा शिक्षा विकास तथा समन्वय इकाईबाट प्राप्त पत्र। विषय: शिक्षक दरबन्दी मिलान सम्बन्धमा। यसलाई जरुरी प्राथमिकतामा राखी शिक्षा शाखामा पठाउनुहोला।";
      const response = await aiAgentService.analyzeRegistration(dummyText);
      
      // Clean up response if it contains markdown
      const cleanJson = response.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      setFormData(prev => ({
        ...prev,
        sender: parsed.SenderName || "शिक्षा विकास तथा समन्वय इकाई",
        subject: parsed.Subject || "शिक्षक दरबन्दी मिलान सम्बन्धमा।",
        department: (parsed.SuggestedDepartment?.toLowerCase().includes("education") || parsed.SuggestedDepartment?.includes("शिक्षा")) ? "education" : "admin",
        priority: "urgent"
      }))
      setFileStatus("done")
    } catch (error) {
      console.error("AI Extraction Error:", error);
      // Fallback if AI fails (e.g. invalid JSON or server error)
      setFormData(prev => ({
        ...prev,
        sender: "शिक्षा विकास तथा समन्वय इकाई",
        subject: "शिक्षक दरबन्दी मिलान सम्बन्धमा।",
        department: "education",
        priority: "urgent"
      }))
      setFileStatus("done")
    }
  }

  const handleRegister = async () => {
    if (!formData.sender || !formData.subject) {
      alert("कृपया पठाउनेको नाम र विषय भर्नुहोस्।")
      return
    }
    
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("lgoms_token")
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      
      const payload = {
        dartaNumber: dartaNo,
        registrationDate: new Date().toISOString(),
        miti: miti,
        senderName: formData.sender,
        subject: formData.subject,
        forwardedToDepartment: formData.department,
        priority: formData.priority || "Normal",
        receivedLetterDate: formData.receivedLetterDate,
        receivedLetterNumber: formData.receivedLetterNumber,
        remarks: formData.remarks,
        entryTime: formData.entryTime
      }

      const res = await fetch(`${apiUrl}/Darta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        // Increment sequence in local storage
        const safeFy = activeFy.replace(/\//g, "-")
        const seqKey = user?.ward ? `lgoms_ward_${user.ward}_darta_seq_${safeFy}` : `lgoms_palika_darta_seq_${safeFy}`
        const currentSeq = parseInt(localStorage.getItem(seqKey) || "0", 10)
        localStorage.setItem(seqKey, (currentSeq + 1).toString())
        
        alert("दर्ता सफल भयो!")
        window.location.reload()
      } else {
        alert("दर्ता गर्न असफल भयो।")
      }
    } catch (err) {
      console.error(err)
      alert("सर्भर त्रुटि")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">नयाँ दर्ता (Registration Agent)</h1>
          <p className="text-muted-foreground">AI Registration Agent मार्फत पत्र दर्ता गर्नुहोस्।</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">रद्द गर्नुहोस्</Button>
          <Button onClick={handleRegister} disabled={isSubmitting}>
            {isSubmitting ? "दर्ता गर्दै..." : "दर्ता गर्नुहोस्"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Panel: Registration Form */}
        <div className="md:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>पत्रको विवरण</CardTitle>
              <CardDescription>प्राप्त पत्रको जानकारी प्रविष्ट गर्नुहोस्। (AI ले अटो-फिल गर्नेछ)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="darta-no">दर्ता नं. (स्वतः)</Label>
                  <Input id="darta-no" disabled value={dartaNo} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">मिति</Label>
                  <NepaliDatePickerComponent id="date" value={miti} onChange={(val) => setMiti(val || "")} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sender">पठाउने कार्यालय/व्यक्ति</Label>
                <Input 
                  id="sender" 
                  value={formData.sender}
                  onChange={(e) => setFormData({...formData, sender: e.target.value})}
                  placeholder="पठाउनेको नाम वा कार्यालय प्रविष्ट गर्नुहोस्" 
                  className={fileStatus === "done" ? "border-green-500 bg-green-50/50" : ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="received-date">प्राप्त पत्रको मिति</Label>
                  <NepaliDatePickerComponent 
                    id="received-date" 
                    value={formData.receivedLetterDate} 
                    onChange={(val) => setFormData({...formData, receivedLetterDate: val || ""})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="received-number">प्राप्त पत्र संख्या / च.नं.</Label>
                  <Input 
                    id="received-number" 
                    placeholder="पत्र संख्या" 
                    value={formData.receivedLetterNumber}
                    onChange={(e) => setFormData({...formData, receivedLetterNumber: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">विषय</Label>
                <Input 
                  id="subject" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="पत्रको विषय प्रविष्ट गर्नुहोस्" 
                  className={fileStatus === "done" ? "border-green-500 bg-green-50/50" : ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">सुझाइएको शाखा (AI)</Label>
                  <Select value={formData.department} onValueChange={(v) => setFormData({...formData, department: v || ""})}>
                    <SelectTrigger id="department" className={fileStatus === "done" ? "border-green-500 bg-green-50/50" : ""}>
                      <SelectValue placeholder="शाखा छान्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">प्रशासन</SelectItem>
                      <SelectItem value="planning">योजना</SelectItem>
                      <SelectItem value="finance">आर्थिक</SelectItem>
                      <SelectItem value="education">शिक्षा</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">प्राथमिकता</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v || ""})}>
                    <SelectTrigger id="priority" className={fileStatus === "done" ? "border-orange-500 bg-orange-50/50 text-orange-700 font-medium" : ""}>
                      <SelectValue placeholder="साधारण" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">साधारण</SelectItem>
                      <SelectItem value="urgent">जरुरी</SelectItem>
                      <SelectItem value="very-urgent">अति जरुरी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entry-time">दाखिला समय</Label>
                  <Input 
                    id="entry-time" 
                    type="time"
                    value={formData.entryTime}
                    onChange={(e) => setFormData({...formData, entryTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">कैफियत</Label>
                <Input 
                  id="remarks" 
                  placeholder="केही कैफियत भएमा लेख्नुहोस्" 
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>फाइल अपलोड (AI OCR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                onClick={fileStatus === "idle" ? simulateAiExtraction : undefined}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 transition-colors ${
                  fileStatus === "idle" ? "border-primary/50 bg-primary/5 hover:bg-primary/10 cursor-pointer" : 
                  fileStatus === "scanning" ? "border-blue-500 bg-blue-50" : 
                  "border-green-500 bg-green-50 cursor-default"
                }`}
              >
                {fileStatus === "idle" && (
                  <>
                    <UploadCloud className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-1">पत्रको स्क्यान कपि यहाँ अपलोड गर्नुहोस्</h3>
                    <p className="text-sm text-muted-foreground">Click to Simulate AI OCR Upload</p>
                  </>
                )}
                {fileStatus === "scanning" && (
                  <>
                    <Loader2 className="h-10 w-10 text-blue-500 mb-4 animate-spin" />
                    <h3 className="font-semibold text-lg mb-1 text-blue-700">AI Registration Agent is Scanning...</h3>
                    <p className="text-sm text-blue-600/80">Reading subject, date, sender, and summarizing...</p>
                  </>
                )}
                {fileStatus === "done" && (
                  <>
                    <CheckCircle className="h-10 w-10 text-green-500 mb-4" />
                    <h3 className="font-semibold text-lg mb-1 text-green-700">कागजात सफलतापूर्वक स्क्यान भयो!</h3>
                    <p className="text-sm text-green-600/80">AI ले डाटा अटो-फिल गरेको छ। कृपया जाँच गर्नुहोस्।</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: AI, QR, Preview */}
        <div className="md:col-span-5 space-y-6">
          <Card className="border-primary shadow-sm bg-primary/5">
            <CardHeader className="border-b border-primary/20 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  <CardTitle className="text-primary">Registration Agent</CardTitle>
                </div>
                {fileStatus === "scanning" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                {fileStatus === "done" && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
              <CardDescription>AI Agent Analysis Panel</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="rounded-md bg-background border p-4 shadow-sm">
                <p className="text-sm font-semibold mb-2 flex items-center gap-2 text-primary">
                  <FileText className="h-4 w-4" /> AI Summary (सारांश)
                </p>
                {fileStatus === "idle" && (
                  <p className="text-sm text-muted-foreground italic">
                    AI Summary हेर्नको लागि पत्र अपलोड गर्नुहोस्।
                  </p>
                )}
                {fileStatus === "scanning" && (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-2 bg-muted rounded w-full"></div>
                    <div className="h-2 bg-muted rounded w-5/6"></div>
                    <div className="h-2 bg-muted rounded w-4/6"></div>
                  </div>
                )}
                {fileStatus === "done" && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    यो पत्र शिक्षा विकास तथा समन्वय इकाईबाट प्राप्त भएको हो। यसमा पालिका अन्तर्गतका विद्यालयहरूमा 
                    <strong> शिक्षक दरबन्दी मिलान</strong> गर्ने विषयमा निर्देशन दिइएको छ। पत्रमा ३ दिनभित्र आवश्यक 
                    विवरण पठाउन भनिएको हुँदा यसलाई <span className="text-red-600 font-semibold">'जरुरी'</span> प्राथमिकतामा राखेर <strong>शिक्षा शाखा</strong> मा पठाउन उपयुक्त देखिन्छ।
                  </p>
                )}
              </div>
              <div className="rounded-md bg-background border p-4 shadow-sm">
                <p className="text-sm font-semibold mb-2 flex items-center gap-2 text-primary">
                  <CheckCircle className="h-4 w-4" /> AI OCR Extraction
                </p>
                {fileStatus === "idle" && (
                  <p className="text-sm text-muted-foreground italic">
                    डाटा एक्सट्र्याक्ट गर्न बाँकी...
                  </p>
                )}
                {fileStatus === "scanning" && (
                  <p className="text-sm text-blue-600 animate-pulse">
                    Reading Document Vectors...
                  </p>
                )}
                {fileStatus === "done" && (
                  <ul className="text-sm space-y-2 text-slate-700">
                    <li className="flex justify-between"><span>Date Detected:</span> <strong>2082/04/12</strong></li>
                    <li className="flex justify-between"><span>Sender Found:</span> <strong>शिक्षा विकास...</strong></li>
                    <li className="flex justify-between"><span>Subject Found:</span> <strong>शिक्षक दरबन्दी...</strong></li>
                    <li className="flex justify-between text-green-600"><span>Confidence Score:</span> <strong>98.4%</strong></li>
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" /> दर्ता QR कोड
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <div className="h-40 w-40 bg-muted rounded-md border flex items-center justify-center flex-col gap-2 text-muted-foreground">
                <QrCode className="h-12 w-12 opacity-50" />
                <span className="text-xs">बचत गरेपछि उत्पन्न हुनेछ</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
