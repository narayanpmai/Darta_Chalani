import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileSignature, Search, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PublicPortalHome() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Digital Services for Citizens
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Apply for recommendations (सिफारिस), track your applications, and access municipal services online without visiting the office.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/en/portal/apply">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-blue-200">
                Apply for Sifaris <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/en/portal/status">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white">
                Check Status <Search className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-md bg-slate-50">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSignature className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Online Application</h3>
              <p className="text-slate-500 text-sm">Fill out the required details from your home and submit directly to your ward office.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-slate-50">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Real-time Tracking</h3>
              <p className="text-slate-500 text-sm">Track your application progress instantly using your unique tracking number.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-slate-50">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Verified Digital Docs</h3>
              <p className="text-slate-500 text-sm">Receive legally valid, digitally signed documents with QR code verification.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
