import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { LocationPrompt } from "@/components/layout/location-prompt";
import { ProtectedRoute } from "@/components/layout/protected-route";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-muted/40">
          <AppSidebar />
          <div className="flex flex-col flex-1 sm:gap-4 sm:py-4">
            <AppNavbar />
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
          <LocationPrompt />
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
