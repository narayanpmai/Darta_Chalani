"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, UploadCloud, Plus, List as ListIcon, Users, CheckSquare } from "lucide-react"
import { NepaliDatePickerComponent } from "@/components/ui/nepali-date-picker"
import { useAuth } from "@/lib/auth-context"
import { getDefaultDateForFiscalYear } from "@/lib/fiscal-year-utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import { fetchApi } from "@/lib/api"

export default function ChalaniPage() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<"list" | "form">("list")
  
  // Settings & Context
  const [activeFy, setActiveFy] = useState("")
  const [chalaniNo, setChalaniNo] = useState("")
  const [miti, setMiti] = useState("")

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    letterType: "",
    letterDate: "",
    recipientName: "",
    recipientAddress: "",
    remarks: "",
    recipientEmail: "",
    receivingBranch: "",
    approvalStatus: "स्वीकृत",
    cc: "",
    relatedFile: "",
    alertEmail: false,
    alertSms: false
  })

  // Dummy List Data
  const [chalaniList, setChalaniList] = useState([
    { id: 1, chalaniNo: "२०८२/०८३-P-C-1001", receiver: "जिल्ला प्रशासन कार्यालय", subject: "नागरिकता सिफारिस", method: "Physical", status: "स्वीकृत" },
    { id: 2, chalaniNo: "२०८२/०८३-P-C-1002", receiver: "कृषि मन्त्रालय", subject: "मलखाद माग सम्बन्धमा", method: "Email", status: "प्रक्रियामा" },
    { id: 3, chalaniNo: "२०८२/०८३-P-C-1003", receiver: "वडा नम्बर ५", subject: "बजेट विनियोजन जानकारी", method: "System", status: "स्वीकृत" },
  ])

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
      setActiveFy("२०८२/०८३")
      setMiti(getDefaultDateForFiscalYear("२०८२/०८३"))
    }
  }, [])

  useEffect(() => {
    setChalaniNo("स्वचालित (Auto Generated)")
  }, [activeFy, user, viewMode])

  // Fetch Chalani list from backend API
  useEffect(() => {
    if (viewMode === "list") {
      setIsSubmitting(true);
      fetchApi('/Chalani')
        .then((data) => {
          if (Array.isArray(data)) {
             const formattedList = data.map(item => ({
               id: item.id,
               chalaniNo: item.dispatchNumber,
               receiver: item.receiverName,
               subject: item.subject,
               method: "Physical",
               status: item.status || "स्वीकृत"
             }));
             setChalaniList(formattedList);
          }
        })
        .catch(err => {
          console.error("Failed to fetch chalani list:", err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [viewMode])

  const handleDispatch = async () => {
    if (!formData.recipientName || !formData.recipientAddress || !formData.subject || !formData.receivingBranch) {
      alert("कृपया सबै अनिवार्य (*) विवरणहरू भर्नुहोस्।")
      return
    }

    setIsSubmitting(true)

    try {
      // Build the command object
      const command = {
        DispatchDate: new Date().toISOString(),
        Miti: miti,
        ReceiverName: formData.recipientName,
        Subject: formData.subject,
        Status: formData.approvalStatus,
        Department: formData.receivingBranch,
        Remarks: formData.remarks
      };

      const result = await fetchApi('/Chalani', {
        method: 'POST',
        body: JSON.stringify(command)
      });
      
      alert("चलानी सफल भयो! नयाँ चलानी ID: " + result.id)
      setViewMode("list")
      setFormData({
        subject: "", letterType: "", letterDate: "", recipientName: "", recipientAddress: "", remarks: "", recipientEmail: "", receivingBranch: "", approvalStatus: "स्वीकृत", cc: "", relatedFile: "", alertEmail: false, alertSms: false
      })
    } catch (error: any) {
      alert("चलानी गर्न असफल: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClear = () => {
    if(confirm("तपाईं फारमका सबै विवरणहरू खाली गर्न चाहनुहुन्छ?")) {
      setFormData({
        subject: "", letterType: "", letterDate: "", recipientName: "", recipientAddress: "", remarks: "", recipientEmail: "", receivingBranch: "", approvalStatus: "स्वीकृत", cc: "", relatedFile: "", alertEmail: false, alertSms: false
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            {viewMode === "list" ? "चलानी किताब (Chalani Register)" : `नयाँ चलानी (ई-चलानी)`}
          </h1>
          <p className="text-muted-foreground mt-1">
            {viewMode === "list" ? "कार्यालयबाट पठाइएका पत्रहरूको चलानी विवरण" : "नयाँ पत्र चलानी गर्न तलको फारम भर्नुहोस्"}
          </p>
        </div>
        <div>
          {viewMode === "list" ? (
            <Button onClick={() => setViewMode("form")} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex gap-2">
              <Plus className="h-4 w-4" /> नयाँ चलानी
            </Button>
          ) : (
            <Button onClick={() => setViewMode("list")} variant="outline" className="flex gap-2">
              <ListIcon className="h-4 w-4" /> चलानी सूची
            </Button>
          )}
        </div>
      </div>

      {viewMode === "list" && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[180px] font-semibold">चलानी नम्बर</TableHead>
                <TableHead className="font-semibold">प्राप्तकर्ता कार्यालय</TableHead>
                <TableHead className="font-semibold">विषय</TableHead>
                <TableHead className="font-semibold">चलानी मिति</TableHead>
                <TableHead className="font-semibold">निकासा माध्यम</TableHead>
                <TableHead className="text-right font-semibold">स्थिति</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chalaniList.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-blue-600">{item.chalaniNo}</TableCell>
                  <TableCell className="font-medium">{item.receiver}</TableCell>
                  <TableCell>
                    <div className="font-medium truncate max-w-[200px]">{item.subject}</div>
                  </TableCell>
                  <TableCell>{miti}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                      {item.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className={
                      item.status === "स्वीकृत" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {viewMode === "form" && (
        <div className="grid gap-6 md:grid-cols-12">
          {/* Main Form Area */}
          <div className="md:col-span-8 space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <CardTitle className="text-xl text-slate-800">नयाँ चलानी सिर्जना फारम (ई-चलानी)</CardTitle>
                <CardDescription>चलानी गरिने पत्रको विवरण भर्नुहोस्। (*) ले अनिवार्य जनाउँछ।</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                
                {/* Row 1: Chalani No, Chalani Date, Approval Status */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-blue-700">चलानी नम्बर <span className="text-red-500">*</span></Label>
                    <Input 
                      disabled 
                      value={chalaniNo} 
                      className="border-blue-300 bg-blue-50/50 text-blue-800 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">चलानी मिति <span className="text-red-500">*</span></Label>
                    <NepaliDatePickerComponent value={miti} onChange={(val) => setMiti(val || "")} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-blue-700">स्वीकृति स्थिति <span className="text-red-500">*</span></Label>
                    <Select value={formData.approvalStatus} onValueChange={(v) => setFormData({...formData, approvalStatus: v || ""})}>
                      <SelectTrigger className="border-blue-300 focus:ring-blue-500">
                        <SelectValue placeholder="स्थिति छान्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="स्वीकृत">स्वीकृत</SelectItem>
                        <SelectItem value="प्रक्रियामा">प्रक्रियामा</SelectItem>
                        <SelectItem value="अस्वीकृत">अस्वीकृत</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Subject */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">बिषय <span className="text-red-500">*</span></Label>
                  <Input 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="चलानी गरिने पत्रको मुख्य बिषय..." 
                    className="border-slate-300 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Row 3: Letter Type & Letter Date */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पत्रको किसिम</Label>
                    <Select value={formData.letterType} onValueChange={(v) => setFormData({...formData, letterType: v || ""})}>
                      <SelectTrigger className="border-slate-300">
                        <SelectValue placeholder="छान्नुहोस्..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">साधारण पत्र</SelectItem>
                        <SelectItem value="circular">परिपत्र</SelectItem>
                        <SelectItem value="confidential">गोप्य</SelectItem>
                        <SelectItem value="urgent">जरुरी</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पत्रको मिति</Label>
                    <NepaliDatePickerComponent value={formData.letterDate} onChange={(val) => setFormData({...formData, letterDate: val || ""})} />
                  </div>
                </div>

                {/* Row 4: Recipient Name & Address */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पत्र पाउने कार्यालय वा व्यक्तिको नाम <span className="text-red-500">*</span></Label>
                    <Input 
                      value={formData.recipientName}
                      onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                      placeholder="पाउने कार्यालय वा व्यक्तिको नाम..." 
                      className="border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पत्र पाउने कार्यालय वा व्यक्तिको ठेगाना <span className="text-red-500">*</span></Label>
                    <Input 
                      value={formData.recipientAddress}
                      onChange={(e) => setFormData({...formData, recipientAddress: e.target.value})}
                      placeholder="पाउनेको ठेगाना वा स्थान..." 
                      className="border-slate-300"
                    />
                  </div>
                </div>

                {/* Row 5: Remarks & Recipient Email */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">कैफियत</Label>
                    <Input 
                      value={formData.remarks}
                      onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                      placeholder="कैफियत विवरण..." 
                      className="border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पत्र पाउने कार्यालयको EmailAddress</Label>
                    <Input 
                      type="email"
                      value={formData.recipientEmail}
                      onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
                      placeholder="Type Email To SendMail or leave empty" 
                      className="border-slate-300"
                    />
                  </div>
                </div>

                {/* Row 6: Receiving Branch & CC */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पत्र बुज्ने शाखा <span className="text-red-500">*</span></Label>
                    <Select value={formData.receivingBranch} onValueChange={(v) => setFormData({...formData, receivingBranch: v || ""})}>
                      <SelectTrigger className="border-slate-300">
                        <SelectValue placeholder="शाखा छान्नुहोस्..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">प्रशासन शाखा</SelectItem>
                        <SelectItem value="planning">योजना शाखा</SelectItem>
                        <SelectItem value="finance">आर्थिक प्रशासन</SelectItem>
                        <SelectItem value="education">शिक्षा शाखा</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">बोधार्थ (CC)</Label>
                    <Input 
                      value={formData.cc}
                      onChange={(e) => setFormData({...formData, cc: e.target.value})}
                      placeholder="बोधार्थ कार्यालय वा व्यक्तिको नाम..." 
                      className="border-slate-300"
                    />
                  </div>
                </div>

                {/* Row 7: Related File */}
                <div className="space-y-2 w-1/2 pr-3">
                  <Label className="text-sm font-medium">सम्बन्धित फाइल (ऐच्छिक)</Label>
                  <Select value={formData.relatedFile} onValueChange={(v) => setFormData({...formData, relatedFile: v || ""})}>
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="फाइल छान्नुहोस्..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="file1">फाइल नं. १ - बजेट विनियोजन</SelectItem>
                      <SelectItem value="file2">फाइल नं. २ - कर्मचारी प्रशासन</SelectItem>
                      <SelectItem value="none">कुनै पनि होइन</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t flex justify-end gap-3 pt-4 pb-4">
                <Button variant="outline" onClick={handleClear} className="bg-white text-slate-600 border-slate-300 hover:bg-slate-50">
                  सबै खाली गर्नुहोस् (Clear)
                </Button>
                <Button onClick={handleDispatch} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  {isSubmitting ? "सुरक्षित गर्दै..." : "चलानी सुरक्षित गर्नुहोस् (Save Dispatch)"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="md:col-span-4 space-y-6">
            
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-blue-600" /> स्वचालित सूचना प्रेषण
                </CardTitle>
                <CardDescription>पत्र चलानी भएपछि स्वतः सूचना पठाउनुहोस्</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox"
                    id="email-alert" 
                    checked={formData.alertEmail} 
                    onChange={(e) => setFormData({...formData, alertEmail: e.target.checked})} 
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor="email-alert" className="text-sm font-medium leading-none cursor-pointer">
                      Email मार्फत जानकारी पठाउनुहोस्
                    </label>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox"
                    id="sms-alert" 
                    checked={formData.alertSms} 
                    onChange={(e) => setFormData({...formData, alertSms: e.target.checked})} 
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor="sms-alert" className="text-sm font-medium leading-none cursor-pointer">
                      SMS मार्फत जानकारी पठाउनुहोस्
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-blue-600" /> स्क्यान
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 transition-all text-center hover:bg-slate-50 cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <UploadCloud className="h-6 w-6 text-slate-600" />
                  </div>
                  <h3 className="font-medium text-slate-800 mb-1">स्क्यान फाइल अपलोड गर्नुहोस्</h3>
                  <p className="text-xs text-muted-foreground mt-2">(No file chosen)</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      )}
    </div>
  )
}
