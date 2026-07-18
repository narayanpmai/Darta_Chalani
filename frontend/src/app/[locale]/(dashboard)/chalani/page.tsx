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

// Helper: reads fileCategories from settings and renders SelectItems
function FileCategorySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const getCategories = (): string[] => {
    try {
      const stored = localStorage.getItem("lgoms_settings")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed.fileCategories) && parsed.fileCategories.length > 0) return parsed.fileCategories
        if (typeof parsed.fileCategories === "string" && parsed.fileCategories.trim())
          return parsed.fileCategories.split(",").map((s: string) => s.trim()).filter(Boolean)
      }
    } catch {}
    return ["\u0935\u093e\u0930\u094d\u0937\u093f\u0915 \u092c\u091c\u0947\u091f", "\u0915\u0930\u094d\u092e\u091a\u093e\u0930\u0940 \u092a\u094d\u0930\u0936\u093e\u0938\u0928", "\u092f\u094b\u091c\u0928\u093e \u0924\u0925\u093e \u0935\u093f\u0915\u093e\u0938", "\u0930\u093e\u091c\u0938\u094d\u0935 \u0924\u0925\u093e \u0915\u0930", "\u0938\u093e\u092e\u093e\u091c\u093f\u0915 \u0938\u0947\u0935\u093e", "\u0905\u0928\u094d\u092f"]
  }
  const cats = getCategories()
  return (
    <Select value={value} onValueChange={(v: string | null) => { if (v) onChange(v) }}>
      <SelectTrigger className="border-slate-300">
        <SelectValue placeholder="\u092b\u093e\u0907\u0932 \u0915\u093f\u0938\u093f\u092e \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d..." />
      </SelectTrigger>
      <SelectContent>
        {cats.map((cat, i) => <SelectItem key={i} value={cat}>{cat}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

export default function ChalaniPage() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<"list" | "form">("list")
  
  // Settings & Context
  const [activeFy, setActiveFy] = useState("")
  const [chalaniNo, setChalaniNo] = useState("")
  const [miti, setMiti] = useState("")
  const [editId, setEditId] = useState<string | null>(null)

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
    tokAdeshPerson: "",
    approvalStatus: "प्रक्रियामा",
    cc: "",
    relatedFile: "",
    alertEmail: false,
    alertSms: false
  })

  // Cache/List Data
  const [chalaniList, setChalaniList] = useState<any[]>([])

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

    // Load initial list from cache
    const cached = localStorage.getItem("lgoms_chalanis")
    if (cached) {
      try {
        setChalaniList(JSON.parse(cached))
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (activeFy && viewMode === "form" && !editId) {
      const prefix = user?.ward && user.ward !== "0" 
        ? `W${user.ward}` 
        : "P";
      setChalaniNo(`${activeFy}-${prefix}-C-${chalaniList.length + 1}`)
    }
  }, [activeFy, user, viewMode, chalaniList, editId])

  // Sync to local storage
  useEffect(() => {
    if (chalaniList.length > 0) {
      localStorage.setItem("lgoms_chalanis", JSON.stringify(chalaniList))
    }
  }, [chalaniList])

  // Fetch Chalani list from backend API with local cache fallback
  useEffect(() => {
    if (viewMode === "list") {
      setIsSubmitting(true);
      fetchApi('/Chalani')
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
             const formattedList = data.map(item => ({
               id: item.id,
               chalaniNo: item.chalaniNumber || item.dispatchNumber,
               miti: item.miti,
               letterDate: item.dispatchDate,
               recipientName: item.receiverName,
               receiver: item.receiverName,
               recipientAddress: item.receiverAddress,
               remarks: item.remarks,
               subject: item.subject,
               method: item.deliveryMethod || "Physical",
               status: item.status || "स्वीकृत",
               relatedFile: item.attachmentUrl,
               tokAdeshPerson: item.orderOrDecision
             }));
             setChalaniList(formattedList);
             localStorage.setItem("lgoms_chalanis", JSON.stringify(formattedList));
          } else if (Array.isArray(data) && data.length === 0) {
             // Keep cache if backend has no records
             const cached = localStorage.getItem("lgoms_chalanis")
             if (cached) {
               try { setChalaniList(JSON.parse(cached)) } catch {}
             }
          }
        })
        .catch(err => {
          console.error("Failed to fetch chalani list, using cache:", err);
          const cached = localStorage.getItem("lgoms_chalanis")
          if (cached) {
            try { setChalaniList(JSON.parse(cached)) } catch {}
          }
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [viewMode])

  const handleEdit = async (item: any) => {
    setIsSubmitting(true);
    const localCached = chalaniList.find(x => x.id === item.id);
    const baseObj = localCached || item;

    try {
      const data = await fetchApi(`/Chalani/${item.id}`);
      setFormData({
        subject: data.subject || baseObj.subject || "",
        letterType: data.letterType || baseObj.letterType || "",
        letterDate: data.dispatchDate || baseObj.letterDate || "",
        recipientName: data.receiverName || baseObj.recipientName || baseObj.receiver || "",
        recipientAddress: data.receiverAddress || baseObj.recipientAddress || "",
        remarks: data.remarks || baseObj.remarks || "",
        recipientEmail: data.recipientEmail || baseObj.recipientEmail || "",
        tokAdeshPerson: data.orderOrDecision || baseObj.tokAdeshPerson || "",
        approvalStatus: data.status || baseObj.status || "स्वीकृत",
        cc: data.cc || baseObj.cc || "",
        relatedFile: data.attachmentUrl || baseObj.relatedFile || "",
        alertEmail: data.alertEmail || false,
        alertSms: data.alertSms || false
      });
      setMiti(data.miti || baseObj.miti || miti);
      setChalaniNo(data.chalaniNumber || data.dispatchNumber || baseObj.chalaniNo);
      setEditId(item.id);
      setViewMode("form");
    } catch (err) {
      console.warn("Failed to fetch full Chalani item, using local state", err);
      setFormData({
        subject: baseObj.subject || "",
        letterType: baseObj.letterType || "",
        letterDate: baseObj.letterDate || "",
        recipientName: baseObj.recipientName || baseObj.receiver || "",
        recipientAddress: baseObj.recipientAddress || "",
        remarks: baseObj.remarks || "",
        recipientEmail: baseObj.recipientEmail || "",
        tokAdeshPerson: baseObj.tokAdeshPerson || "",
        approvalStatus: baseObj.status || "स्वीकृत",
        cc: baseObj.cc || "",
        relatedFile: baseObj.relatedFile || "",
        alertEmail: false,
        alertSms: false
      });
      setChalaniNo(baseObj.chalaniNo);
      setEditId(item.id);
      setViewMode("form");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDispatch = async () => {
    if (!formData.recipientName || !formData.recipientAddress || !formData.subject) {
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
        TokAdeshPerson: formData.tokAdeshPerson,
        Remarks: formData.remarks
      };

      let resultId: string = "";
      try {
        if (editId) {
          // Edit mode
          try {
            await fetchApi(`/Chalani/${editId}`, {
              method: 'PUT',
              body: JSON.stringify(command)
            });
            resultId = editId;
          } catch (putErr) {
            console.warn("PUT failed, updating local state", putErr);
            resultId = editId;
          }
          
          const localItem = {
            id: editId,
            chalaniNo: chalaniNo,
            miti: miti,
            letterDate: formData.letterDate,
            recipientName: formData.recipientName,
            receiver: formData.recipientName,
            recipientAddress: formData.recipientAddress,
            remarks: formData.remarks,
            subject: formData.subject,
            method: "Physical",
            status: formData.approvalStatus,
            relatedFile: formData.relatedFile,
            tokAdeshPerson: formData.tokAdeshPerson
          };
          setChalaniList(prev => prev.map(u => u.id === editId ? localItem : u));
        } else {
          // Create mode
          const result = await fetchApi('/Chalani', {
            method: 'POST',
            body: JSON.stringify(command)
          });
          resultId = result.id;
        }
        
        // Refetch list after successful backend operation
        const freshData = await fetchApi('/Chalani');
        if (Array.isArray(freshData)) {
          setChalaniList(freshData.map(item => ({
            id: item.id,
            chalaniNo: item.chalaniNumber || item.dispatchNumber,
            miti: item.miti,
            letterDate: item.dispatchDate,
            recipientName: item.receiverName,
            receiver: item.receiverName,
            recipientAddress: item.receiverAddress,
            remarks: item.remarks,
            subject: item.subject,
            method: item.deliveryMethod || "Physical",
            status: item.status || "स्वीकृत",
            relatedFile: item.attachmentUrl,
            tokAdeshPerson: item.orderOrDecision
          })));
        }
      } catch (backendError) {
        console.warn("Backend Chalani POST/PUT failed, using local state", backendError);
        resultId = editId || Date.now().toString();
        
        const localItem = {
          id: resultId,
          chalaniNo: chalaniNo,
          miti: miti,
          letterDate: formData.letterDate,
          recipientName: formData.recipientName,
          receiver: formData.recipientName,
          recipientAddress: formData.recipientAddress,
          remarks: formData.remarks,
          subject: formData.subject,
          method: "Physical",
          status: formData.approvalStatus,
          relatedFile: formData.relatedFile,
          tokAdeshPerson: formData.tokAdeshPerson
        };

        if (editId) {
          setChalaniList(prev => prev.map(u => u.id === editId ? localItem : u));
        } else {
          setChalaniList(prev => [...prev, localItem]);
        }
      }
      
      alert(editId ? "चलानी विवरण सम्पादन गरियो!" : "चलानी सफल भयो! नयाँ चलानी ID: " + resultId)
      setViewMode("list")
      setEditId(null)
      setFormData({
        subject: "", letterType: "", letterDate: "", recipientName: "", recipientAddress: "", remarks: "", recipientEmail: "", tokAdeshPerson: "", approvalStatus: "प्रक्रियामा", cc: "", relatedFile: "", alertEmail: false, alertSms: false
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
        subject: "", letterType: "", letterDate: "", recipientName: "", recipientAddress: "", remarks: "", recipientEmail: "", tokAdeshPerson: "", approvalStatus: "प्रक्रियामा", cc: "", relatedFile: "", alertEmail: false, alertSms: false
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            {viewMode === "list" ? "चलानी किताब (Chalani Register)" : (editId ? `चलानी सम्पादन (चलानी नं: ${chalaniNo})` : `नयाँ चलानी (ई-चलानी)`)}
          </h1>
          <p className="text-muted-foreground mt-1">
            {viewMode === "list" ? "कार्यालयबाट पठाइएका पत्रहरूको चलानी विवरण" : "नयाँ पत्र चलानी गर्न तलको फारम भर्नुहोस्"}
          </p>
        </div>
        <div>
          {viewMode === "list" ? (
            <Button onClick={() => { setEditId(null); setFormData({ subject: "", letterType: "", letterDate: "", recipientName: "", recipientAddress: "", remarks: "", recipientEmail: "", tokAdeshPerson: "", approvalStatus: "प्रक्रियामा", cc: "", relatedFile: "", alertEmail: false, alertSms: false }); setViewMode("form"); }} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex gap-2">
              <Plus className="h-4 w-4" /> नयाँ चलानी
            </Button>
          ) : (
            <Button onClick={() => { setViewMode("list"); setEditId(null); }} variant="outline" className="flex gap-2">
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
                  <TableCell className="font-medium">
                    {item.status === "प्रक्रियामा" ? (
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 underline font-semibold flex items-center gap-1"
                      >
                        {item.chalaniNo}
                      </button>
                    ) : (
                      <span className="text-slate-500 font-medium">{item.chalaniNo}</span>
                    )}
                  </TableCell>
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
                      value={chalaniNo} 
                      onChange={(e) => setChalaniNo(e.target.value)}
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

                {/* Row 6: Tok/Adesh & CC */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">तोक/आदेश <span className="text-slate-500 text-xs">(तोक लगाउने व्यक्ति)</span></Label>
                    <Input
                      value={formData.tokAdeshPerson}
                      onChange={(e) => setFormData({...formData, tokAdeshPerson: e.target.value})}
                      placeholder="तोक लगाउने व्यक्तिको नाम..."
                      className="border-slate-300"
                    />
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

                {/* Row 7: Related File - settings driven */}
                <div className="space-y-2 w-1/2 pr-3">
                  <Label className="text-sm font-medium">सम्बन्धित फाइल किसिम (ऐच्छिक)</Label>
                  <FileCategorySelect value={formData.relatedFile} onChange={(v) => setFormData({...formData, relatedFile: v})} />
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
