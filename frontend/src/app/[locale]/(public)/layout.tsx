import { Building2 } from "lucide-react"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Public Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-800 leading-tight">Local Government</span>
              <span className="text-xs text-slate-500 font-medium">Public Service Portal (नागरिक पोर्टल)</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/en/portal" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="/en/portal/apply" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Apply for Service</a>
            <a href="/en/portal/status" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Check Status</a>
            <a href="/en/login" className="text-sm font-medium bg-blue-50 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">Staff Login</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Local Government Digital Governance Platform. All rights reserved.</p>
          <p className="mt-2 text-slate-500">Powered by LGOMS Enterprise</p>
        </div>
      </footer>
    </div>
  )
}
