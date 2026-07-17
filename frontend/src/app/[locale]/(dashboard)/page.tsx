import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Send, Clock, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { QuickActionsMenu } from "@/components/dashboard/quick-actions"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Darta</CardTitle>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Chalani</CardTitle>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
              <Send className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+5% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">7 require urgent attention</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">452</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Darta / Chalani Overview</CardTitle>
            <CardDescription>Monthly registration and dispatch volumes.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pl-2">
            <OverviewChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-orange-500/30 shadow-orange-500/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>AI Insights & Alerts</CardTitle>
                <CardDescription>System generated recommendations.</CardDescription>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 animate-pulse" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border p-3 bg-card hover:bg-muted/50 transition-colors shadow-sm">
                <div className="mt-1 h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Unusual File Delay</p>
                  <p className="text-sm text-muted-foreground">File #2082-01-45 has been pending in Administration for 3 days.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border p-3 bg-card hover:bg-muted/50 transition-colors shadow-sm">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Workflow Suggestion</p>
                  <p className="text-sm text-muted-foreground">You usually approve "Leave Requests" at 2 PM. There are 5 pending.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Timeline</CardTitle>
            <CardDescription>Latest actions taken across the organization.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline />
          </CardContent>
        </Card>
      </div>
        </div>
        <div className="md:col-span-4">
          <QuickActionsMenu />
        </div>
      </div>
    </div>
  )
}
