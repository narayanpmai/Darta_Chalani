"use client"

import { useState, useEffect } from "react"
import { Building2, Plus, Search, Building, MoreVertical, Globe, Users, Database, Pencil, Power, PowerOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "@/i18n/routing"
import { useAuth } from "@/lib/auth-context"
import { fetchApi } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import localLevels from "@/lib/nepal-data/local_levels.json"

export default function TenantsDashboardPage() {
  const { isSuperAdmin } = useAuth()
  const [search, setSearch] = useState("")
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit Modal State
  const [editingTenant, setEditingTenant] = useState<any | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    subdomain: "",
    isActive: true
  })

  const fetchTenants = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchApi('/Tenants')
      setTenants(data || [])
    } catch (err: any) {
      setError(err.message || "Error fetching data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSuperAdmin) {
      fetchTenants()
    }
  }, [isSuperAdmin])

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p>You do not have permission to view the global tenant registry.</p>
      </div>
    )
  }

  // Look up Nepali name from local level offline dataset
  const getNepaliName = (nameEn: string) => {
    if (!nameEn) return "";
    const baseName = nameEn.split(" ")[0];
    const match = localLevels.find(l => l.name.toLowerCase() === baseName.toLowerCase());
    if (!match) return "";
    
    const typeNpMapping: { [key: number]: string } = {
      1: "महानगरपालिका",
      2: "उपमहानगरपालिका",
      3: "नगरपालिका",
      4: "गाउँपालिका"
    };
    return `${match.nepali_name} ${typeNpMapping[match.local_level_type_id] || ""}`;
  }

  const getSubdomain = (domain: string) => {
    return domain ? domain.split(".")[0] : "";
  }

  const handleOpenEdit = (t: any) => {
    setEditingTenant(t)
    setEditForm({
      name: t.name,
      subdomain: getSubdomain(t.domain),
      isActive: t.isActive
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTenant) return

    try {
      const domain = editForm.subdomain + ".lgoms.gov.np"
      await fetchApi(`/Tenants/${editingTenant.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editForm.name,
          domain: domain,
          isActive: editForm.isActive
        })
      })

      setEditingTenant(null)
      fetchTenants()
    } catch (err: any) {
      alert(err.message || "Error updating municipality")
    }
  }

  const handleToggleActive = async (t: any) => {
    try {
      await fetchApi(`/Tenants/${t.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: t.name,
          domain: t.domain,
          isActive: !t.isActive
        })
      })

      fetchTenants()
    } catch (err: any) {
      alert(err.message || "Error toggling status")
    }
  }


  const filtered = tenants.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.domain.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = tenants.filter(t => t.isActive).length
  const totalWards = tenants.reduce((acc, t) => acc + t.wards, 0)

  return (
    <div className="flex flex-col gap-6 w-full p-4 md:p-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Registered Municipalities (Tenants)
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Global management of all registered local levels in the LGOMS system.
          </p>
        </div>
        <Link href="/super-admin/create-tenant">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="w-4 h-4" /> Register New Municipality
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-1">
          <span className="text-gray-500 text-xs font-semibold uppercase">Total Tenants</span>
          <span className="text-2xl font-bold text-gray-900">{tenants.length}</span>
        </div>
        <div className="bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-1">
          <span className="text-gray-500 text-xs font-semibold uppercase">Active Tenants</span>
          <span className="text-2xl font-bold text-blue-600">{activeCount}</span>
        </div>
        <div className="bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-1">
          <span className="text-gray-500 text-xs font-semibold uppercase">Total Wards Administered</span>
          <span className="text-2xl font-bold text-purple-600">{totalWards}</span>
        </div>
        <div className="bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-1">
          <span className="text-gray-500 text-xs font-semibold uppercase">Total Databases</span>
          <span className="text-2xl font-bold text-teal-600">1 Shared</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search municipalities..." 
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {loading && <div className="text-xs text-gray-500 animate-pulse">Syncing registry...</div>}
        </div>

        {error && (
          <div className="p-4 m-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 border-b">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Municipality</th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Subdomain (URL)</th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Usage Stats</th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{getNepaliName(t.name)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-blue-600 font-medium hover:underline cursor-pointer text-xs">
                      <Globe className="w-3.5 h-3.5" />
                      {t.domain}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      Enterprise
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> {t.wards} Wards</div>
                      <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {t.users} Users</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${t.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${t.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-gray-100 inline-flex items-center justify-center rounded-md outline-none cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEdit(t)} className="cursor-pointer gap-2">
                          <Pencil className="w-3.5 h-3.5" /> Edit Municipality
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(t)} className="cursor-pointer gap-2">
                          {t.isActive ? (
                            <>
                              <PowerOff className="w-3.5 h-3.5 text-red-600" />
                              <span className="text-red-600">Deactivate</span>
                            </>
                          ) : (
                            <>
                              <Power className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600">Activate</span>
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">No municipalities found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Overlay Modal */}
      {editingTenant && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Municipality Details</h3>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-700">Municipality Name (English)</label>
                <Input 
                  value={editForm.name} 
                  onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-700">Subdomain</label>
                <div className="flex items-center">
                  <Input 
                    value={editForm.subdomain} 
                    onChange={e => setEditForm(prev => ({ ...prev, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') }))}
                    className="rounded-r-none border-r-0"
                    required 
                  />
                  <div className="bg-gray-100 border border-l-0 rounded-r-md px-3 h-10 flex items-center text-sm text-gray-500 whitespace-nowrap">
                    .lgoms.gov.np
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border mt-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">Municipality Status</span>
                  <span className="text-xs text-gray-500">Active tenants can login and process work</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${editForm.isActive ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
                >
                  <span className="bg-white w-4 h-4 rounded-full shadow" />
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setEditingTenant(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
