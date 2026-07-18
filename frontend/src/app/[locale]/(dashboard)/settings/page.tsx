"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Save, Key, Globe, Database, CheckCircle2, Send, X, Plus } from "lucide-react"

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaved, setIsSaved] = useState(false)
  
  const [formData, setFormData] = useState({
    // Municipality Profile
    tenantName: "काठमाडौं महानगरपालिका",
    tenantNameEn: "Kathmandu Metropolitan City",
    province: "Bagmati Province",
    district: "Kathmandu",
    contactEmail: "info@kathmandu.gov.np",
    
    // API Integrations
    smsGatewayUrl: "https://api.sparrowsms.com/v2/sms/",
    smsApiKey: "****************",
    
    // Branding & Localization
    primaryColor: "#427DF3",
    dateFormat: "YYYY-MM-DD (BS)",
    
    // Data Management
    backupFrequency: "Daily",
    retentionPeriod: "5 Years",

    // Dispatch Setup (Comma-separated initially, now arrays in state)
    deliveryMethods: ["Physical Letter (हुलाक/तोक)", "Email", "System to System"],
    originatingDepartments: ["Administration (प्रशासन)", "Planning (योजना)", "Finance (आर्थिक)"],
    
    // Letter Type & Branch Setup
    letterTypes: ["परिपत्र (Circular)", "सूचना (Notice)", "निवेदन (Application)", "अन्य (Other)"]
  })

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("lgoms_settings")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setFormData(prev => ({ 
          ...prev, 
          ...parsed,
          deliveryMethods: parsed.deliveryMethods ? (Array.isArray(parsed.deliveryMethods) ? parsed.deliveryMethods : parsed.deliveryMethods.split(",").map((s: string) => s.trim())) : prev.deliveryMethods,
          originatingDepartments: parsed.originatingDepartments ? (Array.isArray(parsed.originatingDepartments) ? parsed.originatingDepartments : parsed.originatingDepartments.split(",").map((s: string) => s.trim())) : prev.originatingDepartments,
          letterTypes: parsed.letterTypes ? (Array.isArray(parsed.letterTypes) ? parsed.letterTypes : parsed.letterTypes.split(",").map((s: string) => s.trim())) : prev.letterTypes,
        }))
      } catch (e) {}
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    setIsSaved(false)
  }

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      deliveryMethods: formData.deliveryMethods.join(", "),
      originatingDepartments: formData.originatingDepartments.join(", "),
      letterTypes: formData.letterTypes.join(", ")
    }
    localStorage.setItem("lgoms_settings", JSON.stringify(dataToSave))
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const renderDynamicArray = (fieldId: "deliveryMethods" | "originatingDepartments" | "letterTypes", label: string) => {
    return (
      <div className="space-y-3 border rounded-lg p-4 bg-muted/10">
        <Label className="text-base font-semibold">{label}</Label>
        {formData[fieldId].map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input 
              value={item} 
              onChange={(e) => {
                const newArr = [...formData[fieldId]];
                newArr[idx] = e.target.value;
                setFormData(prev => ({ ...prev, [fieldId]: newArr }));
                setIsSaved(false);
              }} 
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                const newArr = formData[fieldId].filter((_, i) => i !== idx);
                setFormData(prev => ({ ...prev, [fieldId]: newArr }));
                setIsSaved(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 border-dashed mt-2 w-fit"
          onClick={() => {
            setFormData(prev => ({ ...prev, [fieldId]: [...prev[fieldId], ""] }));
            setIsSaved(false);
          }}
        >
          <Plus className="h-4 w-4" /> नयाँ थप्नुहोस् (Add New)
        </Button>
      </div>
    )
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-1">Configure tenant-specific parameters and integrations.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        
        {/* Settings Navigation */}
        <div className="md:col-span-1 flex flex-col gap-2">
          <Button 
            variant={activeTab === "profile" ? "secondary" : "ghost"} 
            className={`justify-start w-full gap-2 ${activeTab !== "profile" && "text-muted-foreground"}`}
            onClick={() => setActiveTab("profile")}
          >
            <Building2 className="h-4 w-4" /> Municipality Profile
          </Button>
          <Button 
            variant={activeTab === "api" ? "secondary" : "ghost"} 
            className={`justify-start w-full gap-2 ${activeTab !== "api" && "text-muted-foreground"}`}
            onClick={() => setActiveTab("api")}
          >
            <Key className="h-4 w-4" /> API Integrations
          </Button>
          <Button 
            variant={activeTab === "branding" ? "secondary" : "ghost"} 
            className={`justify-start w-full gap-2 ${activeTab !== "branding" && "text-muted-foreground"}`}
            onClick={() => setActiveTab("branding")}
          >
            <Globe className="h-4 w-4" /> Branding & Localization
          </Button>
          <Button 
            variant={activeTab === "data" ? "secondary" : "ghost"} 
            className={`justify-start w-full gap-2 ${activeTab !== "data" && "text-muted-foreground"}`}
            onClick={() => setActiveTab("data")}
          >
            <Database className="h-4 w-4" /> Data Management
          </Button>
          <Button 
            variant={activeTab === "dispatch" ? "secondary" : "ghost"} 
            className={`justify-start w-full gap-2 ${activeTab !== "dispatch" && "text-muted-foreground"}`}
            onClick={() => setActiveTab("dispatch")}
          >
            <Send className="h-4 w-4" /> Dispatch Setup
          </Button>
          <Button 
            variant={activeTab === "letter_branch" ? "secondary" : "ghost"} 
            className={`justify-start w-full gap-2 ${activeTab !== "letter_branch" && "text-muted-foreground"}`}
            onClick={() => setActiveTab("letter_branch")}
          >
            <Building2 className="h-4 w-4" /> पत्रको किसिम र शाखा
          </Button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          <Card className="shadow-sm">
            
            {/* Municipality Profile Tab */}
            {activeTab === "profile" && (
              <>
                <CardHeader>
                  <CardTitle>Municipality Profile</CardTitle>
                  <CardDescription>Update the official details that will appear on letterheads and reports.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenantName">Municipality Name (Nepali)</Label>
                    <Input id="tenantName" value={formData.tenantName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenantNameEn">Municipality Name (English)</Label>
                    <Input id="tenantNameEn" value={formData.tenantNameEn} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <Input id="province" value={formData.province} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input id="district" value={formData.district} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Official Contact Email</Label>
                    <Input id="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} />
                  </div>
                </CardContent>
              </>
            )}

            {/* API Integrations Tab */}
            {activeTab === "api" && (
              <>
                <CardHeader>
                  <CardTitle>API Integrations</CardTitle>
                  <CardDescription>Configure external API endpoints such as SMS gateway and Payment providers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smsGatewayUrl">SMS Gateway URL</Label>
                    <Input id="smsGatewayUrl" value={formData.smsGatewayUrl} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smsApiKey">SMS API Key</Label>
                    <Input id="smsApiKey" type="password" value={formData.smsApiKey} onChange={handleChange} />
                  </div>
                </CardContent>
              </>
            )}

            {/* Branding & Localization Tab */}
            {activeTab === "branding" && (
              <>
                <CardHeader>
                  <CardTitle>Branding & Localization</CardTitle>
                  <CardDescription>Manage the look and feel as well as regional settings for your system.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color (Hex Code)</Label>
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-md border shadow-sm" style={{ backgroundColor: formData.primaryColor }}></div>
                      <Input id="primaryColor" value={formData.primaryColor} onChange={handleChange} className="max-w-[200px]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">System Date Format</Label>
                    <Input id="dateFormat" value={formData.dateFormat} onChange={handleChange} />
                  </div>
                </CardContent>
              </>
            )}

            {/* Data Management Tab */}
            {activeTab === "data" && (
              <>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Configure database backups and data retention policies.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Automated Backup Frequency</Label>
                      <Input id="backupFrequency" value={formData.backupFrequency} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retentionPeriod">Data Retention Period</Label>
                      <Input id="retentionPeriod" value={formData.retentionPeriod} onChange={handleChange} />
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {/* Dispatch Setup Tab */}
            {activeTab === "dispatch" && (
              <>
                <CardHeader>
                  <CardTitle>Dispatch Setup</CardTitle>
                  <CardDescription>Manage dropdown options for Delivery Methods used in New Dispatch.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderDynamicArray("deliveryMethods", "Delivery Methods")}
                </CardContent>
              </>
            )}

            {/* Letter Type and Branch Tab */}
            {activeTab === "letter_branch" && (
              <>
                <CardHeader>
                  <CardTitle>पत्रको किसिम र शाखा (Letter Type & Branch)</CardTitle>
                  <CardDescription>Manage Letter Types and Departments/Branches.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {renderDynamicArray("letterTypes", "पत्रको किसिम (Letter Types)")}
                  {renderDynamicArray("originatingDepartments", "शाखाहरू (Departments/Branches)")}
                </CardContent>
              </>
            )}

            <CardFooter className="bg-muted/20 border-t flex justify-between items-center p-4">
              <div>
                {isSaved && (
                  <span className="text-green-600 flex items-center gap-1 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Saved Successfully!
                  </span>
                )}
              </div>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
