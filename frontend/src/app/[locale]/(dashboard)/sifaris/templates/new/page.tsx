"use client"

import { useState } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Save, ArrowLeft, Loader2 } from "lucide-react"
import { Link } from "@/i18n/routing"

export default function NewTemplatePage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>यहाँ सिफारिसको व्यहोरा लेख्नुहोस्...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] border rounded-lg p-4 bg-white',
      },
    },
  })

  const generateWithAi = async () => {
    if (!title) {
      alert("Please enter a Sifaris title first (e.g., नागरिकता सिफारिस)")
      return
    }

    setIsGenerating(true)
    try {
      // Calling the backend API for AI generation
      const res = await fetch('http://localhost:5219/api/ai/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ SifarisType: title })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.htmlContent && editor) {
          editor.commands.setContent(data.htmlContent)
        }
      } else {
        alert("GovAI failed to generate template. Is the backend running?")
      }
    } catch (e) {
      console.error(e)
      alert("Failed to connect to GovAI.")
    } finally {
      setIsGenerating(false)
    }
  }

  const saveTemplate = async () => {
    if (!editor || !title) return

    const htmlContent = editor.getHTML()
    // Mock save logic
    console.log("Saving...", { title, category, htmlContent })
    alert("Template saved successfully!")
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Link href="/sifaris/templates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Sifaris Template</h1>
          <p className="text-muted-foreground mt-1">Design a new e-Recommendation template or use GovAI to generate one.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Sifaris Name (सिफारिसको नाम)</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. नागरिकता सिफारिस" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  placeholder="e.g. Citizenship" 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                <Sparkles className="w-5 h-5" />
                GovAI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 mb-4">
                GovAI can automatically generate the official format for the Sifaris you named above, including standard placeholders like {'{{ApplicantName}}'}.
              </p>
              <Button 
                onClick={generateWithAi} 
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="flex-1 border shadow-sm">
            <CardHeader className="py-3 px-4 border-b bg-gray-50/50 flex flex-row items-center justify-between">
              <span className="font-semibold text-gray-700">Editor</span>
              <Button onClick={saveTemplate} className="h-8 gap-1 bg-green-600 hover:bg-green-700 text-white">
                <Save className="w-4 h-4" />
                Save Template
              </Button>
            </CardHeader>
            <CardContent className="p-4 bg-gray-50 min-h-[500px]">
              <EditorContent editor={editor} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
