"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || "ne"

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${locale}/login`)
    }
  }, [user, isLoading, router, locale])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 z-50 absolute inset-0">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">प्रमाणीकरण जाँच्दै...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect shortly
  }

  return <>{children}</>
}
