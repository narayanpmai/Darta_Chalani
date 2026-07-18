"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, Layers, MapPin, Navigation, Share2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

// Dynamically import Leaflet map to avoid SSR issues
const Map = dynamic(() => import("@/components/gis/map"), { 
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-muted/20">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p>Loading GIS Data...</p>
      </div>
    </div>
  )
})

export default function GisDashboardPage() {
  const { user } = useAuth()
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [locationStr, setLocationStr] = useState("")
  const [copied, setCopied] = useState(false)
  const [locating, setLocating] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>(["ward", "project", "request", "incident"])

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      setLocating(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setUserLocation({ lat, lng })
          setLocationStr(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          
          // Mock Backend Save
          const backendData = JSON.parse(localStorage.getItem('lgoms_backend_locations') || '[]')
          backendData.push({
            userId: user?.id || 'guest',
            username: user?.username || 'Guest User',
            source: 'GIS Dashboard',
            lat,
            lng,
            timestamp: new Date().toISOString()
          })
          localStorage.setItem('lgoms_backend_locations', JSON.stringify(backendData))

          setLocating(false)
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

  const handleCopy = () => {
    if (!locationStr) return
    navigator.clipboard.writeText(`My current location: https://maps.google.com/?q=${locationStr}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GIS Dashboard</h1>
          <p className="text-muted-foreground mt-1">Geographic Information System for Municipal Planning.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2"><Layers className="h-4 w-4" /> Map Layers</Button>
          <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 flex-1">
        <Card className="md:col-span-1 shadow-sm flex flex-col h-full overflow-y-auto max-h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Navigation className="h-5 w-5" /> Share Location</CardTitle>
            <CardDescription>Share your current coordinates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button onClick={handleGetLocation} disabled={locating} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {locating ? "Locating..." : "Get My Location"}
              </Button>
              {userLocation && (
                <div className="flex items-center gap-2 mt-2">
                  <Input value={locationStr} readOnly className="text-sm font-mono" />
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
            <div className="border-t my-4 pt-4"></div>
            <CardTitle className="text-lg mb-2">Map Legend</CardTitle>
            <CardDescription>Filter active data points on the map.</CardDescription>
            <div 
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-opacity ${activeFilters.includes("ward") ? "opacity-100" : "opacity-40"}`}
              onClick={() => toggleFilter("ward")}
            >
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Ward Offices</p>
                <p className="text-xs text-muted-foreground">15 Locations</p>
              </div>
            </div>
            <div 
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-opacity ${activeFilters.includes("project") ? "opacity-100" : "opacity-40"}`}
              onClick={() => toggleFilter("project")}
            >
              <MapPin className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm font-medium">Active Infrastructure Projects</p>
                <p className="text-xs text-muted-foreground">42 Locations</p>
              </div>
            </div>
            <div 
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-opacity ${activeFilters.includes("request") ? "opacity-100" : "opacity-40"}`}
              onClick={() => toggleFilter("request")}
            >
              <MapPin className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm font-medium">Citizen Requests (Pending)</p>
                <p className="text-xs text-muted-foreground">128 Locations</p>
              </div>
            </div>
            <div 
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-opacity ${activeFilters.includes("incident") ? "opacity-100" : "opacity-40"}`}
              onClick={() => toggleFilter("incident")}
            >
              <MapPin className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Emergency Incidents</p>
                <p className="text-xs text-muted-foreground">3 Locations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Container */}
        <Card className="md:col-span-3 shadow-sm overflow-hidden h-full">
          <div className="h-full w-full">
            <Map userLocation={userLocation} activeFilters={activeFilters} />
          </div>
        </Card>
      </div>
    </div>
  )
}
