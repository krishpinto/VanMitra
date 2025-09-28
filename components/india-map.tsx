"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false })

interface IndiaMapProps {
  selectedState: string
  onStateSelect: (state: string) => void
}

interface StateData {
  name: string
  claims: number
  titles: number
  color: string
  coordinates: [number, number] // [lat, lng]
  size: number
}

export function IndiaMap({ selectedState, onStateSelect }: IndiaMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [stateData, setStateData] = useState<Record<string, StateData>>({})
  const mapRef = useRef<any>(null)

  // Enhanced state data with accurate coordinates for Indian states
  const defaultStateData: Record<string, StateData> = {
    chhattisgarh: {
      name: "Chhattisgarh",
      claims: 890000,
      titles: 481000,
      color: "#3b82f6",
      coordinates: [21.2787, 81.8661],
      size: 28,
    },
    odisha: {
      name: "Odisha",
      claims: 701000,
      titles: 462000,
      color: "#10b981",
      coordinates: [20.9517, 85.0985],
      size: 25,
    },
    telangana: {
      name: "Telangana",
      claims: 652000,
      titles: 231000,
      color: "#f59e0b",
      coordinates: [18.1124, 79.0193],
      size: 22,
    },
    "madhya-pradesh": {
      name: "Madhya Pradesh",
      claims: 420000,
      titles: 280000,
      color: "#8b5cf6",
      coordinates: [22.9734, 78.6569],
      size: 20,
    },
    jharkhand: {
      name: "Jharkhand",
      claims: 380000,
      titles: 190000,
      color: "#ef4444",
      coordinates: [23.6102, 85.2799],
      size: 18,
    },
    "andhra-pradesh": {
      name: "Andhra Pradesh",
      claims: 320000,
      titles: 150000,
      color: "#06b6d4",
      coordinates: [15.9129, 79.74],
      size: 16,
    },
    karnataka: {
      name: "Karnataka",
      claims: 280000,
      titles: 120000,
      color: "#84cc16",
      coordinates: [15.3173, 75.7139],
      size: 15,
    },
    maharashtra: {
      name: "Maharashtra",
      claims: 250000,
      titles: 100000,
      color: "#f97316",
      coordinates: [19.7515, 75.7139],
      size: 14,
    },
    "west-bengal": {
      name: "West Bengal",
      claims: 180000,
      titles: 80000,
      color: "#ec4899",
      coordinates: [22.9868, 87.855],
      size: 12,
    },
    rajasthan: {
      name: "Rajasthan",
      claims: 150000,
      titles: 60000,
      color: "#6366f1",
      coordinates: [27.0238, 74.2179],
      size: 11,
    },
    assam: {
      name: "Assam",
      claims: 148965,
      titles: 57325,
      color: "#14b8a6",
      coordinates: [26.2006, 92.9376],
      size: 10,
    },
    bihar: {
      name: "Bihar",
      claims: 4696,
      titles: 191,
      color: "#f43f5e",
      coordinates: [25.0961, 85.3131],
      size: 8,
    },
    goa: {
      name: "Goa",
      claims: 10136,
      titles: 856,
      color: "#a855f7",
      coordinates: [15.2993, 74.124],
      size: 6,
    },
    gujarat: {
      name: "Gujarat",
      claims: 190242,
      titles: 98732,
      color: "#22c55e",
      coordinates: [23.0225, 72.5714],
      size: 13,
    },
    "himachal-pradesh": {
      name: "Himachal Pradesh",
      claims: 5664,
      titles: 755,
      color: "#0ea5e9",
      coordinates: [31.1048, 77.1734],
      size: 7,
    },
    kerala: {
      name: "Kerala",
      claims: 45469,
      titles: 29422,
      color: "#65a30d",
      coordinates: [10.8505, 76.2711],
      size: 9,
    },
    "tamil-nadu": {
      name: "Tamil Nadu",
      claims: 34667,
      titles: 15442,
      color: "#dc2626",
      coordinates: [11.1271, 78.6569],
      size: 8,
    },
    tripura: {
      name: "Tripura",
      claims: 200721,
      titles: 127931,
      color: "#7c3aed",
      coordinates: [23.9408, 91.9882],
      size: 11,
    },
    "uttar-pradesh": {
      name: "Uttar Pradesh",
      claims: 94166,
      titles: 2537,
      color: "#059669",
      coordinates: [26.8467, 80.9462],
      size: 10,
    },
    uttarakhand: {
      name: "Uttarakhand",
      claims: 6678,
      titles: 184,
      color: "#7c2d12",
      coordinates: [30.0668, 79.0193],
      size: 7,
    },
    "jammu-kashmir": {
      name: "Jammu & Kashmir",
      claims: 46090,
      titles: 4299,
      color: "#be185d",
      coordinates: [33.7782, 76.5762],
      size: 9,
    },
  }

  useEffect(() => {
    setIsClient(true)
    setStateData(defaultStateData)
  }, [])

  const handleStateClick = (stateName: string) => {
    onStateSelect(stateName)
  }

  const getStateSize = (claims: number) => {
    const minSize = 8
    const maxSize = 35
    const maxClaims = Math.max(...Object.values(stateData).map((s) => s.claims))
    return minSize + (claims / maxClaims) * (maxSize - minSize)
  }

  const getStateOpacity = (stateName: string) => {
    if (selectedState === "all") return 0.8
    if (selectedState === stateName) return 1
    return 0.4
  }

  if (!isClient) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg overflow-hidden border border-border flex items-center justify-center">
        <div className="text-muted-foreground">Loading India Map...</div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg overflow-hidden border border-border">
      <MapContainer
        ref={mapRef}
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        minZoom={4}
        maxZoom={8}
        bounds={[
          [6.4627, 68.1097], // Southwest corner
          [35.5044, 97.4152], // Northeast corner
        ]}
        maxBounds={[
          [5, 65], // Extended southwest
          [38, 100], // Extended northeast
        ]}
        maxBoundsViscosity={1.0}
        className="leaflet-container"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* State markers with data */}
        {Object.entries(stateData).map(([key, state]) => {
          const isSelected = selectedState === key
          const size = getStateSize(state.claims)
          const opacity = getStateOpacity(key)

          return (
            <CircleMarker
              key={key}
              center={state.coordinates}
              radius={size}
              fillColor={state.color}
              color={isSelected ? "#ffffff" : state.color}
              weight={isSelected ? 3 : 2}
              opacity={opacity}
              fillOpacity={opacity}
              eventHandlers={{
                click: () => handleStateClick(key),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: state.color }} />
                    <div className="font-semibold text-foreground">{state.name}</div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Claims Received:</span>
                      <span className="font-medium text-foreground">{state.claims.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Titles Distributed:</span>
                      <span className="font-medium text-success">{state.titles.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="font-medium text-primary">
                        {((state.titles / state.claims) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                <div className="text-center">
                  <div className="font-medium">{state.name}</div>
                  <div className="text-xs">
                    {state.claims >= 1000 ? `${Math.round(state.claims / 1000)}K` : state.claims} claims
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          )
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <div className="text-xs font-semibold text-foreground mb-3">FRA Activity Level</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-chart-1"></div>
            <span className="text-muted-foreground">Very High (800K+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-muted-foreground">High (400-800K)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-muted-foreground">Medium (200-400K)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
            <span className="text-muted-foreground">Low (&lt;200K)</span>
          </div>
        </div>

        {selectedState !== "all" && (
          <div className="mt-3 pt-2 border-t border-border">
            <div className="text-xs font-medium text-primary">
              Selected: {stateData[selectedState]?.name || "Unknown"}
            </div>
          </div>
        )}
      </div>

      {/* Reset button */}
      {selectedState !== "all" && (
        <button
          onClick={() => onStateSelect("all")}
          className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium hover:bg-primary/90 transition-colors shadow-lg"
        >
          Show All States
        </button>
      )}

      {/* Scale indicator */}
      <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <div className="text-xs font-semibold text-foreground mb-2">Claims Scale</div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-chart-1"></div>
            <span className="text-muted-foreground">100K+</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-chart-1"></div>
            <span className="text-muted-foreground">500K+</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 rounded-full bg-chart-1"></div>
            <span className="text-muted-foreground">800K+</span>
          </div>
        </div>
      </div>
    </div>
  )
}
