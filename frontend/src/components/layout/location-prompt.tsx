"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function LocationPrompt() {
  const { user } = useAuth()
  const [showPrompt, setShowPrompt] = useState(false)
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    // Only show if user is logged in
    if (!user) return

    // Check if location was already shared or skipped for this user
    const hasShared = localStorage.getItem(`lgoms_loc_shared_${user.id}`)
    if (!hasShared) {
      // Delay showing prompt slightly after login for better UX
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [user])

  const handleShare = () => {
    if ("geolocation" in navigator) {
      setLocating(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success: Simulate saving to backend
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          console.log(`Location shared by ${user?.name}: ${lat}, ${lng}`)
          
          // Mock Backend Save
          const backendData = JSON.parse(localStorage.getItem('lgoms_backend_locations') || '[]')
          backendData.push({
            userId: user?.id,
            username: user?.username,
            lat,
            lng,
            timestamp: new Date().toISOString()
          })
          localStorage.setItem('lgoms_backend_locations', JSON.stringify(backendData))
          
          // Mark as shared
          localStorage.setItem(`lgoms_loc_shared_${user?.id}`, "true")
          setLocating(false)
          setShowPrompt(false)
          alert("Location shared and saved to backend successfully! Thank you.")
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Could not get your location. Please check browser permissions.")
          setLocating(false)
        }
      )
    } else {
      alert("Geolocation is not supported by your browser.")
    }
  }

  const handleSkip = () => {
    // If they skip, we still mark it so it doesn't bother them every time they refresh
    localStorage.setItem(`lgoms_loc_shared_${user?.id}`, "skipped")
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border">
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Share Your Location</h2>
          <p className="text-muted-foreground text-sm">
            To help us improve municipal planning and emergency response times, please share your current location. This is a one-time request.
          </p>
          
          <div className="pt-4 flex flex-col gap-3">
            <Button 
              onClick={handleShare} 
              disabled={locating} 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11"
            >
              <Navigation className="h-4 w-4" />
              {locating ? "Locating..." : "Share Current Location"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSkip} 
              disabled={locating}
              className="w-full h-11"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
