"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "Municipality Admin" | "Ward Chair" | "Operator"

export interface AuthUser {
  id: number
  name: string
  username: string
  role: UserRole
  ward?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// Demo users for local testing (until backend is connected)
const DEMO_USERS: (AuthUser & { password: string })[] = [
  { id: 1, name: "Admin User", username: "admin", password: "admin123", role: "Municipality Admin" },
  { id: 2, name: "Ram Bahadur", username: "ram_ward1", password: "ward123", role: "Ward Chair", ward: "1" },
  { id: 3, name: "Sita Sharma", username: "sita_op", password: "op123", role: "Operator", ward: "2" },
]

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

    let backendError = "गलत Username वा Password छ।"
    
    // Try real backend first
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        signal: AbortSignal.timeout(3000),
      })

      if (res.ok) {
        const data = await res.json()
        const authUser: AuthUser = data.user
        localStorage.setItem("lgoms_token", data.token)
        localStorage.setItem("lgoms_user", JSON.stringify(authUser))
        setUser(authUser)
        setIsLoading(false)
        return { success: true }
      } else {
        const errData = await res.json().catch(() => null)
        if (errData && errData.message) {
           backendError = errData.message === "Invalid username or password" ? "गलत Username वा Password छ।" : errData.message
        }
      }
    } catch {
      // Backend unavailable – fall through to demo mode
    }

    // Demo mode fallback
    const storedUsers = localStorage.getItem("lgoms_users_db")
    const usersList = storedUsers ? JSON.parse(storedUsers) : []

    // Allow login by username OR email in local DB
    let found = usersList.find((u: any) => (u.username === username || u.email === username) && u.password === password)
    
    // Fallback for default accounts if they were cached without passwords previously
    if (!found) {
      found = DEMO_USERS.find(u => (u.username === username || (u as any).email === username) && u.password === password)
    }

    if (found) {
      if (found.status === "Disabled") {
        setIsLoading(false)
        return { success: false, error: "यो खाता निष्कृय (Disabled) गरिएको छ।" }
      }

      const storedRoles = localStorage.getItem("lgoms_roles")
      const rolesList = storedRoles ? JSON.parse(storedRoles) : []
      const roleObj = found.roleId ? rolesList.find((r: any) => r.id === found.roleId) : null
      
      const storedBranches = localStorage.getItem("lgoms_branches")
      const branchesList = storedBranches ? JSON.parse(storedBranches) : []
      const branchObj = found.branchId ? branchesList.find((b: any) => b.id === found.branchId) : null

      const authUser: AuthUser = {
        id: found.id,
        name: found.name,
        username: found.username,
        role: roleObj ? roleObj.name : (found.role || "Operator"),
        ward: branchObj?.type === "ward" ? branchObj.nameEn.replace(/\D/g, '') : (found.ward || "0")
      }

      localStorage.setItem("lgoms_user", JSON.stringify(authUser))
      setUser(authUser)
      setIsLoading(false)
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: backendError }
  }

  const logout = () => {
    localStorage.removeItem("lgoms_user")
    localStorage.removeItem("lgoms_token")
    setUser(null)
    router.push("/ne/login")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin: user?.role === "Municipality Admin" }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
