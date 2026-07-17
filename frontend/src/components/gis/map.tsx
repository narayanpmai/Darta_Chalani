"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default Leaflet marker icons in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

// Custom map theme support
function ThemedMap() {
  const map = useMap()
  
  useEffect(() => {
    // We can add logic here to switch map tiles based on dark/light mode
    // For now we just use a standard OpenStreetMap tile
  }, [map])

  return null
}

function LocationMarker({ location }: { location: { lat: number, lng: number } }) {
  const map = useMap()
  
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 15)
    }
  }, [map, location])

  return (
    <Marker position={[location.lat, location.lng]} icon={icon}>
      <Popup>Your Current Location</Popup>
    </Marker>
  )
}

const mockLocations = [
  { id: 1, pos: [27.7172, 85.3240] as [number, number], title: "Ward Office 1", type: "ward" },
  { id: 2, pos: [27.7122, 85.3200] as [number, number], title: "Road Construction", type: "project" },
  { id: 3, pos: [27.7200, 85.3300] as [number, number], title: "Pending Citizen Request (Water)", type: "request" },
  { id: 4, pos: [27.7150, 85.3100] as [number, number], title: "Fire Emergency", type: "incident" },
]

export default function Map({ userLocation, activeFilters = ["ward", "project", "request", "incident"] }: { userLocation?: { lat: number, lng: number } | null, activeFilters?: string[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Prevent SSR mismatch

  return (
    <MapContainer 
      center={[27.7172, 85.3240]} // Centered roughly on Kathmandu
      zoom={14} 
      className="w-full h-full z-0"
      style={{ minHeight: "500px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ThemedMap />
      
      {mockLocations
        .filter(loc => activeFilters.includes(loc.type))
        .map((loc) => (
        <Marker key={loc.id} position={loc.pos} icon={icon}>
          <Popup>
            <div className="font-medium">{loc.title}</div>
            <div className="text-xs text-muted-foreground capitalize">{loc.type}</div>
          </Popup>
        </Marker>
      ))}

      {userLocation && <LocationMarker location={userLocation} />}
    </MapContainer>
  )
}
