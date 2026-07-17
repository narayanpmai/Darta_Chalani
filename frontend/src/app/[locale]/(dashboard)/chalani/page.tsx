"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, FileText, QrCode, UploadCloud, Users, X } from "lucide-react"
import { NepaliDatePickerComponent } from "@/components/ui/nepali-date-picker"
import { useAuth } from "@/lib/auth-context"

export default function ChalaniPage() {
  const { user } = useAuth()
  
  // Dynamic Settings Data
  const [activeFy, setActiveFy] = useState("")
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>([
    "Physical Letter (हुलाक/तोक)", "Email", "System to System"
  ])
  const [departments, setDepartments] = useState<string[]>([
    "Administration (प्रशासन)", "Planning (योजना)", "Finance (आर्थिक)"
  ])

  // Form State
  const [chalaniNo, setChalaniNo] = useState("")
  const [ccList, setCcList] = useState<string[]>([])
  
  // Load initial settings and sequences
  useEffect(() => {
    // 1. Fetch Fiscal Year
    const fyStore = localStorage.getItem("lgoms_fiscal_years")
    if (fyStore) {
      const parsed = JSON.parse(fyStore)
      const active = parsed.find((f: any) => f.isActive)
      if (active) setActiveFy(active.name)
    } else {
      setActiveFy("२०८२/०८३") // fallback
    }

    // 2. Fetch Settings for Dropdowns
    const settingsStore = localStorage.getItem("lgoms_settings")
    if (settingsStore) {
      const parsed = JSON.parse(settingsStore)
      if (parsed.deliveryMethods) {
        setDeliveryMethods(parsed.deliveryMethods.split(",").map((s: string) => s.trim()).filter(Boolean))
      }
      if (parsed.originatingDepartments) {
        setDepartments(parsed.originatingDepartments.split(",").map((s: string) => s.trim()).filter(Boolean))
      }
    }
  }, [])

  // 3. Generate Auto Chalani Number based on Role and FY
  useEffect(() => {
    if (!activeFy || !user) return

    // Ward users get a separate sequence per ward. Palika users share one sequence.
    const seqKey = user.ward ? `lgoms_ward_${user.ward}_chalani_seq` : `lgoms_palika_chalani_seq`
    
    const currentSeq = parseInt(localStorage.getItem(seqKey) || "0", 10) + 1
    const seqPadded = currentSeq.toString().padStart(4, '0') // e.g. 0001
    const prefix = user.ward ? `W${user.ward}` : `P`
    
    // Result: २०८२/०८३-P-C-0001 OR २०८२/०८३-W1-C-0001
    const generated = `${activeFy}-${prefix}-C-${seqPadded}`
    
    setChalaniNo(generated)
  }, [activeFy, user])

  const handleAddCc = () => setCcList([...ccList, ""])
  const handleUpdateCc = (index: number, val: string) => {
    const updated = [...ccList]
    updated[index] = val
    setCcList(updated)
  }
  const handleRemoveCc = (index: number) => {
    const updated = ccList.filter((_, i) => i !== index)
    setCcList(updated)
  }

  const handleDispatch = () => {
    // Mock save: increment the sequence in local storage so the next one gets a new number
    if (!user) return
    const seqKey = user.ward ? `lgoms_ward_${user.ward}_chalani_seq` : `lgoms_palika_chalani_seq`
    const currentSeq = parseInt(localStorage.getItem(seqKey) || "0", 10)
    localStorage.setItem(seqKey, (currentSeq + 1).toString())
    
    alert(`Dispatch Successful! Chalani Number: ${chalaniNo}`)
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">नयाँ चलानी (New Dispatch)</h1>
          <p className="text-muted-foreground">Create a new outgoing letter/dispatch.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleDispatch}>
            Dispatch File
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Panel: Dispatch Form */}
        <div className="md:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dispatch Details</CardTitle>
              <CardDescription>Enter details for the outgoing letter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chalani-no">Chalani No. (Auto)</Label>
                  <Input id="chalani-no" disabled value={chalaniNo} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date (Miti)</Label>
                  <NepaliDatePickerComponent id="date" value="" onChange={() => {}} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receiver">Receiver (पाउने कार्यालय/व्यक्ति)</Label>
                <Input id="receiver" placeholder="Enter receiver name or office" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address (ठेगाना)</Label>
                <Input id="address" placeholder="Receiver address" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject (विषय)</Label>
                <Input id="subject" placeholder="Enter the subject of the letter" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery-method">Delivery Method</Label>
                  <Select>
                    <SelectTrigger id="delivery-method">
                      <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryMethods.map((method, idx) => (
                        <SelectItem key={idx} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Originating Department</Label>
                  <Select>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept, idx) => (
                        <SelectItem key={idx} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments (PDF/Images)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-10 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-1">Attach Final Document</h3>
                <p className="text-sm text-muted-foreground">Please upload signed letter for digital archive</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Receivers List, QR */}
        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <CardTitle>Multiple Receivers (बोधार्थ)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground">Add CC (बोधार्थ) recipients if this letter needs to be dispatched to multiple offices.</p>
              
              <div className="space-y-3">
                {ccList.map((cc, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      placeholder={`Receiver ${index + 1}`} 
                      value={cc} 
                      onChange={(e) => handleUpdateCc(index, e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveCc(index)} className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full" onClick={handleAddCc}>
                + Add CC (बोधार्थ थप्नुहोस्)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" /> Dispatch Verification QR
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="h-40 w-40 bg-muted rounded-md border flex items-center justify-center flex-col gap-2 text-muted-foreground">
                <QrCode className="h-12 w-12 opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4 max-w-[200px]">
                This QR will be attached to the top of the printed letter automatically.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
