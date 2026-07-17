"use client"
import { useState, useEffect } from "react"
import NepaliDate from "nepali-datetime"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Bot, Calendar, User, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppNavbar() {
  const { logout, user } = useAuth()
  
  const [fiscalYears, setFiscalYears] = useState<any[]>([])
  const [activeFy, setActiveFy] = useState("")
  const [todayBS, setTodayBS] = useState("")
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    // Set Today's Date in BS
    const today = new NepaliDate()
    setTodayBS(today.format('YYYY-MM-DD'))

    // Set Time
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)

    const stored = localStorage.getItem("lgoms_fiscal_years")
    if (stored) {
      const fy = JSON.parse(stored)
      setFiscalYears(fy)
      const active = fy.find((f: any) => f.isActive)
      if (active) setActiveFy(String(active.id))
    } else {
      // Fallback
      setFiscalYears([
        { id: "1", name: "२०८१/०८२", isActive: true },
        { id: "2", name: "२०८०/०८१", isActive: false },
      ])
      setActiveFy("1")
    }
    
    return () => clearInterval(timer)
  }, [])

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD"

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 shadow-sm">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1 flex items-center gap-4 lg:gap-8">
        <form className="relative hidden lg:flex flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents, files, registration..."
            className="w-full bg-background pl-8 sm:w-[300px] md:w-[400px] lg:w-[400px]"
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        {/* Today's Date and Time */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md border border-dashed">
          <Calendar className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">मिति: {todayBS} | समय: {currentTime}</span>
        </div>

        {/* Active Fiscal Year Dropdown */}
        <div className="hidden sm:flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={String(activeFy)} onValueChange={(val) => {
            setActiveFy(val || "")
            const updated = fiscalYears.map(fy => ({ ...fy, isActive: String(fy.id) === (val || "") }))
            setFiscalYears(updated)
            localStorage.setItem("lgoms_fiscal_years", JSON.stringify(updated))
            window.location.reload()
          }}>
            <SelectTrigger className="h-9 w-[130px] border-dashed text-sm font-medium">
              <SelectValue placeholder="आ.व. छान्नुहोस्">
                {fiscalYears.find(fy => String(fy.id) === String(activeFy))?.name || "आ.व. छान्नुहोस्"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {fiscalYears.map(fy => (
                <SelectItem key={fy.id} value={String(fy.id)}>
                  {fy.name} {fy.isActive && "(हालको)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent">
          <Bot className="h-5 w-5" />
        </button>

        <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* User Avatar with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1">
            <Avatar className="h-8 w-8 cursor-pointer border hover:ring-2 hover:ring-primary hover:ring-offset-1 transition-all">
              <AvatarImage src="/placeholder-user.jpg" alt={user?.name ?? "User"} />
              <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="end" sideOffset={8}>
            {/* User info header */}
            <div className="px-2 py-1.5 border-b mb-1">
              <p className="font-semibold text-sm">{user?.name ?? "Admin User"}</p>
              <p className="text-xs text-muted-foreground">{user?.username ? `${user.username}@lgoms.gov.np` : "admin@lgoms.gov.np"}</p>
            </div>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <User className="h-4 w-4 text-blue-500" />
              <span>User Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <span>User Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" className="cursor-pointer gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
