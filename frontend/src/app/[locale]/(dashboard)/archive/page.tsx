"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UploadCloud, FileText, Download, Eye, Clock, Filter, Archive } from "lucide-react"

export default function ArchiveDashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const [archives] = useState([
    { id: 1, docNo: "DART-2081-001", type: "Darta", title: "Budget Allocation Request from Ward 1", uploadDate: "2024-03-12", uploader: "admin" },
    { id: 2, docNo: "SIF-81-09", type: "Sifaris", title: "Citizenship Recommendation - Ram", uploadDate: "2024-03-15", uploader: "ram_ward1" },
    { id: 3, docNo: "TIP-81-05", type: "Tippani", title: "Approval for road construction in Ward 3", uploadDate: "2024-03-10", uploader: "admin" },
  ])

  return (
    <div className="flex flex-col gap-6 w-full p-2 md:p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Digital Archive</h1>
          <p className="text-muted-foreground mt-1">Search and retrieve digitized historical records (डिजिटल अभिलेख).</p>
        </div>
        <Button onClick={() => router.push('/en/archive/upload')} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <UploadCloud className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50/50 border-b pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            Smart Search
          </CardTitle>
          <CardDescription>Search by Title, OCR Text, Document Number, or Tags.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="grid gap-2 flex-1">
              <label className="text-sm font-medium">Keywords</label>
              <Input 
                placeholder="e.g. Budget, DART-2081, Road construction..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid gap-2 w-full md:w-64">
              <label className="text-sm font-medium">Document Type</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Documents</SelectItem>
                  <SelectItem value="darta">Darta</SelectItem>
                  <SelectItem value="chalani">Chalani</SelectItem>
                  <SelectItem value="tippani">Tippani</SelectItem>
                  <SelectItem value="sifaris">Sifaris</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full md:w-32 bg-slate-800 hover:bg-slate-700">Search</Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
          <h2 className="font-semibold text-gray-800">Search Results</h2>
          <Button variant="outline" size="sm" className="gap-2 text-gray-600">
            <Filter className="w-4 h-4" /> Filter Options
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Document Info</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Upload Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archives.map(doc => (
                <tr key={doc.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-md">
                        <Archive className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{doc.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Ref: {doc.docNo} • Uploaded by {doc.uploader}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {doc.uploadDate}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-gray-600 hover:bg-gray-100">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {archives.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No documents found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
