"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadCloud, FileType, CheckCircle2, ScanText, FileUp, Sparkles, X } from "lucide-react"

export default function ArchiveUploadPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [ocrText, setOcrText] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
      // Simulate automatic OCR extraction when file is uploaded
      setTimeout(() => {
        setOcrText("SIMULATED OCR RESULT: Budget allocation request letter dated 2024-03-12 for Ward 1 road construction project total amount 500000.")
      }, 1500)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      router.push('/en/archive')
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-2 md:p-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Upload to Archive</h1>
          <p className="text-muted-foreground mt-1">Digitize physical records for permanent storage.</p>
        </div>
        <Button variant="ghost" onClick={() => router.back()}><X className="w-4 h-4 mr-2" /> Cancel</Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          
          <div className="flex flex-col gap-6">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gray-50/50 border-b pb-4">
                <CardTitle className="text-lg">Document Metadata</CardTitle>
                <CardDescription>Enter details to categorize this document.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-2">
                  <Label>Document Title</Label>
                  <Input placeholder="e.g. Ward 1 Road Budget Allocation" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Document Number (Ref)</Label>
                    <Input placeholder="e.g. DART-2081-001" required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Document Type</Label>
                    <Select defaultValue="darta">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="darta">Darta</SelectItem>
                        <SelectItem value="chalani">Chalani</SelectItem>
                        <SelectItem value="tippani">Tippani</SelectItem>
                        <SelectItem value="sifaris">Sifaris</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Tags (Comma separated)</Label>
                  <Input placeholder="e.g. budget, road, ward1" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gray-50/50 border-b pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ScanText className="w-5 h-5 text-indigo-500" />
                    AI Text Extraction (OCR)
                  </CardTitle>
                  <CardDescription>Extracted text is used for full-text searching.</CardDescription>
                </div>
                {fileName && !ocrText && <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />}
                {ocrText && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </CardHeader>
              <CardContent className="pt-6">
                <Textarea 
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                  placeholder="Upload a document to automatically extract text, or type manually..." 
                  className="min-h-[150px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="shadow-sm border-gray-200 h-fit">
              <CardHeader className="bg-gray-50/50 border-b pb-4">
                <CardTitle className="text-lg">File Upload</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {fileName ? (
                    <>
                      <FileType className="w-10 h-10 text-blue-500 mb-2" />
                      <p className="font-medium text-gray-900 text-sm">{fileName}</p>
                      <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </p>
                    </>
                  ) : (
                    <>
                      <FileUp className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="font-medium text-gray-700 text-sm">Click to upload file</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full bg-[#427DF3] hover:bg-blue-600 h-12 text-lg shadow-md"
              disabled={isUploading || !fileName}
            >
              {isUploading ? "Saving to Archive..." : "Save Document"}
            </Button>
          </div>
          
        </div>
      </form>
    </div>
  )
}
