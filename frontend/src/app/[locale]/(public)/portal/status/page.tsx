"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, CheckCircle2, Clock, FileText, Download } from "lucide-react"

export default function PublicStatusPage() {
  const [trackingNo, setTrackingNo] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    
    // Simulate API call to track status
    setTimeout(() => {
      setIsSearching(false)
      // Mocking a successful result
      setResult({
        trackingNo: trackingNo,
        applicantName: "Ram Bahadur Thapa",
        serviceType: "Citizenship Recommendation",
        appliedDate: "2024-03-12",
        ward: "Ward No. 1",
        status: "approved", // pending, processing, approved, rejected
      })
    }, 1000)
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 pb-20">
      <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Track Application Status</h1>
      <p className="text-slate-600 mb-8 text-center">Enter your tracking number below to check the current status of your request.</p>

      <Card className="shadow-lg border-0 mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input 
              placeholder="Enter Tracking Number (e.g. TRK-123456)" 
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              className="h-12 text-lg"
              required
            />
            <Button type="submit" disabled={isSearching} className="h-12 px-8 bg-[#427DF3] hover:bg-blue-600 shadow-md">
              {isSearching ? "Searching..." : <><Search className="w-5 h-5 mr-2"/> Track</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="shadow-md border-0 border-t-4 border-t-[#427DF3]">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Application Details</CardTitle>
                <CardDescription>Tracking No: <span className="font-mono font-bold text-slate-800">{result.trackingNo}</span></CardDescription>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                  <CheckCircle2 className="w-4 h-4" /> Approved
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-4 mb-8">
              <div>
                <p className="text-sm text-slate-500 mb-1">Applicant Name</p>
                <p className="font-medium text-slate-900">{result.applicantName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Service Requested</p>
                <p className="font-medium text-slate-900">{result.serviceType}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Applied Date</p>
                <p className="font-medium text-slate-900">{result.appliedDate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Processing Ward</p>
                <p className="font-medium text-slate-900 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" /> {result.ward}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" /> Digital Document Ready
                </h4>
                <p className="text-sm text-slate-600 mt-1">Your recommendation is approved and digitally signed.</p>
              </div>
              <Button className="bg-[#427DF3] hover:bg-blue-600 shadow-sm">
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
