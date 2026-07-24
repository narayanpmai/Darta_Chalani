"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadCloud, FileText, Plus, List as ListIcon, CheckCircle, Loader2 } from "lucide-react"
import { NepaliDatePickerComponent } from "@/components/ui/nepali-date-picker"
import { useAuth } from "@/lib/auth-context"
import { getDefaultDateForFiscalYear } from "@/lib/fiscal-year-utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import { fetchApi } from "@/lib/api"

export default function DartaPage() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<"list" | "form">("list")
  
  // Settings & Context
  const [activeFy, setActiveFy] = useState("")
  const [dartaNo, setDartaNo] = useState("")
  const [miti, setMiti] = useState("")
  const [editId, setEditId] = useState<string | null>(null)

  // Form State
  const [fileStatus, setFileStatus] = useState<"idle" | "scanning" | "done">("idle")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    letterType: "",
    letterDate: "",
    senderName: "",
    senderAddress: "",
    senderDispatchNo: "",
    remarks: "",
    receiverEmail: "",
    receivingBranch: "",
    status: "दर्ता भएको",
    relatedFile: ""
  })

  // Cache/List Data
  const [dartaList, setDartaList] = useState<any[]>([])

  useEffect(() => {
    // 1. Fetch Fiscal Year
    const fyStore = localStorage.getItem("lgoms_fiscal_years")
    if (fyStore) {
      try {
        const parsed = JSON.parse(fyStore)
        if (Array.isArray(parsed)) {
          const active = parsed.find((f: any) => f.isActive)
          if (active) {
            setActiveFy(active.name)
            setMiti(getDefaultDateForFiscalYear(active.name))
          }
        } else {
          setActiveFy("२०८२/०८३")
          setMiti(getDefaultDateForFiscalYear("२०८२/०८३"))
        }
      } catch (e) {
        setActiveFy("२०८२/०८३")
        setMiti(getDefaultDateForFiscalYear("२०८२/०८३"))
      }
    } else {
      setActiveFy("२०८२/०८३")
      setMiti(getDefaultDateForFiscalYear("२०८२/०८३"))
    }

    // Backend is fully functional; no local cache load needed.
  }, [])

  useEffect(() => {
    if (viewMode === "form" && !editId) {
      const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
      const numStr = (dartaList.length + 1).toString();
      const nepaliNum = numStr.replace(/\d/g, (digit) => nepaliDigits[parseInt(digit, 10)]);
      setDartaNo(nepaliNum)
    }
  }, [viewMode, dartaList, editId])

  // Cache logic removed - we rely purely on backend state

  // Fetch Darta list from backend API with local cache fallback
  useEffect(() => {
    if (viewMode === "list") {
      setIsSubmitting(true);
      fetchApi('/Darta')
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
             const formattedList = data.map(item => ({
               id: item.id,
               dartaNo: item.dartaNumber,
               miti: item.miti,
               letterDate: item.receivedLetterDate,
               senderName: item.senderName,
               sender: item.senderName,
               senderAddress: item.senderAddress,
               senderDispatchNo: item.receivedLetterNumber,
               remarks: item.remarks,
               receivingBranch: item.forwardedToDepartment,
               status: item.status || "दर्ता भएको",
               subject: item.subject,
               priority: item.priority || "सामान्य",
               relatedFile: item.attachmentUrl
             }));
             setDartaList(formattedList);
          } else if (Array.isArray(data) && data.length === 0) {
             setDartaList([]);
          }
        })
        .catch(err => {
          console.error("Failed to fetch darta list:", err);
          setDartaList([]);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [viewMode])

  const simulateAiExtraction = async () => {
    setFileStatus("scanning")
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        senderName: "शिक्षा विकास तथा समन्वय इकाई",
        senderAddress: "काठमाडौं",
        subject: "शिक्षक दरबन्दी मिलान सम्बन्धमा।",
        letterType: "general",
        receivingBranch: "education",
        senderDispatchNo: "च.नं. ४५२",
      }))
      setFileStatus("done")
    }, 2000)
  }

  const handleEdit = async (item: any) => {
    setIsSubmitting(true);
    const localCached = dartaList.find(x => x.id === item.id);
    const baseObj = localCached || item;

    try {
      const data = await fetchApi(`/Darta/${item.id}`);
      const raw = data || baseObj;

      let formattedDate = "";
      if (raw.receivedLetterDate && raw.receivedLetterDate.trim()) {
        formattedDate = raw.receivedLetterDate.includes('T') ? raw.receivedLetterDate.split('T')[0] : raw.receivedLetterDate;
      } else if (raw.registrationDate) {
        formattedDate = typeof raw.registrationDate === 'string' && raw.registrationDate.includes('T') 
          ? raw.registrationDate.split('T')[0] 
          : raw.registrationDate;
      }

      setFormData({
        subject: raw.subject || baseObj.subject || "",
        letterType: raw.letterType || baseObj.letterType || "साधारण पत्र",
        letterDate: formattedDate || baseObj.letterDate || "",
        senderName: raw.senderName || baseObj.senderName || baseObj.sender || "",
        senderAddress: raw.senderAddress || baseObj.senderAddress || "",
        senderDispatchNo: raw.receivedLetterNumber || baseObj.senderDispatchNo || "",
        remarks: raw.remarks || baseObj.remarks || "",
        receiverEmail: raw.handledBy || baseObj.receiverEmail || "",
        receivingBranch: raw.forwardedToDepartment || baseObj.receivingBranch || "प्रशासन शाखा",
        status: raw.status || baseObj.status || "दर्ता भएको",
        relatedFile: raw.attachmentUrl || baseObj.relatedFile || ""
      });
      setMiti(raw.miti || baseObj.miti || miti);
      setDartaNo(raw.dartaNumber || baseObj.dartaNo || dartaNo);
      setEditId(item.id);
      setViewMode("form");
    } catch (err) {
      console.warn("Failed to fetch full Darta item, using local state", err);
      setFormData({
        subject: baseObj.subject || "",
        letterType: baseObj.letterType || "साधारण पत्र",
        letterDate: baseObj.letterDate || "",
        senderName: baseObj.senderName || baseObj.sender || "",
        senderAddress: baseObj.senderAddress || "",
        senderDispatchNo: baseObj.senderDispatchNo || "",
        remarks: baseObj.remarks || "",
        receiverEmail: baseObj.receiverEmail || "",
        receivingBranch: baseObj.receivingBranch || "",
        status: baseObj.status || "दर्ता भएको",
        relatedFile: baseObj.relatedFile || ""
      });
      setMiti(baseObj.miti || miti);
      setDartaNo(baseObj.dartaNo);
      setEditId(item.id);
      setViewMode("form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("के तपाईं यो दर्ता विवरण हटाउन चाहनुहुन्छ?")) return;
    setIsSubmitting(true);
    try {
      await fetchApi(`/Darta/${id}`, { method: 'DELETE' });
      alert("दर्ता विवरण सफलतापूर्वक हटाइयो।");
      const freshData = await fetchApi('/Darta');
      if (Array.isArray(freshData)) {
        setDartaList(freshData.map(item => ({
          id: item.id,
          dartaNo: item.dartaNumber,
          miti: item.miti,
          letterDate: item.receivedLetterDate,
          senderName: item.senderName,
          sender: item.senderName,
          senderAddress: item.senderAddress,
          senderDispatchNo: item.receivedLetterNumber,
          remarks: item.remarks,
          receivingBranch: item.forwardedToDepartment,
          status: item.status || "दर्ता भएको",
          subject: item.subject,
          priority: item.priority || "सामान्य",
          relatedFile: item.attachmentUrl
        })));
      } else {
        setDartaList([]);
      }
    } catch (err: any) {
      alert("हटाउन असफल: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.senderName || !formData.senderAddress || !formData.subject || !formData.senderDispatchNo) {
      alert("कृपया सबै अनिवार्य (*) विवरणहरू भर्नुहोस्।")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const command = {
        RegistrationDate: editId ? undefined : new Date().toISOString(),
        Miti: miti,
        SenderName: formData.senderName,
        SenderAddress: formData.senderAddress,
        Subject: formData.subject,
        LetterType: formData.letterType || "साधारण पत्र",
        ReceivedLetterDate: formData.letterDate,
        ReceivedLetterNumber: formData.senderDispatchNo,
        ForwardedToDepartment: formData.receivingBranch || "प्रशासन शाखा",
        Priority: "Normal",
        Status: formData.status,
        Remarks: formData.remarks,
        AttachmentUrl: formData.relatedFile
      };

      let resultId: string = "";
        if (editId) {
          // Edit mode
          await fetchApi(`/Darta/${editId}`, {
            method: 'PUT',
            body: JSON.stringify(command)
          });
          resultId = editId;
        } else {
          // Create mode
          const createCmd = { ...command, DartaNumber: dartaNo };
          const result = await fetchApi('/Darta', {
            method: 'POST',
            body: JSON.stringify(createCmd)
          });
          resultId = result.id;
        }
        
        // Refetch list after successful backend operation
        const freshData = await fetchApi('/Darta');
        if (Array.isArray(freshData)) {
          setDartaList(freshData.map(item => ({
            id: item.id,
            dartaNo: item.dartaNumber,
            miti: item.miti,
            letterDate: item.receivedLetterDate,
            senderName: item.senderName,
            sender: item.senderName,
            senderAddress: item.senderAddress,
            senderDispatchNo: item.receivedLetterNumber,
            remarks: item.remarks,
            receivingBranch: item.forwardedToDepartment,
            status: item.status || "दर्ता भएको",
            subject: item.subject,
            priority: item.priority || "सामान्य",
            relatedFile: item.attachmentUrl
          })));
        }

      
      alert(editId ? "दर्ता विवरण सम्पादन गरियो!" : "दर्ता सफल भयो! नयाँ दर्ता ID: " + resultId)
      setViewMode("list")
      setEditId(null)
      // Reset form
      setFormData({
        subject: "", letterType: "", letterDate: "", senderName: "", senderAddress: "", senderDispatchNo: "", remarks: "", receiverEmail: "", receivingBranch: "", status: "दर्ता भएको", relatedFile: ""
      })
      setFileStatus("idle")
    } catch (error: any) {
      alert("दर्ता गर्न असफल: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            {viewMode === "list" ? "दर्ता किताब (Darta Register)" : (editId ? `दर्ता सम्पादन (दर्ता नं: ${dartaNo})` : `नयाँ दर्ता (प्रस्तावित दर्ता नं: स्वचालित)`)}
          </h1>
          <p className="text-muted-foreground mt-1">
            {viewMode === "list" ? "कार्यालयमा प्राप्त भएका पत्रहरूको दर्ता विवरण" : "नयाँ पत्र दर्ता गर्न तलको फारम भर्नुहोस्"}
          </p>
        </div>
        <div>
          {viewMode === "list" ? (
            <Button onClick={() => { setEditId(null); setFormData({ subject: "", letterType: "", letterDate: "", senderName: "", senderAddress: "", senderDispatchNo: "", remarks: "", receiverEmail: "", receivingBranch: "", status: "दर्ता भएको", relatedFile: "" }); setViewMode("form"); }} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex gap-2">
              <Plus className="h-4 w-4" /> नयाँ दर्ता
            </Button>
          ) : (
            <Button onClick={() => { setViewMode("list"); setEditId(null); }} variant="outline" className="flex gap-2">
              <ListIcon className="h-4 w-4" /> दर्ता सूची
            </Button>
          )}
        </div>
      </div>

      {viewMode === "list" && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[60px] font-semibold">S.N.</TableHead>
                <TableHead className="w-[180px] font-semibold">दर्ता नम्बर</TableHead>
                <TableHead className="font-semibold">पठाउने कार्यालय / ठेगाना</TableHead>
                <TableHead className="font-semibold">विषय / शाखा</TableHead>
                <TableHead className="font-semibold">प्राथमिकता</TableHead>
                <TableHead className="font-semibold">स्थिति</TableHead>
                <TableHead className="text-right font-semibold">कार्य (Actions)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dartaList.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-500">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800 underline font-semibold text-left"
                    >
                      {item.dartaNo}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.sender}</div>
                    <div className="text-xs text-muted-foreground">{item.senderAddress || item.miti}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.subject}</div>
                    <div className="text-xs text-muted-foreground">{item.receivingBranch || "प्रशासन शाखा"}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      item.priority === "अति जरुरी" ? "bg-red-50 text-red-700 border-red-200" :
                      item.priority === "जरुरी" ? "bg-orange-50 text-orange-700 border-orange-200" :
                      "bg-green-50 text-green-700 border-green-200"
                    }>
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      item.status === "प्रक्रियामा" ? "bg-orange-100 text-orange-700 hover:bg-orange-200" :
                      item.status === "दर्ता भएको" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : 
                      item.status === "टिप्पणी उठाइएको" ? "bg-purple-100 text-purple-700 hover:bg-purple-200" :
                      "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    }>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="text-xs">
                      सम्पादन
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} className="text-xs">
                      हटाउनुहोस्
                    </Button>
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
            <Card className="shadow-sm border-slate-200 overflow-visible">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <CardTitle className="text-xl text-slate-800">पत्रको विवरण</CardTitle>
                <CardDescription>सबै अनिवार्य (*) विवरणहरू भर्नुहोस्</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                
                {/* Row 1: Registration No, Registration Date & Letter Date */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-blue-700">दर्ता नम्बर <span className="text-red-500">*</span></Label>
                    <Input 
                      value={dartaNo} 
                      onChange={(e) => setDartaNo(e.target.value)}
                      className="border-blue-300 bg-blue-50/50 text-blue-800 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">दर्ताको मिति <span className="text-red-500">*</span></Label>
                    <NepaliDatePickerComponent value={miti} onChange={(val) => setMiti(val || "")} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पत्रको मिति</Label>
                    <NepaliDatePickerComponent value={formData.letterDate} onChange={(val) => setFormData({...formData, letterDate: val || ""})} />
                  </div>
                </div>

                {/* Row 2: Subject */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">बिषय <span className="text-red-500">*</span></Label>
                  <Input 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="पत्रको मुख्य विषय..." 
                    className="border-slate-300 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Row 3: Letter Type & Receiving Branch */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पत्रको किसिम</Label>
                    <Select value={formData.letterType} onValueChange={(v) => setFormData({...formData, letterType: v || ""})}>
                      <SelectTrigger className="border-slate-300">
                        <SelectValue placeholder="छान्नुहोस्..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="साधारण पत्र">साधारण पत्र</SelectItem>
                        <SelectItem value="परिपत्र">परिपत्र</SelectItem>
                        <SelectItem value="गोप्य">गोप्य</SelectItem>
                        <SelectItem value="जरुरी">जरुरी</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पत्र बुज्ने शाखा</Label>
                    <Select value={formData.receivingBranch} onValueChange={(v) => setFormData({...formData, receivingBranch: v || ""})}>
                      <SelectTrigger className="border-slate-300">
                        <SelectValue placeholder="शाखा छान्नुहोस्..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="प्रशासन शाखा">प्रशासन शाखा</SelectItem>
                        <SelectItem value="योजना शाखा">योजना शाखा</SelectItem>
                        <SelectItem value="आर्थिक प्रशासन">आर्थिक प्रशासन</SelectItem>
                        <SelectItem value="शिक्षा शाखा">शिक्षा शाखा</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 4: Sender Name & Address */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पठाउने कार्यालय/व्यक्तिको नाम <span className="text-red-500">*</span></Label>
                    <Input 
                      value={formData.senderName}
                      onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                      placeholder="पठाउने कार्यालय वा व्यक्तिको नाम..." 
                      className="border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पठाउने कार्यालय/व्यक्तिको ठेगाना <span className="text-red-500">*</span></Label>
                    <Input 
                      value={formData.senderAddress}
                      onChange={(e) => setFormData({...formData, senderAddress: e.target.value})}
                      placeholder="पठाउने कार्यालय वा व्यक्तिको ठेगाना..." 
                      className="border-slate-300"
                    />
                  </div>
                </div>

                {/* Row 5: Sender Dispatch No & Receiver Email */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पत्रको चलानी नं <span className="text-red-500">*</span></Label>
                    <Input 
                      value={formData.senderDispatchNo}
                      onChange={(e) => setFormData({...formData, senderDispatchNo: e.target.value})}
                      placeholder="पठाउने कार्यालयको चलानी नम्बर..." 
                      className="border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">पत्र पाउने कार्यालय/व्यक्तिको EmailAddress</Label>
                    <Input 
                      type="email"
                      value={formData.receiverEmail}
                      onChange={(e) => setFormData({...formData, receiverEmail: e.target.value})}
                      placeholder="Select/Type Email or leave empty" 
                      className="border-slate-300"
                    />
                  </div>
                </div>

                {/* Row 6: Remarks */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">कैफियत</Label>
                  <Input 
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                    placeholder="कैफियत वा थप विवरण..." 
                    className="border-slate-300"
                  />
                </div>
                
                {/* Row 7: Status */}
                <div className="space-y-2 w-1/2 pr-3">
                  <Label className="text-sm font-medium text-red-600">स्थिति <span className="text-red-500">*</span></Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v || ""})}>
                    <SelectTrigger className="border-red-200 bg-red-50 text-red-700 focus:ring-red-500">
                      <SelectValue placeholder="स्थिति छान्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="प्रक्रियामा">प्रक्रियामा</SelectItem>
                      <SelectItem value="दर्ता भएको">दर्ता भएको</SelectItem>
                      <SelectItem value="टिप्पणी उठाइएको">टिप्पणी उठाइएको</SelectItem>
                      <SelectItem value="सक्रिय">सक्रिय</SelectItem>
                      <SelectItem value="सम्पन्न">सम्पन्न</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t flex justify-end gap-3 pt-4 pb-4">
                <Button variant="outline" onClick={() => setViewMode("list")} className="bg-white text-slate-600 border-slate-300 hover:bg-slate-50">
                  रद्द गर्नुहोस्
                </Button>
                <Button onClick={handleRegister} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white px-6">
                  {isSubmitting ? "दर्ता गर्दै..." : "दर्ता सुरक्षित गर्नुहोस्"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar / Upload Area */}
          <div className="md:col-span-4 space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-blue-600" /> स्क्यान अपलोड
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div 
                  onClick={fileStatus === "idle" ? simulateAiExtraction : undefined}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all text-center ${
                    fileStatus === "idle" ? "border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 cursor-pointer" : 
                    fileStatus === "scanning" ? "border-blue-400 bg-blue-50/50" : 
                    "border-green-400 bg-green-50/50 cursor-default"
                  }`}
                >
                  {fileStatus === "idle" && (
                    <>
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <UploadCloud className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-slate-800 mb-1">स्क्यान फाइल अपलोड गर्नुहोस्</h3>
                      <p className="text-xs text-muted-foreground mt-2">(Click to simulate AI extraction)</p>
                    </>
                  )}
                  {fileStatus === "scanning" && (
                    <>
                      <Loader2 className="h-10 w-10 text-blue-600 mb-4 animate-spin" />
                      <h3 className="font-medium text-blue-800 mb-1">AI Scanning Document...</h3>
                      <p className="text-xs text-blue-600/80 mt-1">Extracting details from letter</p>
                    </>
                  )}
                  {fileStatus === "done" && (
                    <>
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-medium text-green-800 mb-1">Upload Successful!</h3>
                      <p className="text-xs text-green-600/80 mt-1">Auto-filled fields using AI</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-blue-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> AI Registration Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 leading-relaxed">
                {fileStatus === "done" ? (
                  <div className="space-y-3">
                    <p><strong>पठाउने:</strong> शिक्षा विकास तथा समन्वय इकाई</p>
                    <p><strong>विषय:</strong> शिक्षक दरबन्दी मिलान सम्बन्धमा।</p>
                    <p className="text-xs text-slate-500 italic mt-2 border-t pt-2">AI found high confidence match for standard government letter format.</p>
                  </div>
                ) : (
                  <p className="italic text-slate-400">पत्र अपलोड गरेपछि यहाँ AI ले स्वचालित रुपमा मुख्य विवरण देखाउनेछ।</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
