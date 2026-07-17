"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, User, Sparkles, SendHorizontal } from "lucide-react"

type Message = {
  role: "user" | "ai"
  content: string
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "नमस्ते! म GovAI हुँ, नेपाल सरकारको स्थानीय तह प्रणालीको कृत्रिम बुद्धिमत्ता सहायक। तपाईंलाई स्थानीय सरकार सञ्चालन ऐन, टिप्पणी ड्राफ्ट, वा कुनै पनि कार्यविधि बारे के सहयोग चाहियो?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    // Simulate API call to our backend AiController
    setTimeout(() => {
      let aiResponse = "This is a simulated AI response. In production, this will call the backend API which integrates with OpenAI or Ollama."
      
      if (userMessage.toLowerCase().includes("leave") || userMessage.includes("बिदा")) {
        aiResponse = "Based on the Local Government Operation Act, to approve a leave request, you must verify the available balance and forward it to the Chief Administrative Officer. Would you like me to draft an approval Tippani for this?"
      }

      setMessages((prev) => [...prev, { role: "ai", content: aiResponse }])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GovAI Assistant</h1>
          <p className="text-muted-foreground">Ask questions about policies, draft documents, or summarize archives.</p>
        </div>
      </div>

      <Card className="flex flex-col flex-1 shadow-sm border-indigo-100 dark:border-indigo-900/50">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
              <div className={`flex shrink-0 h-8 w-8 items-center justify-center rounded-full ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"}`}>
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`p-3 rounded-lg ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] self-start">
              <div className="flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3 rounded-lg bg-muted flex items-center gap-1">
                <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 border-t bg-muted/20">
          <form className="flex w-full gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <Input
              placeholder="Ask GovAI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="bg-indigo-600 hover:bg-indigo-700">
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
      
      {/* Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button variant="outline" size="sm" className="whitespace-nowrap rounded-full text-xs" onClick={() => setInput("Draft a leave approval Tippani for an IT Officer.")}>
          📝 Draft Leave Tippani
        </Button>
        <Button variant="outline" size="sm" className="whitespace-nowrap rounded-full text-xs" onClick={() => setInput("What is the process for registering a new business?")}>
          🏢 Business Registration Process
        </Button>
        <Button variant="outline" size="sm" className="whitespace-nowrap rounded-full text-xs" onClick={() => setInput("Summarize the budget allocation rules for Wards.")}>
          💰 Summarize Budget Rules
        </Button>
      </div>
    </div>
  )
}
