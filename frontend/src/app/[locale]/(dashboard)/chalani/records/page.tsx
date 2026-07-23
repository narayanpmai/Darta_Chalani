"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { fetchApi } from "@/lib/api"
import { BookOpen } from "lucide-react"

interface ChalaniRecord {
  id: string;
  chalaniNumber: string;
  miti: string;
  receiverName: string;
  receiverAddress: string;
  subject: string;
  peonBookNumber: string;
  dispatchTime: string;
  orderOrDecision: string;
  remarks: string;
}

export default function ChalaniRecordsPage() {
  const { user } = useAuth()
  const [activeFy, setActiveFy] = useState("")
  const [records, setRecords] = useState<ChalaniRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fyStore = localStorage.getItem("lgoms_fiscal_years")
    if (fyStore) {
      const parsed = JSON.parse(fyStore)
      const active = parsed.find((f: any) => f.isActive)
      if (active) setActiveFy(active.name)
    } else {
      setActiveFy("२०८२/०८३") // fallback
    }
  }, [])

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await fetchApi('/Chalani')
        if (Array.isArray(data)) {
          setRecords(data)
        } else {
          setRecords([])
        }
      } catch (error) {
        console.error("Failed to fetch Chalani records:", error)
        setRecords([])
      } finally {
        setLoading(false)
      }
    }

    if (user && activeFy) {
      fetchRecords()
    }
  }, [user, activeFy])


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">चलानी किताब</h1>
        <p className="text-muted-foreground mt-2">
          नेपाल सरकारको ढाँचा अनुसार सुरक्षित गरिएका सबै चलानी विवरणहरू।
        </p>
      </div>

      <Card>
        <CardHeader className="bg-primary/5 pb-4 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            चलानी रेकर्डहरू ({activeFy || "..."})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="whitespace-nowrap font-semibold">क्र.सं.</TableHead>
                  <TableHead className="whitespace-nowrap font-semibold">चलानी नं.</TableHead>
                  <TableHead className="whitespace-nowrap font-semibold">चलानी मिति</TableHead>
                  <TableHead className="whitespace-nowrap font-semibold">पठाउने व्यक्ति /संस्थाको नाम</TableHead>
                  <TableHead className="whitespace-nowrap font-semibold">पठाउने व्यक्ति /संस्थाको ठेगाना</TableHead>
                  <TableHead className="whitespace-nowrap font-semibold">बिषय</TableHead>
                  <TableHead className="whitespace-nowrap font-semibold">परिचर किताब नं.</TableHead>
                  <TableHead className="whitespace-nowrap font-semibold">चलानी समय</TableHead>
                  <TableHead className="whitespace-nowrap font-semibold">तोक/आदेश</TableHead>
                  <TableHead className="whitespace-nowrap font-semibold">कैफियत</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      लोड हुँदैछ...
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      कुनै रेकर्ड फेला परेन।
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record, index) => (
                    <TableRow key={record.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{record.chalaniNumber}</TableCell>
                      <TableCell>{record.miti}</TableCell>
                      <TableCell>{record.receiverName}</TableCell>
                      <TableCell>{record.receiverAddress}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={record.subject}>{record.subject}</TableCell>
                      <TableCell>{record.peonBookNumber || "-"}</TableCell>
                      <TableCell>{record.dispatchTime || "-"}</TableCell>
                      <TableCell>{record.orderOrDecision || "-"}</TableCell>
                      <TableCell>{record.remarks || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
