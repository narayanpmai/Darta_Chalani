"use client"

import { useState, useEffect } from "react"
import {
  UserPlus, Pencil, Trash2, ShieldCheck, ArrowLeftRight,
  X, Eye, EyeOff, Search, Users as UsersIcon,
  Tags, Plus, Building2, MapPin, Settings2, Download, Printer, Key, FileText, CheckSquare, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = "Active" | "Disabled"

interface RoleCategory {
  id: number
  name: string
  description: string
  color: string        // tailwind badge classes
  scope: "palika" | "ward"  // पालिका-level or वडा-level
}

interface BranchCategory {
  id: number
  name: string
  nameEn: string
  type: "ward" | "branch"   // वडा or शाखा
}

interface StaffUser {
  id: number
  name: string
  email: string
  roleId: number
  branchId: number
  departmentId?: number
  status: Status
  joined: string
  username: string
  password?: string
  employeeCode: string
  mfaStatus: "Enabled" | "Disabled"
  lastLogin: string | null
  avatar: string | null
}

// ─── Seed: Roles ──────────────────────────────────────────────────────────────
const SEED_ROLES: RoleCategory[] = [
  { id: 1, name: "Municipality Admin", description: "पालिका स्तरको सम्पूर्ण पहुँच — सबै वडाको डाटा व्यवस्थापन।", color: "bg-purple-100 text-purple-700 border-purple-200", scope: "palika" },
  { id: 2, name: "Ward Chair",         description: "वडा स्तरको पहुँच — दर्ता, चलानी र सिफारिस अनुमोदन।",      color: "bg-blue-100 text-blue-700 border-blue-200",   scope: "ward" },
  { id: 3, name: "Operator",           description: "डाटा प्रविष्टि मात्र — दर्ता/चलानी प्रविष्टि र रेकर्ड।",  color: "bg-orange-100 text-orange-700 border-orange-200", scope: "ward" },
]

// ─── Seed: Branches/Wards ──────────────────────────────────────────────────────
const SEED_BRANCHES: BranchCategory[] = [
  { id: 1,  name: "केन्द्रीय कार्यालय",  nameEn: "Central Office", type: "branch" },
  { id: 2,  name: "प्रशासन शाखा",       nameEn: "Administration", type: "branch" },
  { id: 3,  name: "वडा नं. १",           nameEn: "Ward No. 1",     type: "ward" },
  { id: 4,  name: "वडा नं. २",           nameEn: "Ward No. 2",     type: "ward" },
]

// ─── Seed: Users ──────────────────────────────────────────────────────────────
const SEED_USERS: StaffUser[] = [
  { id: 1, name: "Admin User",  email: "admin@lgoms.gov.np",      roleId: 1, branchId: 1, departmentId: 1, status: "Active",   joined: "2082/03/15", username: "admin", password: "admin123", employeeCode: "EMP-001", mfaStatus: "Enabled", lastLogin: "2082/04/10 10:23 AM", avatar: null },
  { id: 2, name: "Ram Bahadur", email: "ram.ward1@lgoms.gov.np",  roleId: 2, branchId: 3, departmentId: 3, status: "Active",   joined: "2082/01/20", username: "ram_ward1", password: "ward123", employeeCode: "EMP-002", mfaStatus: "Disabled", lastLogin: "2082/04/09 14:10 PM", avatar: null },
  { id: 3, name: "Sita Sharma", email: "sita.op@lgoms.gov.np",    roleId: 3, branchId: 2, departmentId: 2, status: "Active",   joined: "2081/11/05", username: "sita_op", password: "op123", employeeCode: "EMP-003", mfaStatus: "Enabled", lastLogin: "2082/04/11 09:15 AM", avatar: null },
]

// ─── Color palette for new roles ──────────────────────────────────────────────
const COLOR_PALETTE = [
  "bg-teal-100 text-teal-700 border-teal-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
  "bg-green-100 text-green-700 border-green-200",
]

function todayBS(): string {
  const d = new Date()
  return `${d.getFullYear() - 57}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function UsersManagementPage() {
  const { isAdmin } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // ── Shared state
  const [activeTab, setActiveTab] = useState<"users" | "categories">("users")

  // ── Data
  const [roles, setRoles]       = useState<RoleCategory[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lgoms_roles")
      if (stored) return JSON.parse(stored)
    }
    return SEED_ROLES
  })
  const [branches, setBranches] = useState<BranchCategory[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lgoms_branches")
      if (stored) return JSON.parse(stored)
    }
    return SEED_BRANCHES
  })
  const [users, setUsers]       = useState<StaffUser[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lgoms_users_db")
      if (stored) return JSON.parse(stored)
    }
    return SEED_USERS
  })

  // Sync to localStorage
  useEffect(() => { localStorage.setItem("lgoms_roles", JSON.stringify(roles)) }, [roles])
  useEffect(() => { localStorage.setItem("lgoms_branches", JSON.stringify(branches)) }, [branches])
  useEffect(() => { localStorage.setItem("lgoms_users_db", JSON.stringify(users)) }, [users])

  // ── User table filters
  const [search, setSearch]                 = useState("")
  const [filterRoleId, setFilterRoleId]     = useState<string>("all")
  const [filterStatus, setFilterStatus]     = useState<string>("all")
  const [filterBranchId, setFilterBranchId] = useState<string>("all") // acts as Ward / Dept filter

  // ── Bulk Actions
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])

  // ── User modal
  const [userModal, setUserModal] = useState(false)
  const [modalTab, setModalTab]   = useState<"info" | "roles" | "security" | "docs">("info")
  const [editUserId, setEditUserId] = useState<number | null>(null)
  
  const [uForm, setUForm] = useState({ 
    employeeCode: "",
    name: "", 
    email: "", 
    username: "", 
    roleId: "", 
    branchId: "", 
    status: "Active" as Status,
    mfaStatus: "Disabled" as "Enabled" | "Disabled"
  })
  const [password, setPassword] = useState("")
  const [showPwd, setShowPwd]   = useState(false)
  const [uErrors, setUErrors]   = useState<Record<string, string>>({})

  // ── Role category modal
  const [roleModal, setRoleModal] = useState(false)
  const [editRoleId, setEditRoleId] = useState<number | null>(null)
  const [rForm, setRForm] = useState({ name: "", description: "", scope: "ward" as "palika" | "ward" })

  // ── Branch category modal
  const [branchModal, setBranchModal] = useState(false)
  const [editBranchId, setEditBranchId] = useState<number | null>(null)
  const [bForm, setBForm] = useState({ name: "", nameEn: "", type: "ward" as "ward" | "branch" })

  // ─────────────────────────────── USER CRUD ───────────────────────────────────
  const openCreateUser = () => {
    setEditUserId(null)
    setUForm({ employeeCode: `EMP-${Math.floor(Math.random() * 1000)}`, name: "", email: "", username: "", roleId: String(roles[0]?.id ?? ""), branchId: String(branches[0]?.id ?? ""), status: "Active", mfaStatus: "Disabled" })
    setPassword("")
    setUErrors({})
    setModalTab("info")
    setUserModal(true)
  }

  const openEditUser = (u: StaffUser) => {
    setEditUserId(u.id)
    setUForm({ 
      employeeCode: u.employeeCode || "", 
      name: u.name || "", 
      email: u.email || "", 
      username: u.username || "", 
      roleId: String(u.roleId || ""), 
      branchId: String(u.branchId || ""), 
      status: u.status || "Active", 
      mfaStatus: u.mfaStatus || "Disabled" 
    })
    setPassword("")
    setUErrors({})
    setModalTab("info")
    setUserModal(true)
  }

  const validateUser = () => {
    const e: Record<string, string> = {}
    if (!uForm.name.trim())     e.name     = "नाम आवश्यक छ"
    if (!uForm.email.trim())    e.email    = "Email आवश्यक छ"
    if (!uForm.username.trim()) e.username = "Username आवश्यक छ"
    if (!uForm.employeeCode.trim()) e.employeeCode = "Employee Code आवश्यक छ"
    if (!uForm.roleId)          e.roleId   = "Role छान्नुहोस्"
    if (!uForm.branchId)        e.branchId = "शाखा/वडा छान्नुहोस्"
    if (!editUserId && !password) e.password = "Password आवश्यक छ"
    return e
  }

  const handleSaveUser = () => {
    const e = validateUser()
    if (Object.keys(e).length) { setUErrors(e); setModalTab("info"); return }
    if (editUserId) {
      setUsers(prev => prev.map(u => u.id === editUserId
        ? { ...u, employeeCode: uForm.employeeCode, name: uForm.name, email: uForm.email, username: uForm.username, roleId: Number(uForm.roleId), branchId: Number(uForm.branchId), status: uForm.status, mfaStatus: uForm.mfaStatus, ...(password ? { password } : {}) }
        : u))
    } else {
      setUsers(prev => [...prev, { id: Date.now(), employeeCode: uForm.employeeCode, name: uForm.name, email: uForm.email, username: uForm.username, password, roleId: Number(uForm.roleId), branchId: Number(uForm.branchId), departmentId: Number(uForm.branchId), status: uForm.status, mfaStatus: uForm.mfaStatus, joined: todayBS(), lastLogin: null, avatar: null }])
    }
    setUserModal(false)
  }

  const handleDeleteUser   = (id: number) => { if (confirm("यो user हटाउने?")) setUsers(p => p.filter(u => u.id !== id)) }

  // Bulk Actions
  const toggleUserSelection = (id: number) => {
    setSelectedUserIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }
  const toggleSelectAll = () => {
    if (selectedUserIds.length === filtered.length) setSelectedUserIds([])
    else setSelectedUserIds(filtered.map(u => u.id))
  }
  const handleBulkActivate = () => {
    setUsers(p => p.map(u => selectedUserIds.includes(u.id) ? { ...u, status: "Active" } : u))
    setSelectedUserIds([])
  }
  const handleBulkDeactivate = () => {
    setUsers(p => p.map(u => selectedUserIds.includes(u.id) ? { ...u, status: "Disabled" } : u))
    setSelectedUserIds([])
  }

  // ─────────────────────────────── ROLE CRUD ───────────────────────────────────
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
  const handleDeleteRole = (id: number) => { if (confirm("यो role हटाउने?")) setRoles(p => p.filter(r => r.id !== id)) }

  // ─────────────────────────────── BRANCH CRUD ─────────────────────────────────
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
  const handleDeleteBranch = (id: number) => { if (confirm("यो शाखा/वडा हटाउने?")) setBranches(p => p.filter(b => b.id !== id)) }

  // ─────────────────────────────── FILTERED USERS ──────────────────────────────
  const filtered = users.filter(u => {
    const matchSearch = [u.name, u.email, u.username, u.employeeCode].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchRole   = filterRoleId === "all" || String(u.roleId) === filterRoleId
    const matchStatus = filterStatus === "all" || u.status === filterStatus
    const matchBranch = filterBranchId === "all" || String(u.branchId) === filterBranchId
    return matchSearch && matchRole && matchStatus && matchBranch
  })

  const getRole   = (id: number) => roles.find(r => r.id === id)
  const getBranch = (id: number) => branches.find(b => b.id === id)

  // ─────────────────────────────── SELECTED ROLE SCOPE ────────────────────────
  const selectedRole = roles.find(r => r.id === Number(uForm.roleId))
  const isPalikaScope = selectedRole?.scope === "palika"

  // ─────────────────────────────── STATS ───────────────────────────────────────
  const stats = {
    total:  users.length,
    active: users.filter(u => u.status === "Active").length,
    roles:  roles.length,
    branches: branches.length,
  }

  if (!mounted) return null

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col gap-6 w-full p-4 md:p-6 pb-20">

      {/* ── Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            User Management &amp; Access Control
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            पालिका र वडाका कर्मचारीहरूको पहुँच तथा profile व्यवस्थापन गर्नुहोस्।
          </p>
        </div>
        {activeTab === "users" && (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shrink-0" onClick={openCreateUser}>
            <UserPlus className="w-4 h-4" /> + Create New Staff
          </Button>
        )}
      </div>

      {/* ── Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "जम्मा Users",   value: stats.total,    color: "bg-slate-50  border-slate-200  text-slate-700" },
          { label: "सक्रिय",        value: stats.active,   color: "bg-green-50  border-green-200  text-green-700" },
          { label: "Role/पद",       value: stats.roles,    color: "bg-purple-50 border-purple-200 text-purple-700" },
          { label: "शाखा/वडा",      value: stats.branches, color: "bg-blue-50   border-blue-200   text-blue-700" },
        ].map(c => (
          <div key={c.label} className={`rounded-xl border p-4 ${c.color}`}>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-xs font-medium mt-0.5 opacity-80">{c.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {([
          { key: "users",      label: "System Users",  Icon: UsersIcon },
          { key: "categories", label: "Categories",    Icon: Tags },
        ] as const).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* ══════════════════ TAB: SYSTEM USERS ══════════════════ */}
      {activeTab === "users" && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b">
            <p className="font-semibold text-gray-800 flex items-center gap-2 shrink-0">
              <UsersIcon className="w-4 h-4 text-blue-500" /> Users ({filtered.length})
            </p>

            <div className="flex flex-1 gap-2 sm:ml-auto flex-wrap">
              <div className="relative flex-1 min-w-[150px]">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search user..." className="pl-8 h-9 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              
              <Select value={filterRoleId} onValueChange={(val) => setFilterRoleId(val || "all")}>
                <SelectTrigger className="h-9 w-[120px] text-xs">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={filterBranchId} onValueChange={(val) => setFilterBranchId(val || "all")}>
                <SelectTrigger className="h-9 w-[120px] text-xs">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val || "all")}>
                <SelectTrigger className="h-9 w-[110px] text-xs">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>

              {/* Bulk Actions Dropdown */}
              {selectedUserIds.length > 0 && (
                <div className="flex items-center gap-2 pl-2 border-l ml-2">
                  <Button size="sm" variant="outline" className="h-9 text-xs gap-1 border-green-200 text-green-600 hover:bg-green-50" onClick={handleBulkActivate}>
                    <CheckSquare className="w-3.5 h-3.5" /> Activate
                  </Button>
                  <Button size="sm" variant="outline" className="h-9 text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50" onClick={handleBulkDeactivate}>
                    <X className="w-3.5 h-3.5" /> Deactivate
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedUserIds.length === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  {["USER PROFILE", "EMP CODE", "OFFICE / WARD", "ROLE", "STATUS", "MFA", "LAST LOGIN", "ACTIONS"].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="text-center py-12 text-muted-foreground text-sm">No users found.</td></tr>
                )}
                {filtered.map(u => {
                  const role   = getRole(u.roleId)
                  const branch = getBranch(u.branchId)
                  return (
                    <tr key={u.id} className={`border-b hover:bg-gray-50/60 transition-colors ${selectedUserIds.includes(u.id) ? "bg-blue-50/30" : ""}`}>
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={selectedUserIds.includes(u.id)}
                          onChange={() => toggleUserSelection(u.id)}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 leading-tight">{u.name}</span>
                          <span className="text-[10px] text-gray-500">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs font-mono">{u.employeeCode}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                        {branch?.type === "ward" ? <MapPin className="w-3 h-3 inline mr-1 text-blue-500" /> : <Building2 className="w-3 h-3 inline mr-1 text-teal-500" />}
                        {branch?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {role && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${role.color}`}>
                            <ShieldCheck className="w-3 h-3" /> {role.name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${u.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-green-500" : "bg-red-500"}`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {u.mfaStatus === "Enabled" 
                          ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">Enabled</span>
                          : <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">Disabled</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-[10px]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {u.lastLogin || "Never"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button title="Edit Profile" onClick={() => openEditUser(u)} className="w-7 h-7 flex items-center justify-center rounded border border-blue-200 hover:bg-blue-50 text-blue-500 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          {isAdmin && <button title="Delete" onClick={() => handleDeleteUser(u.id)} className="w-7 h-7 flex items-center justify-center rounded border border-red-200 hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t bg-gray-50/50 text-xs text-muted-foreground flex justify-between items-center">
            <span>Showing {filtered.length} of {users.length} users</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-7 text-xs px-2 gap-1"><Download className="w-3 h-3" /> Export Excel</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs px-2 gap-1"><Printer className="w-3 h-3" /> Print</Button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ TAB: CATEGORIES ══════════════════ */}
      {activeTab === "categories" && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* ── Role / पद Panel */}
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
              {isAdmin && (
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 gap-1 text-xs h-8" onClick={openCreateRole}>
                  <Plus className="w-3.5 h-3.5" /> नयाँ Role
                </Button>
              )}
            </div>

            <div className="divide-y">
              {roles.map(r => (
                <div key={r.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                  <span className={`mt-0.5 inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${r.color}`}>{r.name}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 line-clamp-2">{r.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {r.scope === "palika" ? "📌 पालिका स्तर" : "📍 वडा स्तर"}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEditRole(r)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-blue-50 text-blue-500"><Pencil className="w-3 h-3" /></button>
                    {isAdmin && <button onClick={() => handleDeleteRole(r.id)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-red-400"><Trash2 className="w-3 h-3" /></button>}
                  </div>
                </div>
              ))}
              {roles.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">कुनै role छैन।</p>}
            </div>
          </div>

          {/* ── शाखा / वडा Panel */}
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
              {isAdmin && (
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1 text-xs h-8" onClick={openCreateBranch}>
                  <Plus className="w-3.5 h-3.5" /> नयाँ थप्नुहोस्
                </Button>
              )}
            </div>

            <div className="divide-y max-h-[420px] overflow-y-auto">
              {branches.map(b => (
                <div key={b.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${b.type === "ward" ? "bg-blue-100" : "bg-teal-100"}`}>
                    {b.type === "ward" ? <MapPin className="w-3.5 h-3.5 text-blue-600" /> : <Building2 className="w-3.5 h-3.5 text-teal-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.nameEn} · <span className={`font-medium ${b.type === "ward" ? "text-blue-600" : "text-teal-600"}`}>{b.type === "ward" ? "वडा" : "शाखा"}</span></p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEditBranch(b)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-blue-50 text-blue-500"><Pencil className="w-3 h-3" /></button>
                    {isAdmin && <button onClick={() => handleDeleteBranch(b.id)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-red-400"><Trash2 className="w-3 h-3" /></button>}
                  </div>
                </div>
              ))}
              {branches.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">कुनै शाखा/वडा छैन।</p>}
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: User Profile Modal (Multi-Tab) ══════════════════════════════════════════ */}
      {userModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-[#427DF3] to-blue-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-lg">
                  {uForm.name ? uForm.name.charAt(0).toUpperCase() : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="font-semibold text-white text-lg leading-none">{editUserId ? uForm.name : "New User Profile"}</h2>
                  <p className="text-blue-100 text-xs mt-1">{editUserId ? uForm.employeeCode : "Fill details to create staff"}</p>
                </div>
              </div>
              <button onClick={() => setUserModal(false)} className="text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b px-6 bg-slate-50/50">
              {[
                { id: "info", icon: UsersIcon, label: "Personal Info" },
                { id: "roles", icon: ShieldCheck, label: "Roles & Office" },
                { id: "security", icon: Key, label: "Security & Login" },
                { id: "docs", icon: FileText, label: "Documents" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setModalTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    modalTab === tab.id 
                      ? "border-[#427DF3] text-[#427DF3] bg-blue-50/50" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  }`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              
              {/* TAB 1: INFO */}
              {modalTab === "info" && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="grid gap-1.5 col-span-2 sm:col-span-1">
                    <Label className="text-xs font-semibold text-gray-700">Employee Code <span className="text-red-500">*</span></Label>
                    <Input placeholder="EMP-001" value={uForm.employeeCode} onChange={e => setUForm(f => ({ ...f, employeeCode: e.target.value }))} className={uErrors.employeeCode ? "border-red-400" : ""} />
                    {uErrors.employeeCode && <p className="text-[10px] text-red-500">{uErrors.employeeCode}</p>}
                  </div>
                  <div className="grid gap-1.5 col-span-2 sm:col-span-1">
                    <Label className="text-xs font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></Label>
                    <Input placeholder="Hari Prasad" value={uForm.name} onChange={e => setUForm(f => ({ ...f, name: e.target.value }))} className={uErrors.name ? "border-red-400" : ""} />
                    {uErrors.name && <p className="text-[10px] text-red-500">{uErrors.name}</p>}
                  </div>
                  <div className="grid gap-1.5 col-span-2 sm:col-span-1">
                    <Label className="text-xs font-semibold text-gray-700">Username <span className="text-red-500">*</span></Label>
                    <Input placeholder="hari_k" value={uForm.username} onChange={e => setUForm(f => ({ ...f, username: e.target.value }))} className={uErrors.username ? "border-red-400" : ""} />
                  </div>
                  <div className="grid gap-1.5 col-span-2 sm:col-span-1">
                    <Label className="text-xs font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></Label>
                    <Input type="email" placeholder="hari@lgoms.gov.np" value={uForm.email} onChange={e => setUForm(f => ({ ...f, email: e.target.value }))} className={uErrors.email ? "border-red-400" : ""} />
                  </div>
                  {editUserId && (
                    <div className="grid gap-1.5 col-span-2 sm:col-span-1 mt-2">
                      <Label className="text-xs font-semibold text-gray-700">Account Status</Label>
                      <Select value={uForm.status} onValueChange={v => setUForm(f => ({ ...f, status: v as Status }))}>
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active"><span className="text-green-600 font-medium">✅ Active User</span></SelectItem>
                          <SelectItem value="Disabled"><span className="text-red-600 font-medium">🔴 Disabled User</span></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ROLES & OFFICE */}
              {modalTab === "roles" && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <div className="col-span-2 p-4 bg-purple-50 rounded-xl border border-purple-100 flex gap-4">
                    <ShieldCheck className="w-8 h-8 text-purple-500 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-purple-900 text-sm">Access Control</h3>
                      <p className="text-xs text-purple-700 mt-1">Assigning a role automatically grants predefined permissions. A user can be restricted to a specific Ward or granted Palika-wide access depending on the Role Scope.</p>
                    </div>
                  </div>

                  <div className="grid gap-1.5 col-span-2 sm:col-span-1">
                    <Label className="text-xs font-semibold text-gray-700">Assigned Role <span className="text-red-500">*</span></Label>
                    <Select value={uForm.roleId} onValueChange={v => setUForm(f => ({ ...f, roleId: v || "" }))}>
                      <SelectTrigger className={uErrors.roleId ? "border-red-400 h-10" : "h-10"}>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(r => (
                          <SelectItem key={r.id} value={String(r.id)}>
                            <div className="flex items-center gap-2">
                              {r.name} <span className="text-muted-foreground text-[10px]">({r.scope})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {!isPalikaScope && (
                    <div className="grid gap-1.5 col-span-2 sm:col-span-1">
                      <Label className="text-xs font-semibold text-gray-700">Office / Ward Branch <span className="text-red-500">*</span></Label>
                      <Select value={uForm.branchId} onValueChange={v => setUForm(f => ({ ...f, branchId: v || "" }))}>
                        <SelectTrigger className={uErrors.branchId ? "border-red-400 h-10" : "h-10"}>
                          <SelectValue placeholder="Select Office" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map(b => (
                            <SelectItem key={b.id} value={String(b.id)}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SECURITY */}
              {modalTab === "security" && (
                <div className="grid gap-6">
                  {!editUserId && (
                    <div className="grid gap-1.5 w-1/2">
                      <Label className="text-xs font-semibold text-gray-700">Temporary Password <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input type={showPwd ? "text" : "password"} placeholder="Minimum 8 characters" value={password} onChange={e => setPassword(e.target.value)} className={`pr-10 h-10 ${uErrors.password ? "border-red-400" : ""}`} />
                        <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-3 text-muted-foreground hover:text-gray-700">
                          {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">User will be prompted to change this on first login.</p>
                    </div>
                  )}
                  {editUserId && (
                    <div className="grid gap-1.5 w-1/2">
                      <Label className="text-xs font-semibold text-gray-700">Reset Password</Label>
                      <div className="relative">
                        <Input type={showPwd ? "text" : "password"} placeholder="Type new password to reset" value={password} onChange={e => setPassword(e.target.value)} className={`pr-10 h-10`} />
                        <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-3 text-muted-foreground hover:text-gray-700">
                          {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-orange-600">Leave blank if you do not want to reset the password.</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-3">Multi-Factor Authentication (MFA)</h4>
                    <div className="flex items-center gap-4">
                      <Select value={uForm.mfaStatus} onValueChange={v => setUForm(f => ({ ...f, mfaStatus: v as "Enabled" | "Disabled" }))}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Enabled">MFA Enabled</SelectItem>
                          <SelectItem value="Disabled">MFA Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Require OTP sent to email upon login.</p>
                    </div>
                  </div>

                  {editUserId && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-semibold mb-3">Login Activity</h4>
                      <div className="bg-slate-50 p-4 rounded-xl border text-sm flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last Login:</span>
                          <span className="font-medium text-gray-900">{users.find(u => u.id === editUserId)?.lastLogin || "Never"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last IP Address:</span>
                          <span className="font-medium text-gray-900 font-mono">192.168.1.45</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: DOCS */}
              {modalTab === "docs" && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 text-gray-300 mb-3" />
                  <h3 className="font-medium text-gray-900">No Documents Uploaded</h3>
                  <p className="text-xs mt-1 max-w-sm">Upload citizenship, contract letter, or digital signature image to attach it to this user's profile.</p>
                  <Button variant="outline" className="mt-4 gap-2" size="sm">
                    <Plus className="w-4 h-4" /> Upload Document
                  </Button>
                </div>
              )}

            </div>

            <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
              <p className="text-xs text-muted-foreground">Ensure all required fields (*) are filled.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setUserModal(false)}>Cancel</Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8" onClick={handleSaveUser}>
                  {editUserId ? "Save Profile Changes" : "Create User"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: Create/Edit Role ══════════════════════════════════════════ */}
      {roleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-purple-600 to-purple-500">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><Settings2 className="w-4 h-4 text-white" /></div>
                <h2 className="font-semibold text-white text-base">{editRoleId ? "Role Edit" : "नयाँ Role / पद"}</h2>
              </div>
              <button onClick={() => setRoleModal(false)} className="text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1.5"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-gray-700">Role नाम <span className="text-red-500">*</span></Label>
                <Input placeholder="जस्तै: Revenue Inspector" value={rForm.name} onChange={e => setRForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-gray-700">विवरण</Label>
                <Input placeholder="यो role को काम के हो..." value={rForm.description} onChange={e => setRForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-gray-700">स्तर (Scope)</Label>
                <Select value={rForm.scope} onValueChange={v => setRForm(f => ({ ...f, scope: v as "palika" | "ward" }))}>
                  <SelectTrigger>
                    <SelectValue>
                      {rForm.scope === "palika" ? "📌 पालिका स्तर" : "📍 वडा स्तर"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="palika">📌 पालिका स्तर — Central Office पहुँच</SelectItem>
                    <SelectItem value="ward">📍 वडा स्तर — वडा/शाखा तोक्नु पर्छ</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">पालिका स्तर चुन्दा user बनाउँदा शाखा/वडा छान्नु पर्दैन।</p>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t bg-gray-50">
              <Button variant="outline" className="flex-1" onClick={() => setRoleModal(false)}>रद्द</Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleSaveRole} disabled={!rForm.name.trim()}>
                {editRoleId ? "सुरक्षित गर्नुहोस्" : "Role सिर्जना गर्नुहोस्"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: Create/Edit Branch/Ward ══════════════════════════════════ */}
      {branchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-500">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><MapPin className="w-4 h-4 text-white" /></div>
                <h2 className="font-semibold text-white text-base">{editBranchId ? "शाखा/वडा Edit" : "नयाँ शाखा / वडा"}</h2>
              </div>
              <button onClick={() => setBranchModal(false)} className="text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1.5"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-gray-700">नाम (नेपाली) <span className="text-red-500">*</span></Label>
                <Input placeholder="जस्तै: वडा नं. ९" value={bForm.name} onChange={e => setBForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-gray-700">Name (English)</Label>
                <Input placeholder="e.g. Ward No. 9" value={bForm.nameEn} onChange={e => setBForm(f => ({ ...f, nameEn: e.target.value }))} />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-gray-700">प्रकार</Label>
                <Select value={bForm.type} onValueChange={v => setBForm(f => ({ ...f, type: v as "ward" | "branch" }))}>
                  <SelectTrigger>
                    <SelectValue>
                      {bForm.type === "ward" ? "🗺️ वडा (Ward)" : "🏢 शाखा (Branch)"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ward"><div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-500" /> वडा (Ward)</div></SelectItem>
                    <SelectItem value="branch"><div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-teal-500" /> शाखा (Branch/Department)</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t bg-gray-50">
              <Button variant="outline" className="flex-1" onClick={() => setBranchModal(false)}>रद्द</Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSaveBranch} disabled={!bForm.name.trim()}>
                {editBranchId ? "सुरक्षित गर्नुहोस्" : "शाखा/वडा थप्नुहोस्"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
