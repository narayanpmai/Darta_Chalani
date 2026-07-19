"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "Super Admin" | "Municipality Admin" | "Ward Chair" | "Operator"

export interface AuthUser {
  id: string
  name: string
  username: string
  role: UserRole
  tenantId?: string
  ward?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAdmin: boolean
  isSuperAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Restore session from localStorage
    const stored = localStorage.getItem("lgoms_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        const data = await res.json()
        // Map backend user fields to AuthUser
        const authUser: AuthUser = {
          id: data.user.id || data.user.Id || "",
          name: data.user.fullName || data.user.FullName || data.user.username || username,
          username: data.user.username || data.user.Username || username,
          role: mapRole(data.user.role || data.user.Role),
          tenantId: data.user.tenantId || data.user.TenantId,
        }
        localStorage.setItem("lgoms_token", data.token || data.Token)
        localStorage.setItem("lgoms_user", JSON.stringify(authUser))
        setUser(authUser)
        setIsLoading(false)
        return { success: true }
      }

      // Parse backend error message
      let errorMessage = "गलत Username वा Password छ।"
      try {
        const errData = await res.json()
        if (errData?.message === "Invalid username or password") {
          errorMessage = "गलत Username वा Password छ।"
        } else if (errData?.message) {
          errorMessage = errData.message
        }
      } catch {}

      setIsLoading(false)
      return { success: false, error: errorMessage }

    } catch (networkError) {
      setIsLoading(false)
      return {
        success: false,
        error: "Server सँग जडान हुन सकिएन। कृपया network connection जाँच्नुहोस् र पुनः प्रयास गर्नुहोस्।"
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("lgoms_user")
    localStorage.removeItem("lgoms_token")
    localStorage.removeItem("lgoms_fiscal_years")
    setUser(null)
    router.push("/ne/login")
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAdmin: user?.role === "Municipality Admin" || user?.role === "Super Admin",
      isSuperAdmin: user?.role === "Super Admin"
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

// Map backend role string to frontend UserRole type
function mapRole(role: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    "SuperAdmin": "Super Admin",
    "Super Admin": "Super Admin",
    "MunicipalityAdmin": "Municipality Admin",
    "Municipality Admin": "Municipality Admin",
    "WardChair": "Ward Chair",
    "Ward Chair": "Ward Chair",
    "Operator": "Operator",
    "Mayor": "Municipality Admin",
  }
  return roleMap[role] ?? "Operator"
}
