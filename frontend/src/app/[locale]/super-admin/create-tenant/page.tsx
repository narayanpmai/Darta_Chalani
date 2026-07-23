"use client"

import { useState } from "react"
import { 
  Building2, Globe, ShieldCheck, CreditCard, LayoutDashboard, 
  CheckCircle2, ArrowRight, ArrowLeft, Building, MapPin, 
  Database, HardDrive, Key, UserPlus, Settings2, Server
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Link } from "@/i18n/routing"
import { fetchApi } from "@/lib/api"
import provinces from "@/lib/nepal-data/provinces.json"
import districts from "@/lib/nepal-data/districts.json"
import localLevels from "@/lib/nepal-data/local_levels.json"

export default function CreateTenantWizard() {
  const [step, setStep] = useState(1)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploySuccess, setDeploySuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)


  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Municipality
    province: "",
    district: "",
    palikaType: "",
    nameNp: "",
    nameEn: "",
    wardCount: "9",
    contactEmail: "",
    contactPhone: "",
    // Step 2: Infrastructure
    subdomain: "",
    customDomain: "",
    storageQuota: "50GB",
    database: "Shared Cluster (Default)",
    // Step 3: Admin User
    adminName: "",
    adminEmail: "",
    adminUsername: "",
    adminPassword: "",
    // Step 4: License & Modules
    plan: "Premium",
    modules: ["Darta/Chalani", "e-Comment", "Sifaris", "Citizens Portal"],
    expiry: "1 Year"
  })

  const updateForm = (key: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: value };
      if (key === "nameEn") {
        const generated = value.toLowerCase().replace(/[^a-z0-9]/g, '');
        const oldGenerated = prev.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!prev.subdomain || prev.subdomain === oldGenerated) {
          updated.subdomain = generated;
        }
      }
      return updated;
    })
  }

  // Find selected province/district IDs
  const selectedProvinceObj = provinces.find(p => p.name === formData.province);
  const selectedProvinceId = selectedProvinceObj ? selectedProvinceObj.province_id : null;

  const filteredDistricts = selectedProvinceId
    ? districts.filter(d => d.province_id === selectedProvinceId)
    : [];

  const selectedDistrictObj = districts.find(d => d.name === formData.district);
  const selectedDistrictId = selectedDistrictObj ? selectedDistrictObj.district_id : null;

  const filteredLocalLevels = selectedDistrictId
    ? localLevels.filter(l => l.district_id === selectedDistrictId)
    : [];

  // Determine current selected municipality base name
  const selectedPalikaName = filteredLocalLevels.find(
    l => formData.nameEn.startsWith(l.name)
  )?.name || "";

  // Nepalese to English mapping for Local Level types
  const typeNpMapping: { [key: number]: string } = {
    1: "महानगरपालिका",
    2: "उपमहानगरपालिका",
    3: "नगरपालिका",
    4: "गाउँपालिका"
  };

  const typeEnMapping: { [key: number]: string } = {
    1: "Metropolitan City",
    2: "Sub-Metropolitan City",
    3: "Municipality",
    4: "Rural Municipality"
  };

  const typeValueMapping: { [key: number]: string } = {
    1: "Metropolitan",
    2: "Sub-Metropolitan",
    3: "Municipality",
    4: "Rural Municipality"
  };

  const handlePalikaChange = (value: string | null) => {
    if (!value) return;
    const selectedPalika = filteredLocalLevels.find(l => l.name === value);
    if (!selectedPalika) return;

    const typeId = selectedPalika.local_level_type_id;
    const formalNp = `${selectedPalika.nepali_name} ${typeNpMapping[typeId] || ""}`;
    const formalEn = `${selectedPalika.name} ${typeEnMapping[typeId] || ""}`;
    const typeVal = typeValueMapping[typeId] || "Municipality";
    const sub = selectedPalika.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    setFormData(prev => ({
      ...prev,
      nameNp: formalNp,
      nameEn: formalEn,
      palikaType: typeVal,
      subdomain: sub
    }));
  };

  const handleNext = () => setStep(s => Math.min(5, s + 1))
  const handlePrev = () => setStep(s => Math.max(1, s - 1))

  const handleDeploy = async () => {
    setIsDeploying(true)
    setError(null)
    
    const subdomainToDeploy = formData.subdomain || formData.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    try {
      await fetchApi('/Tenants', {
        method: 'POST',
        body: JSON.stringify({
          Name: formData.nameEn,
          Subdomain: subdomainToDeploy,
          WardCount: parseInt(formData.wardCount) || 9,
          AdminName: formData.adminName,
          AdminUsername: formData.adminUsername,
          AdminEmail: formData.adminEmail,
          AdminPassword: formData.adminPassword
        }),
      });

      setFormData(prev => ({ ...prev, subdomain: subdomainToDeploy }));
      setDeploySuccess(true)
    } catch (err: any) {
      setError(err.message || 'Error deploying tenant')
      console.error('Error deploying tenant:', err)
    } finally {
      setIsDeploying(false)
    }
  }


  const STEPS = [
    { id: 1, title: "Municipality Details", icon: Building2, desc: "Basic office profile" },
    { id: 2, title: "Domain & Infra", icon: Globe, desc: "Routing & storage" },
    { id: 3, title: "Admin Creation", icon: ShieldCheck, desc: "First super user" },
    { id: 4, title: "License & Modules", icon: CreditCard, desc: "Plan & features" },
    { id: 5, title: "Review & Deploy", icon: LayoutDashboard, desc: "Confirm settings" },
  ]

  if (deploySuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tenant Deployed!</h1>
          <p className="text-gray-500 mb-8">
            <span className="font-semibold text-gray-900">{formData.nameEn}</span> has been successfully provisioned. The admin account is active and {formData.wardCount} ward branches have been created.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl border mb-8 text-left text-sm flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-gray-500">System URL:</span>
              <a href={`https://${formData.subdomain}.lgoms.gov.np`} className="text-blue-600 font-medium hover:underline">
                {formData.subdomain}.lgoms.gov.np
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Admin Username:</span>
              <span className="font-mono font-medium text-gray-900">{formData.adminUsername}</span>
            </div>
          </div>
          <Link href={`/`} className="inline-flex items-center justify-center w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors">
            Go to Main Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ─── SIDEBAR ─── */}
      <div className="w-[300px] bg-white border-r hidden md:flex flex-col p-6 fixed inset-y-0 z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl shadow-md">LG</div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">Super Admin</h1>
            <p className="text-xs text-muted-foreground">New Tenant Setup</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 relative">
          <div className="absolute left-[15px] top-[15px] bottom-[15px] w-0.5 bg-gray-100 -z-10" />
          
          {STEPS.map((s, idx) => {
            const isActive = step === s.id
            const isCompleted = step > s.id
            return (
              <div key={s.id} className="flex gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 bg-white ${isActive ? "border-blue-600 text-blue-600" : isCompleted ? "border-green-500 text-green-500" : "border-gray-200 text-gray-300"}`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${isActive ? "text-gray-900" : isCompleted ? "text-gray-900" : "text-gray-400"}`}>{s.title}</h3>
                  <p className={`text-xs ${isActive ? "text-blue-600" : "text-gray-400"}`}>{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-auto pt-6 border-t text-xs text-gray-400">
          Multi-Tenant Architecture v2.0<br/>
          Secured by LGOMS e-Governance
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 md:ml-[300px] p-6 md:p-12 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{STEPS[step-1].title}</h2>
          <p className="text-gray-500 mt-1">{STEPS[step-1].desc}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 min-h-[400px]">
          
          {/* STEP 1: Municipality Details */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>Province <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.province} 
                  onValueChange={v => {
                    setFormData(prev => ({
                      ...prev,
                      province: v || "",
                      district: "",
                      palikaType: "",
                      nameNp: "",
                      nameEn: "",
                      subdomain: ""
                    }));
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Select Province" /></SelectTrigger>
                  <SelectContent>
                    {provinces.map(p => (
                      <SelectItem key={p.province_id} value={p.name}>
                        {p.nepali_name} ({p.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>District <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.district} 
                  onValueChange={v => {
                    setFormData(prev => ({
                      ...prev,
                      district: v || "",
                      nameNp: "",
                      nameEn: "",
                      subdomain: ""
                    }));
                  }}
                  disabled={!formData.province}
                >
                  <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                  <SelectContent>
                    {filteredDistricts.map(d => (
                      <SelectItem key={d.district_id} value={d.name}>
                        {d.nepali_name} ({d.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>Local Level (Municipality) <span className="text-red-500">*</span></Label>
                <Select 
                  value={selectedPalikaName} 
                  onValueChange={handlePalikaChange}
                  disabled={!formData.district}
                >
                  <SelectTrigger><SelectValue placeholder="Select Local Level" /></SelectTrigger>
                  <SelectContent>
                    {filteredLocalLevels.map(l => (
                      <SelectItem key={l.municipality_id} value={l.name}>
                        {l.nepali_name} ({l.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>Local Level Type</Label>
                <Select value={formData.palikaType} onValueChange={v => updateForm("palikaType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Metropolitan">Metropolitan City</SelectItem>
                    <SelectItem value="Sub-Metropolitan">Sub-Metropolitan City</SelectItem>
                    <SelectItem value="Municipality">Municipality</SelectItem>
                    <SelectItem value="Rural Municipality">Rural Municipality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>Municipality Name (Nepali) <span className="text-red-500">*</span></Label>
                <Input placeholder="जस्तै: काठमाडौं महानगरपालिका" value={formData.nameNp} onChange={e => updateForm("nameNp", e.target.value)} />
              </div>
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>Municipality Name (English) <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. Kathmandu Metropolitan City" value={formData.nameEn} onChange={e => updateForm("nameEn", e.target.value)} />
                <p className="text-[10px] text-muted-foreground">Will be used to auto-generate subdomain.</p>
              </div>
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>Number of Wards <span className="text-red-500">*</span></Label>
                <Input type="number" min="1" max="35" placeholder="e.g. 9" value={formData.wardCount} onChange={e => updateForm("wardCount", e.target.value)} />
                <p className="text-[10px] text-muted-foreground">System will automatically create {formData.wardCount || 0} ward branches.</p>
              </div>
            </div>
          )}

          {/* STEP 2: Domain & Infra */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="col-span-2 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-4">
                <Server className="w-8 h-8 text-blue-500 shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 text-sm">Tenant Architecture Routing</h3>
                  <p className="text-xs text-blue-700 mt-1">This tenant will be assigned a unique `tenant_id` for database isolation. Routing will be handled via Next.js middleware using the subdomain configured below.</p>
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>System Subdomain <span className="text-red-500">*</span></Label>
                <div className="flex items-center">
                  <Input placeholder="kathmandu" className="rounded-r-none border-r-0" value={formData.subdomain} onChange={e => updateForm("subdomain", e.target.value)} />
                  <div className="bg-gray-100 border border-l-0 rounded-r-md px-3 h-10 flex items-center text-sm text-gray-500 whitespace-nowrap">
                    .lgoms.gov.np
                  </div>
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>Custom Domain (Optional)</Label>
                <Input placeholder="e.g. www.kathmandu.gov.np" value={formData.customDomain} onChange={e => updateForm("customDomain", e.target.value)} />
              </div>
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>Storage Allocation</Label>
                <Select value={formData.storageQuota} onValueChange={v => updateForm("storageQuota", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25GB">25 GB (Basic)</SelectItem>
                    <SelectItem value="50GB">50 GB (Standard)</SelectItem>
                    <SelectItem value="100GB">100 GB (Premium)</SelectItem>
                    <SelectItem value="Unlimited">Unlimited (Enterprise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>Database Provisioning</Label>
                <Select value={formData.database} onValueChange={v => updateForm("database", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shared Cluster (Default)">Shared Cluster (Row-level Isolation)</SelectItem>
                    <SelectItem value="Dedicated Schema">Dedicated Database Schema</SelectItem>
                    <SelectItem value="Dedicated DB">Dedicated DB Instance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* STEP 3: Admin Creation */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="col-span-2 grid gap-2">
                <Label>Admin Full Name <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. Chief Admin Officer" value={formData.adminName} onChange={e => updateForm("adminName", e.target.value)} />
              </div>
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>Admin Username <span className="text-red-500">*</span></Label>
                <Input placeholder="admin" value={formData.adminUsername} onChange={e => updateForm("adminUsername", e.target.value)} />
              </div>
              <div className="col-span-2 md:col-span-1 grid gap-2">
                <Label>Admin Email <span className="text-red-500">*</span></Label>
                <Input type="email" placeholder="admin@palika.gov.np" value={formData.adminEmail} onChange={e => updateForm("adminEmail", e.target.value)} />
              </div>
              <div className="col-span-2 grid gap-2">
                <Label>Initial Password <span className="text-red-500">*</span></Label>
                <Input type="password" placeholder="At least 8 characters" value={formData.adminPassword} onChange={e => updateForm("adminPassword", e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">This user will be granted the 'Municipality Admin' role automatically.</p>
              </div>
            </div>
          )}

          {/* STEP 4: License & Modules */}
          {step === 4 && (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="col-span-2 grid gap-3">
                <Label>Subscription Plan</Label>
                <div className="grid grid-cols-3 gap-4">
                  {["Basic", "Premium", "Enterprise"].map(plan => (
                    <div 
                      key={plan} 
                      onClick={() => updateForm("plan", plan)}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.plan === plan ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
                    >
                      <h4 className="font-bold text-gray-900">{plan}</h4>
                      <p className="text-xs text-gray-500 mt-1">{plan === "Basic" ? "Standard features" : plan === "Premium" ? "Includes AI & GIS" : "Dedicated infra"}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 grid gap-2 mt-4">
                <Label>License Validity</Label>
                <Select value={formData.expiry} onValueChange={v => updateForm("expiry", v)}>
                  <SelectTrigger className="w-1/2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 Year">1 Year</SelectItem>
                    <SelectItem value="3 Years">3 Years</SelectItem>
                    <SelectItem value="5 Years">5 Years</SelectItem>
                    <SelectItem value="Lifetime">Lifetime (Permanent)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Deploy */}
          {step === 5 && (
            <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-50 p-6 rounded-xl border flex flex-col gap-4">
                <h3 className="font-bold text-lg text-gray-900 border-b pb-2">Deployment Summary</h3>
                
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-gray-500">Municipality Name:</div>
                  <div className="font-semibold text-gray-900">{formData.nameEn || "N/A"} ({formData.nameNp})</div>
                  
                  <div className="text-gray-500">Infrastructure:</div>
                  <div className="font-medium text-gray-900">{formData.wardCount} Wards, {formData.storageQuota} Storage</div>

                  <div className="text-gray-500">System URL:</div>
                  <div className="font-mono text-blue-600">https://{formData.subdomain || formData.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '') || "tenant"}.lgoms.gov.np</div>

                  <div className="text-gray-500">Admin Account:</div>
                  <div className="font-medium text-gray-900">{formData.adminName} ({formData.adminUsername})</div>

                  <div className="text-gray-500">License Plan:</div>
                  <div className="font-medium text-gray-900">{formData.plan} — Valid for {formData.expiry}</div>
                </div>
              </div>

              {isDeploying && (
                <div className="flex flex-col items-center justify-center py-6 text-blue-600 gap-3">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="font-medium animate-pulse">Provisioning Tenant Architecture...</p>
                  <p className="text-xs text-gray-500">Creating database records and generating ward branches.</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex flex-col gap-1">
                  <p className="font-semibold text-red-900">Deployment Failed</p>
                  <p>{error}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ─── FOOTER ACTIONS ─── */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" onClick={handlePrev} disabled={step === 1 || isDeploying} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          
          {step < 5 ? (
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8" onClick={handleNext}>
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-700 gap-2 px-8 shadow-lg shadow-green-600/20" onClick={handleDeploy} disabled={isDeploying}>
              {isDeploying ? "Deploying..." : "Deploy Tenant Now"} <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}
