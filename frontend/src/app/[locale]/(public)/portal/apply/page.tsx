"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, CheckCircle2 } from "lucide-react"

export default function PublicApplyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [trackingNo, setTrackingNo] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setTrackingNo("TRK-" + Math.floor(100000 + Math.random() * 900000))
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto mt-20 px-4">
        <Card className="border-0 shadow-lg text-center p-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
          <p className="text-slate-600 mb-6">
            Your application for recommendation has been successfully forwarded to your ward office.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-8 inline-block mx-auto">
            <span className="text-sm text-slate-500 block mb-1">Your Tracking Number:</span>
            <span className="text-2xl font-mono font-bold text-[#427DF3]">{trackingNo}</span>
          </div>
          <p className="text-sm text-slate-500 mb-6">Please save this number to check your application status later.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push('/en/portal')} variant="outline">Back to Home</Button>
            <Button onClick={() => router.push('/en/portal/status')} className="bg-primary hover:bg-primary/90 text-primary-foreground">Track Status</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 pb-20">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Apply for Recommendation</h1>
      <p className="text-slate-600 mb-8">Fill out this form to request a recommendation (सिफारिस) from your ward office.</p>

      <Card className="shadow-md border-0">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle>Application Form</CardTitle>
          <CardDescription>All fields marked with * are mandatory.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label>Service Type *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Recommendation Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="citizenship">Citizenship Recommendation</SelectItem>
                    <SelectItem value="relationship">Relationship Verification</SelectItem>
                    <SelectItem value="birth">Birth Registration</SelectItem>
                    <SelectItem value="business">Business Registration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Select Ward *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ward No. 1</SelectItem>
                    <SelectItem value="2">Ward No. 2</SelectItem>
                    <SelectItem value="3">Ward No. 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Applicant Full Name *</Label>
              <Input placeholder="e.g. Ram Bahadur Thapa" required />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label>Mobile Number *</Label>
                <Input placeholder="98XXXXXXXX" type="tel" required />
              </div>
              <div className="grid gap-2">
                <Label>Citizenship Number (if applicable)</Label>
                <Input placeholder="XX-XX-XX-XXXXX" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Additional Details / Reason *</Label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Briefly explain why you need this recommendation..."
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
