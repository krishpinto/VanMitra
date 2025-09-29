"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import type { MapContainerProps } from "react-leaflet"
import L from "leaflet"

// Fix Leaflet default marker icons
const markerIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

// Dynamic imports for Next.js SSR
const MapContainer = dynamic<MapContainerProps>(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

interface LocationPickerMapProps {
    onLocationSelect: (lat: number, lng: number) => void
    selectedLocation?: { lat: number; lng: number }
    height?: string
}

export function LocationPickerMap({ onLocationSelect, selectedLocation, height = "400px" }: LocationPickerMapProps) {
    const [isClient, setIsClient] = useState(false)
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
        selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null
    )
    const mapRef = useRef<any>(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsClient(true)
        }
    }, [])

    useEffect(() => {
        if (selectedLocation) {
            setMarkerPosition([selectedLocation.lat, selectedLocation.lng])
        }
    }, [selectedLocation])

    const handleMapClick = (e: any) => {
        const { lat, lng } = e.latlng
        setMarkerPosition([lat, lng])
        onLocationSelect(lat, lng)
    }

    if (!isClient) {
        return (
            <div
                className="w-full flex items-center justify-center bg-muted rounded-lg border"
                style={{ height }}
            >
                <p className="text-muted-foreground">Loading map...</p>
            </div>
        )
    }

    return (
        <div className="w-full border rounded-lg overflow-hidden">
            <MapContainer
                ref={mapRef}
                center={markerPosition || [20.5937, 78.9629]} // Default India center
                zoom={markerPosition ? 15 : 5}
                style={{ height, width: "100%" }}
                eventHandlers={{ click: handleMapClick }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {markerPosition && (
                    <Marker position={markerPosition} icon={markerIcon}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-medium">Selected Location</p>
                                <p className="text-sm text-muted-foreground">Lat: {markerPosition[0].toFixed(6)}</p>
                                <p className="text-sm text-muted-foreground">Lng: {markerPosition[1].toFixed(6)}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    )
}
