import { formatDistanceToNow } from "date-fns"
import { CheckCircle2, FileText, Send, User } from "lucide-react"

const timeline = [
  {
    id: 1,
    type: "darta",
    title: "New Registration",
    description: "Application for citizenship recommendation registered.",
    date: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    user: "Admin Desk",
  },
  {
    id: 2,
    type: "chalani",
    title: "Dispatch Sent",
    description: "Budget approval request sent to Ministry.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    user: "Account Section",
  },
  {
    id: 3,
    type: "approval",
    title: "Document Approved",
    description: "Leave request for Ram Bahadur approved.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    user: "Chief Administrative Officer",
  },
  {
    id: 4,
    type: "darta",
    title: "New Registration",
    description: "Ward construction tender document received.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    user: "Planning Section",
  },
]

export function ActivityTimeline() {
  return (
    <div className="space-y-6">
      {timeline.map((item) => (
        <div key={item.id} className="flex gap-4">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            {item.type === "darta" && <FileText className="h-5 w-5 text-blue-500" />}
            {item.type === "chalani" && <Send className="h-5 w-5 text-emerald-500" />}
            {item.type === "approval" && <CheckCircle2 className="h-5 w-5 text-amber-500" />}
          </div>
          <div className="flex flex-col space-y-1 pb-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{item.title}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(item.date, { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <div className="flex items-center gap-2 pt-2">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">{item.user}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
