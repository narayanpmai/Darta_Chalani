"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Printer, Download, CheckCircle, FileSignature, Cpu, Loader2, AlertTriangle, FileCheck, CheckCircle2 } from "lucide-react"
import { NepaliDatePickerComponent } from "@/components/ui/nepali-date-picker"
import { aiAgentService } from "@/services/aiAgentService"

export default function SifarisPage() {
  const [aiStatus, setAiStatus] = useState<"idle" | "verifying" | "missing_doc" | "drafting" | "done">("idle")
  const [formData, setFormData] = useState({
    applicantName: "",
    dob: "",
    fatherName: "",
    motherName: "",
    ward: ""
  })

  const runRecommendationAgent = async () => {
    setAiStatus("verifying")
    try {
      // Only providing Birth Certificate and ID Card (intentionally missing Father's Citizenship)
      const response = await aiAgentService.draftSifaris("Citizenship Recommendation", "Ram Bahadur Thapa", "Birth Certificate, ID Card");
      
      const cleanJson = response.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (parsed.Status === "Missing Documents") {
        setAiStatus("missing_doc");
      } else {
        setAiStatus("done");
      }
    } catch (e) {
      console.error("AI Sifaris Error:", e);
      setAiStatus("missing_doc") // Fallback
    }
  }

  const resolveMissingDoc = async () => {
    setAiStatus("drafting")
    try {
      // Now providing Father's Citizenship
      await aiAgentService.draftSifaris("Citizenship Recommendation", "Ram Bahadur Thapa", "Birth Certificate, ID Card, Father's Citizenship");
      
      setAiStatus("done")
      setFormData({
        applicantName: "राम बहादुर थापा",
        dob: "२०५५-०२-१५",
        fatherName: "हरि बहादुर थापा",
        motherName: "सीता देवी थापा",
        ward: "१५"
      })
    } catch (e) {
      console.error(e);
      setAiStatus("done") // Fallback
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">e-Recommendation (ई-सिफारिस)</h1>
          <p className="text-muted-foreground mt-1">Generate and manage official recommendations and certificates.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2"><Search className="h-4 w-4" /> Search Citizen</Button>
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700"><CheckCircle className="h-4 w-4" /> Issue Certificate</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Templates Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-lg">Templates</h3>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" className="justify-start w-full text-left font-normal bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
              <FileSignature className="mr-2 h-4 w-4" /> Citizenship Recommendation
            </Button>
            <Button variant="ghost" className="justify-start w-full text-left font-normal hover:bg-muted">
              <FileSignature className="mr-2 h-4 w-4" /> Relationship Certificate
            </Button>
            <Button variant="ghost" className="justify-start w-full text-left font-normal hover:bg-muted">
              <FileSignature className="mr-2 h-4 w-4" /> Marriage Registration
            </Button>
            <Button variant="ghost" className="justify-start w-full text-left font-normal hover:bg-muted">
              <FileSignature className="mr-2 h-4 w-4" /> Income Verification
            </Button>
            <Button variant="ghost" className="justify-start w-full text-left font-normal hover:bg-muted">
              <FileSignature className="mr-2 h-4 w-4" /> Address Verification
            </Button>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="lg:col-span-3">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Citizenship Recommendation Form</CardTitle>
                <CardDescription>Fill in the applicant details below.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={aiStatus !== "done"}><Printer className="h-4 w-4 mr-2" /> Print Preview</Button>
                <Button variant="outline" size="sm" disabled={aiStatus !== "done"}><Download className="h-4 w-4 mr-2" /> Download PDF</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Recommendation Agent Mockup Panel */}
              <Card className="border-emerald-500/30 bg-emerald-50/30 shadow-sm mb-6">
                <CardHeader className="bg-emerald-100/50 border-b pb-3 pt-4">
                  <CardTitle className="text-md flex items-center gap-2 text-emerald-700">
                    <Cpu className="w-5 h-5" /> Recommendation Agent
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  
                  {aiStatus === "idle" && (
                    <div className="text-sm text-slate-600">
                      AI Agent ले अपलोड गरिएका कागजातहरू प्रमाणीकरण गरी सिफारिसको ड्राफ्ट तयार गर्नेछ।
                    </div>
                  )}

                  {aiStatus === "verifying" && (
                    <div className="flex items-center gap-3 text-blue-600 bg-blue-50 p-3 rounded-md">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">नागरिकता र जन्म दर्ता कागजातहरू प्रमाणीकरण गर्दै...</span>
                    </div>
                  )}

                  {aiStatus === "missing_doc" && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-red-700 bg-red-50 p-3 rounded-md border border-red-200">
                        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold">अपूर्ण कागजात फेला पर्यो (Missing Document)</p>
                          <p className="text-xs text-red-600/80 mt-1">नागरिकता सिफारिसको लागि 'बुवाको नागरिकताको प्रतिलिपि' अपलोड गरिएको छैन।</p>
                        </div>
                      </div>
                      <Button onClick={resolveMissingDoc} size="sm" variant="outline" className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                        <FileCheck className="w-4 h-4 mr-2" /> कागजात प्राप्त भयो (Bypass & Draft)
                      </Button>
                    </div>
                  )}

                  {aiStatus === "drafting" && (
                    <div className="flex items-center gap-3 text-orange-600 bg-orange-50 p-3 rounded-md">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">फारम भर्दै र सिफारिस PDF मस्यौदा तयार गर्दै...</span>
                    </div>
                  )}

                  {aiStatus === "done" && (
                    <div className="flex items-start gap-3 text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">सिफारिस मस्यौदा तयार भयो!</p>
                        <p className="text-xs text-green-600/80 mt-1">सबै विवरणहरू अटो-फिल गरिएको छ। तपाईं 'Print Preview' हेरेर 'Issue Certificate' गर्न सक्नुहुन्छ।</p>
                      </div>
                    </div>
                  )}

                  {aiStatus === "idle" && (
                    <Button onClick={runRecommendationAgent} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      <FileCheck className="w-4 h-4 mr-2" /> Scan Documents & Prepare Sifaris (AI)
                    </Button>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Applicant Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicantName">Full Name (पूरा नाम)</Label>
                    <Input id="applicantName" value={formData.applicantName} onChange={e => setFormData({...formData, applicantName: e.target.value})} placeholder="e.g. Ram Bahadur Thapa" className={aiStatus === "done" ? "border-green-500 bg-green-50/50" : ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth (जन्म मिति)</Label>
                    <NepaliDatePickerComponent value={formData.dob} onChange={v => setFormData({...formData, dob: v})} id="dob" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name (बुवाको नाम)</Label>
                    <Input id="fatherName" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} placeholder="Enter father's name" className={aiStatus === "done" ? "border-green-500 bg-green-50/50" : ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name (आमाको नाम)</Label>
                    <Input id="motherName" value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} placeholder="Enter mother's name" className={aiStatus === "done" ? "border-green-500 bg-green-50/50" : ""} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Address Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district">District (जिल्ला)</Label>
                    <Input id="district" defaultValue="Kathmandu" readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="municipality">Municipality (नगरपालिका)</Label>
                    <Input id="municipality" defaultValue="Kathmandu Metropolitan" readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ward">Ward No. (वडा नं.)</Label>
                    <Input id="ward" value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})} placeholder="e.g. 15" className={aiStatus === "done" ? "border-green-500 bg-green-50/50" : ""} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Additional Remarks (कैफियत)</Label>
                <Textarea id="remarks" placeholder="Any special notes regarding this recommendation..." className="min-h-[100px]" />
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
