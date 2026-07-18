import { Mail, FileText, PenTool, Book, Send } from "lucide-react"

export function QuickActionsMenu() {
  // Hidden for now as per user request
  return null;

  const menuItems = [
    {
      title: "पत्र लेखन",
      subtitle: "आधिकारिक पत्र तयार गर्नुहोस्",
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      href: "#",
    },
    {
      title: "टिप्पणी लेखन",
      subtitle: "कार्यालय टिप्पणी तयार गर्नुहोस्",
      icon: <FileText className="h-6 w-6 text-green-600" />,
      href: "/tippani",
    },
    {
      title: "निवेदन लेखन",
      subtitle: "निवेदन तथा आवेदन तयार गर्नुहोस्",
      icon: <PenTool className="h-6 w-6 text-red-500" />,
      href: "#",
    },
    {
      title: "दर्ता इन्ट्री",
      subtitle: "आगमन पत्र दर्ता व्यवस्थापन",
      icon: <Book className="h-6 w-6 text-purple-600" />,
      href: "/darta",
    },
    {
      title: "चलानी इन्ट्री",
      subtitle: "प्रेषित पत्र चलानी व्यवस्थापन",
      icon: <Send className="h-6 w-6 text-orange-500" />,
      href: "/chalani",
    },
  ]

  return (
    <div className="bg-primary text-primary-foreground w-full max-w-[400px] rounded-xl overflow-hidden shadow-[inset_0px_0px_20px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-4 mx-auto border border-primary/30">
      {menuItems.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="group relative overflow-hidden flex items-center gap-4 bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-xl p-4 border border-white/10 shadow-sm"
        >
          {/* Hover highlight effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          
          {/* Icon Container */}
          <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
            {item.icon}
          </div>

          {/* Text Content */}
          <div className="flex flex-col text-white">
            <h3 className="font-bold text-lg leading-tight tracking-wide">{item.title}</h3>
            <p className="text-blue-100 text-xs mt-0.5 opacity-90">{item.subtitle}</p>
          </div>
        </a>
      ))}
    </div>
  )
}
