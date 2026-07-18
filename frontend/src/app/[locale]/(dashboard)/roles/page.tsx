"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, Plus, Pencil, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

interface RoleCategory {
  id: number
  name: string
  description: string
  color: string
  scope: "palika" | "ward"
}

const SEED_ROLES: RoleCategory[] = [
  { id: 1, name: "Municipality Admin", description: "पालिका स्तरको सम्पूर्ण पहुँच — सबै वडाको डाटा व्यवस्थापन।", color: "bg-purple-100 text-purple-700 border-purple-200", scope: "palika" },
  { id: 2, name: "Ward Chair",         description: "वडा स्तरको पहुँच — दर्ता, चलानी र सिफारिस अनुमोदन।",      color: "bg-blue-100 text-blue-700 border-blue-200",   scope: "ward" },
  { id: 3, name: "Operator",           description: "डाटा प्रविष्टि मात्र — दर्ता/चलानी प्रविष्टि र रेकर्ड।",  color: "bg-orange-100 text-orange-700 border-orange-200", scope: "ward" },
]

const COLOR_PALETTE = [
  "bg-teal-100 text-teal-700 border-teal-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
  "bg-green-100 text-green-700 border-green-200",
]

export default function RolesPage() {
  const { isAdmin, isSuperAdmin } = useAuth()
  const [mounted, setMounted] = useState(false)

  const [roles, setRoles] = useState<RoleCategory[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lgoms_roles")
      if (stored) return JSON.parse(stored)
    }
    return SEED_ROLES
  })

  useEffect(() => { localStorage.setItem("lgoms_roles", JSON.stringify(roles)) }, [roles])
  useEffect(() => { setMounted(true) }, [])

  // ── Role category modal
  const [roleModal, setRoleModal] = useState(false)
  const [editRoleId, setEditRoleId] = useState<number | null>(null)
  const [rForm, setRForm] = useState({ name: "", description: "", scope: "ward" as "palika" | "ward" })

  const openCreateRole = () => { setEditRoleId(null); setRForm({ name: "", description: "", scope: "ward" }); setRoleModal(true) }
  const openEditRole   = (r: RoleCategory) => { setEditRoleId(r.id); setRForm({ name: r.name, description: r.description, scope: r.scope }); setRoleModal(true) }

  const handleSaveRole = () => {
    if (!rForm.name.trim()) return
    if (editRoleId) {
      setRoles(p => p.map(r => r.id === editRoleId ? { ...r, ...rForm } : r))
    } else {
      const color = COLOR_PALETTE[roles.length % COLOR_PALETTE.length]
      setRoles(p => [...p, { id: Date.now(), ...rForm, color }])
    }
    setRoleModal(false)
  }
  
  const handleDeleteRole = (id: number) => { 
    if (confirm("यो role हटाउने?")) setRoles(p => p.filter(r => r.id !== id)) 
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col gap-6 w-full p-4 md:p-6 pb-20 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Roles & Permissions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            प्रणाली प्रयोगकर्ताहरूको पहुँच (Access Control) व्यवस्थापन गर्नुहोस्।
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">Role / पद</h2>
              <p className="text-xs text-muted-foreground">{roles.length} roles परिभाषित</p>
            </div>
          </div>
          {(isAdmin || isSuperAdmin) && (
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 gap-1 text-xs h-8" onClick={openCreateRole}>
              <Plus className="w-3.5 h-3.5" /> नयाँ Role
            </Button>
          )}
        </div>

        <div className="divide-y">
          {roles.map(r => (
            <div key={r.id} className="flex items-start gap-3 px-5 py-5 hover:bg-gray-50/60 transition-colors">
              <span className={`mt-0.5 inline-flex px-3 py-1 rounded-full text-sm font-semibold border shrink-0 ${r.color}`}>{r.name}</span>
              <div className="flex-1 min-w-0 ml-4">
                <p className="text-base text-gray-700">{r.description}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {r.scope === "palika" ? "📌 पालिका स्तर (Palika Level)" : "📍 वडा स्तर (Ward Level)"}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEditRole(r)} className="w-8 h-8 flex items-center justify-center rounded border border-blue-200 hover:bg-blue-50 text-blue-500"><Pencil className="w-4 h-4" /></button>
                {(isAdmin || isSuperAdmin) && (
                  <button onClick={() => handleDeleteRole(r.id)} className="w-8 h-8 flex items-center justify-center rounded border border-red-200 hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            </div>
          ))}
          {roles.length === 0 && <p className="text-center py-12 text-sm text-muted-foreground">कुनै role छैन।</p>}
        </div>
      </div>

      {roleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-purple-600 to-purple-400">
              <h2 className="font-semibold text-white">{editRoleId ? "Edit Role" : "Create New Role"}</h2>
              <button onClick={() => setRoleModal(false)} className="text-white/70 hover:text-white rounded-lg p-1 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid gap-4">
              <div className="grid gap-2">
                <Label>Role Name <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. Ward Secretary" value={rForm.name} onChange={e => setRForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Description <span className="text-red-500">*</span></Label>
                <Input placeholder="Brief description of permissions" value={rForm.description} onChange={e => setRForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Access Scope</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" checked={rForm.scope === "palika"} onChange={() => setRForm(f => ({ ...f, scope: "palika" }))} className="w-4 h-4 text-purple-600" />
                    Palika Level (सम्पूर्ण पहुँच)
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" checked={rForm.scope === "ward"} onChange={() => setRForm(f => ({ ...f, scope: "ward" }))} className="w-4 h-4 text-purple-600" />
                    Ward Level (वडा मात्र)
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <Button variant="ghost" onClick={() => setRoleModal(false)}>Cancel</Button>
              <Button onClick={handleSaveRole} className="bg-purple-600 hover:bg-purple-700 text-white">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
