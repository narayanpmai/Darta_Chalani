"use client"

import { useState, useEffect } from "react"
import { Building2, MapPin, Plus, Pencil, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

interface BranchCategory {
  id: number
  name: string
  nameEn: string
  type: "ward" | "branch"
}

const SEED_BRANCHES: BranchCategory[] = [
  { id: 1,  name: "केन्द्रीय कार्यालय",  nameEn: "Central Office", type: "branch" },
  { id: 2,  name: "प्रशासन शाखा",       nameEn: "Administration", type: "branch" },
  { id: 3,  name: "वडा नं. १",           nameEn: "Ward No. 1",     type: "ward" },
  { id: 4,  name: "वडा नं. २",           nameEn: "Ward No. 2",     type: "ward" },
]

export default function WardsPage() {
  const { isAdmin, isSuperAdmin } = useAuth()
  const [mounted, setMounted] = useState(false)

  const [branches, setBranches] = useState<BranchCategory[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lgoms_branches")
      if (stored) return JSON.parse(stored)
    }
    return SEED_BRANCHES
  })

  useEffect(() => { localStorage.setItem("lgoms_branches", JSON.stringify(branches)) }, [branches])
  useEffect(() => { setMounted(true) }, [])

  // ── Branch category modal
  const [branchModal, setBranchModal] = useState(false)
  const [editBranchId, setEditBranchId] = useState<number | null>(null)
  const [bForm, setBForm] = useState({ name: "", nameEn: "", type: "ward" as "ward" | "branch" })

  const openCreateBranch = () => { setEditBranchId(null); setBForm({ name: "", nameEn: "", type: "ward" }); setBranchModal(true) }
  const openEditBranch   = (b: BranchCategory) => { setEditBranchId(b.id); setBForm({ name: b.name, nameEn: b.nameEn, type: b.type }); setBranchModal(true) }

  const handleSaveBranch = () => {
    if (!bForm.name.trim()) return
    if (editBranchId) {
      setBranches(p => p.map(b => b.id === editBranchId ? { ...b, ...bForm } : b))
    } else {
      setBranches(p => [...p, { id: Date.now(), ...bForm }])
    }
    setBranchModal(false)
  }
  
  const handleDeleteBranch = (id: number) => { 
    if (confirm("यो शाखा/वडा हटाउने?")) setBranches(p => p.filter(b => b.id !== id)) 
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col gap-6 w-full p-4 md:p-6 pb-20 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Branches & Wards Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            पालिकाका शाखा र वडाहरूको विवरण व्यवस्थापन गर्नुहोस्।
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">शाखा / वडा</h2>
              <p className="text-xs text-muted-foreground">{branches.length} शाखा/वडा परिभाषित</p>
            </div>
          </div>
          {(isAdmin || isSuperAdmin) && (
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1 text-xs h-8" onClick={openCreateBranch}>
              <Plus className="w-3.5 h-3.5" /> नयाँ वडा/शाखा थप्नुहोस्
            </Button>
          )}
        </div>

        <div className="divide-y max-h-[600px] overflow-y-auto">
          {branches.map(b => (
            <div key={b.id} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50/60 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${b.type === "ward" ? "bg-blue-100" : "bg-teal-100"}`}>
                {b.type === "ward" ? <MapPin className="w-5 h-5 text-blue-600" /> : <Building2 className="w-5 h-5 text-teal-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-gray-900">{b.name}</p>
                <p className="text-sm text-muted-foreground">{b.nameEn} · <span className={`font-medium ${b.type === "ward" ? "text-blue-600" : "text-teal-600"}`}>{b.type === "ward" ? "वडा" : "शाखा"}</span></p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEditBranch(b)} className="w-8 h-8 flex items-center justify-center rounded border border-blue-200 hover:bg-blue-50 text-blue-500 transition-colors"><Pencil className="w-4 h-4" /></button>
                {(isAdmin || isSuperAdmin) && (
                  <button onClick={() => handleDeleteBranch(b.id)} className="w-8 h-8 flex items-center justify-center rounded border border-red-200 hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            </div>
          ))}
          {branches.length === 0 && <p className="text-center py-12 text-sm text-muted-foreground">कुनै शाखा/वडा छैन।</p>}
        </div>
      </div>

      {branchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-400">
              <h2 className="font-semibold text-white">{editBranchId ? "Edit Branch/Ward" : "Create New Branch/Ward"}</h2>
              <button onClick={() => setBranchModal(false)} className="text-white/70 hover:text-white rounded-lg p-1 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" checked={bForm.type === "branch"} onChange={() => setBForm(f => ({ ...f, type: "branch" }))} className="w-4 h-4 text-blue-600" />
                    Office Branch (शाखा)
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" checked={bForm.type === "ward"} onChange={() => setBForm(f => ({ ...f, type: "ward" }))} className="w-4 h-4 text-blue-600" />
                    Ward Office (वडा)
                  </label>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Name (Nepali) <span className="text-red-500">*</span></Label>
                <Input placeholder="जस्तै: प्रशासन शाखा" value={bForm.name} onChange={e => setBForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Name (English) <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. Administration" value={bForm.nameEn} onChange={e => setBForm(f => ({ ...f, nameEn: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <Button variant="ghost" onClick={() => setBranchModal(false)}>Cancel</Button>
              <Button onClick={handleSaveBranch} className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
