"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck, XCircle } from "lucide-react"
import { formatNepaliDate } from "@/lib/date-utils"

export default function VerificationPage() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading")

  useEffect(() => {
    // In real app, call API to verify code
    setTimeout(() => {
      if (code && code.startsWith("VCODE-")) {
        setStatus("valid")
      } else {
        setStatus("invalid")
      }
    }, 1500)
  }, [code])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">Document Verification</CardTitle>
          <CardDescription>e-Recommendation Authentication System</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-6 text-center gap-4">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-muted-foreground mt-4">Verifying document...</p>
            </div>
          )}

          {status === "valid" && (
            <div className="flex flex-col items-center gap-2 text-green-700">
              <ShieldCheck className="w-16 h-16 text-green-500 mb-2" />
              <h2 className="text-xl font-bold">Document Verified!</h2>
              <p className="text-sm text-gray-600">This document is officially issued and valid.</p>
              <div className="bg-green-50 w-full p-4 rounded-md mt-4 border border-green-200 text-left text-sm">
                <p><strong>Code:</strong> {code}</p>
                <p><strong>Issued By:</strong> काठमाडौं महानगरपालिका</p>
                <p><strong>Date:</strong> {formatNepaliDate()}</p>
              </div>
            </div>
          )}

          {status === "invalid" && (
            <div className="flex flex-col items-center gap-2 text-red-700">
              <XCircle className="w-16 h-16 text-red-500 mb-2" />
              <h2 className="text-xl font-bold">Verification Failed</h2>
              <p className="text-sm text-gray-600">This document code is invalid or expired.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
