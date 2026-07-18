"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Lock, User, LogIn, Loader2, Shield, ChevronRight } from "lucide-react"


export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || "ne"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await login(username, password)
    if (result.success) {
      router.push(`/${locale}`)
    } else {
      setError(result.error || "Login failed")
    }
    setIsLoading(false)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-300/5 rounded-full blur-3xl" />

      <div className="w-full max-w-4xl z-10 grid md:grid-cols-[1fr_420px] gap-6 items-center">

        {/* Left: Branding */}
        <div className="hidden md:flex flex-col gap-6 text-slate-700 px-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">LGOMS</h1>
              <p className="text-xs text-slate-500">Local Government e-Office</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold leading-snug text-slate-800">
            डिजिटल सरकार,<br />
            <span className="text-[#427DF3]">नागरिकको सेवामा।</span>
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            AI-powered दर्ता–चलानी, ई-टिप्पणी र ई-सिफारिस प्रणालीमा स्वागत छ।
            आफ्नो प्रमाणपत्र (Credentials) प्रयोग गरी प्रवेश गर्नुहोस्।
          </p>


        </div>

        {/* Right: Login Form */}
        <Card className="w-full shadow-2xl border-0 backdrop-blur-xl bg-white/90">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="mx-auto w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">प्रवेश गर्नुहोस्</CardTitle>
            <CardDescription className="text-slate-500">
              Sign in to access the Digital Governance Platform
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-8 px-8">
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 text-center animate-pulse">
                  ⚠ {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="username">Username (प्रयोगकर्ता नाम)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="username"
                    placeholder="username लेख्नुहोस्"
                    className="pl-10 h-11"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password (गोप्य शब्द)</Label>
                  <a href="#" className="text-xs text-[#427DF3] hover:underline">भुल्नुभयो?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password लेख्नुहोस्"
                    className="pl-10 h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground mt-2 shadow-md shadow-blue-200 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    प्रवेश गर्नुहोस् (Sign In)
                  </>
                )}
              </Button>


              <div className="text-center mt-2">
                <p className="text-xs text-slate-500">
                  Authorized access only. Contact your municipality admin for credentials.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
