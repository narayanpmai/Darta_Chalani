"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  Home, 
  FileText, 
  Send, 
  MessageSquare, 
  FileSignature, 
  FolderOpen, 
  Settings, 
  BarChart, 
  Map, 
  Users,
  Sparkles,
  Calendar,
  Building2,
  MapPin,
  ShieldCheck,
  BrainCircuit,
  Globe
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { LanguageSwitcher } from "./language-switcher"
import { useAuth } from "@/lib/auth-context"

export function AppSidebar() {
  const t = useTranslations("Sidebar")
  const { isSuperAdmin } = useAuth()

  const navGroups = []

  if (isSuperAdmin) {
    navGroups.push(
      {
        label: t("federalManagement"),
        items: [
          { title: t("dashboard"), subtitle: t("globalOverview"), url: "/", icon: Home, color: "text-blue-500" },
          { title: t("municipalities"), subtitle: t("tenantRegistry"), url: "/super-admin/tenants", icon: Globe, color: "text-indigo-500" },
        ]
      },
      {
        label: t("globalSettings"),
        items: [
          { title: t("globalUsers"), subtitle: t("superAdmins"), url: "/users", icon: Users, color: "text-cyan-500" },
          { title: t("globalRoles"), subtitle: t("accessControl"), url: "/roles", icon: ShieldCheck, color: "text-purple-500" },
        ]
      }
    )
  } else {
    navGroups.push(
      {
        label: t("dashboard"),
        items: [
          { title: t("dashboard"), subtitle: t("systemOverview"), url: "/", icon: Home, color: "text-blue-500" },
        ]
      },
      {
        label: t("organization"),
        items: [
          { title: t("branchesWards"), subtitle: t("manageOffices"), url: "/wards", icon: MapPin, color: "text-green-500" },
          { title: t("fiscalYear"), subtitle: t("setupFiscalYears"), url: "/settings/fiscal-year", icon: Calendar, color: "text-yellow-500" },
        ]
      },
      {
        label: t("userManagement"),
        items: [
          { title: t("systemUsers"), subtitle: t("employeeProfiles"), url: "/users", icon: Users, color: "text-cyan-500" },
          { title: t("rolesPermissions"), subtitle: t("accessControl"), url: "/roles", icon: ShieldCheck, color: "text-purple-500" },
        ]
      },
      {
        label: t("office"),
        items: [
          { title: t("letter"), subtitle: t("createLetter"), url: "/patra-lekhan", icon: FileText, color: "text-blue-600" },
          { title: t("application"), subtitle: t("writeApplication"), url: "/nivedan-lekhan", icon: FileSignature, color: "text-red-500" },
          { title: t("registration"), subtitle: t("newRegistration"), url: "/darta", icon: FolderOpen, color: "text-purple-600" },
          { title: t("dispatch"), subtitle: t("outgoingLetter"), url: "/chalani", icon: Send, color: "text-orange-500" },
          { title: t("eComment"), subtitle: t("internalDecisions"), url: "/tippani", icon: MessageSquare, color: "text-green-600" },
          { title: t("eRecommendation"), subtitle: t("sifarisTemplates"), url: "/sifaris/apply", icon: FileSignature, color: "text-amber-500" },
        ]
      },
      {
        label: t("aiAssistant"),
        items: [
          { title: t("aiAssistant"), subtitle: t("govAiAgent"), url: "/ai-chat", icon: Sparkles, color: "text-emerald-500" },
        ]
      },
      {
        label: t("reportsAnalytics"),
        items: [
          { title: t("reports"), subtitle: t("dataVisualization"), url: "/reports", icon: BarChart, color: "text-indigo-500" },
          { title: t("dartaChalaniReport"), subtitle: t("dartaChalaniReportSub"), url: "/reports/darta-chalani", icon: FileText, color: "text-blue-500" },
          { title: t("gisMapping"), subtitle: t("spatialData"), url: "/gis", icon: Map, color: "text-teal-500" },
          { title: t("archive"), subtitle: t("documentManagement"), url: "/archive", icon: FolderOpen, color: "text-rose-500" },
        ]
      },
      {
        label: t("system"),
        items: [
          { title: t("settings"), subtitle: t("appConfiguration"), url: "/settings", icon: Settings, color: "text-gray-500" },
        ]
      }
    )
  }

  return (
    <Sidebar className="border-r-0">
      <div className="flex h-full w-full flex-col bg-primary text-primary-foreground overflow-y-auto overflow-x-hidden">
        <SidebarHeader className="p-6 border-b border-white/10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center font-black text-xl shadow-md">LG</div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight leading-tight">{t("lgoms")}</span>
              <span className="text-xs text-blue-100 opacity-90">{t("digitalGovernance")}</span>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="p-4 gap-6">
          {navGroups.map((group, groupIdx) => (
            <SidebarGroup key={groupIdx} className="p-0">
              <SidebarGroupLabel className="text-blue-100/70 font-bold uppercase tracking-wider text-[10px] mb-2 px-2">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <Link
                        href={item.url}
                        className="group relative overflow-hidden flex items-center gap-3 bg-white/5 hover:bg-white/15 transition-all duration-300 rounded-xl p-2.5 border border-white/5 shadow-sm w-full"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        <div className="flex-shrink-0 w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center shadow-sm">
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                        </div>
                        <div className="flex flex-col text-white overflow-hidden text-left">
                          <h3 className="font-semibold text-sm leading-tight tracking-wide truncate">{item.title}</h3>
                          <p className="text-blue-100/80 text-[10px] mt-0.5 truncate">{item.subtitle}</p>
                        </div>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

          <div className="mt-auto pt-6 pb-2">
            <LanguageSwitcher />
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  )
}

