"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, FolderOpen, FileText, Download, Filter, Eye } from "lucide-react"

const mockFiles = [
  { id: 1, name: "Citizenship_Application_Ram_Bahadur.pdf", type: "Tippani", date: "2026-07-11", size: "2.4 MB" },
  { id: 2, name: "Budget_Allocation_Ward_15.pdf", type: "Chalani", date: "2026-07-10", size: "4.1 MB" },
  { id: 3, name: "Tender_Document_Road_Construction.docx", type: "Darta", date: "2026-07-09", size: "1.2 MB" },
  { id: 4, name: "Leave_Request_Hari_Sharma.pdf", type: "Tippani", date: "2026-07-08", size: "0.8 MB" },
]

export default function FilesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Digital Archive & Files</h1>
          <p className="text-muted-foreground mt-1">Search through OCR-indexed documents, dartas, and chalanis.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2"><FolderOpen className="h-4 w-4" /> Upload Document</Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Advanced Search</CardTitle>
          <CardDescription>Search across all extracted text in uploaded documents (OCR Powered).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Type keywords found inside the documents..." className="pl-9" />
            </div>
            <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Search Archive</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b bg-muted/50 text-sm">
              <div className="col-span-5">File Name</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Size</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {mockFiles.map((file) => (
                <div key={file.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm hover:bg-muted/20 transition-colors">
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      {file.type}
                    </span>
                  </div>
                  <div className="col-span-2 text-muted-foreground">{file.date}</div>
                  <div className="col-span-1 text-muted-foreground">{file.size}</div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="View Document">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Download">
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
