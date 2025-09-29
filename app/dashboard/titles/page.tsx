"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Plus, MapPin, Users, Building, FileText, Save, RefreshCw, Map, List } from "lucide-react"
import { PattaHoldersList } from "@/components/patta-holders-list"
import type { PattaHolder } from "@/lib/firebase"
import dynamic from "next/dynamic"

// Dynamic import for the display map to avoid SSR issues
const DisplayMap = dynamic(() => import("@/components/location-picker-map").then((mod) => mod.LocationPickerMap), {
    ssr: false,
    loading: () => (
        <div className="w-full flex items-center justify-center bg-muted rounded-lg border" style={{ height: "300px" }}>
            <p className="text-muted-foreground">Loading map...</p>
        </div>
    ),
})

const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Jammu & Kashmir",
    "Ladakh",
]

export default function TitlesPage() {
    const [activeTab, setActiveTab] = useState("add")
    const [loading, setLoading] = useState(false)
    const [holders, setHolders] = useState<PattaHolder[]>([])
    const [selectedHolder, setSelectedHolder] = useState<PattaHolder | null>(null)
    const [formData, setFormData] = useState({
        claimNumber: "",
        applicantName: "",
        applicantAddress: "",
        village: "",
        district: "",
        state: "",
        claimType: "",
        landArea: "",
        landDescription: "",
        coordinates: { lat: "", lng: "" }, // Changed to string inputs for manual entry
    })

    useEffect(() => {
        fetchPattaHolders()
    }, [])

    const fetchPattaHolders = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/patta-holders")
            const result = await response.json()

            if (result.success) {
                setHolders(result.data)
            } else {
                toast.error("Failed to fetch patta holders")
            }
        } catch (error) {
            console.error("Error fetching patta holders:", error)
            toast.error("Error loading patta holders")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleCoordinateChange = (field: "lat" | "lng", value: string) => {
        setFormData((prev) => ({
            ...prev,
            coordinates: {
                ...prev.coordinates,
                [field]: value,
            },
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.claimNumber || !formData.applicantName || !formData.state || !formData.claimType) {
            toast.error("Please fill in all required fields")
            return
        }

        if (!formData.coordinates.lat || !formData.coordinates.lng) {
            toast.error("Please enter both latitude and longitude coordinates")
            return
        }

        const lat = Number.parseFloat(formData.coordinates.lat)
        const lng = Number.parseFloat(formData.coordinates.lng)

        if (isNaN(lat) || isNaN(lng)) {
            toast.error("Please enter valid numeric coordinates")
            return
        }

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            toast.error("Please enter valid coordinate ranges (Lat: -90 to 90, Lng: -180 to 180)")
            return
        }

        try {
            setLoading(true)
            const response = await fetch("/api/patta-holders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    coordinates: { lat, lng }, // Convert to numbers
                }),
            })

            const result = await response.json()

            if (result.success) {
                toast.success("Patta holder added successfully!")

                // Reset form
                setFormData({
                    claimNumber: "",
                    applicantName: "",
                    applicantAddress: "",
                    village: "",
                    district: "",
                    state: "",
                    claimType: "",
                    landArea: "",
                    landDescription: "",
                    coordinates: { lat: "", lng: "" },
                })

                // Refresh the list
                await fetchPattaHolders()

                // Switch to list tab
                setActiveTab("list")
            } else {
                toast.error(result.error || "Failed to add patta holder")
            }
        } catch (error) {
            console.error("Error adding patta holder:", error)
            toast.error("Error adding patta holder")
        } finally {
            setLoading(false)
        }
    }

    const handleHolderSelect = (holder: PattaHolder) => {
        setSelectedHolder(holder)
        setActiveTab("map")
    }

    const stats = {
        total: holders.length,
        individual: holders.filter((h) => h.claimType === "Individual").length,
        community: holders.filter((h) => h.claimType === "Community").length,
        totalArea: holders.reduce((sum, h) => sum + h.landArea, 0),
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                                    <FileText className="w-7 h-7 text-primary-foreground" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">Patta Holders Management</h1>
                                    <p className="text-sm text-muted-foreground">Forest Rights Title Management System</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm" onClick={fetchPattaHolders} disabled={loading}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Patta Holders</p>
                                    <p className="text-2xl font-bold text-primary">{stats.total}</p>
                                </div>
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Individual Rights</p>
                                    <p className="text-2xl font-bold text-chart-1">{stats.individual}</p>
                                </div>
                                <Users className="w-8 h-8 text-chart-1" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Community Rights</p>
                                    <p className="text-2xl font-bold text-chart-2">{stats.community}</p>
                                </div>
                                <Building className="w-8 h-8 text-chart-2" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Land Area</p>
                                    <p className="text-2xl font-bold text-chart-3">{stats.totalArea.toFixed(1)} Ha</p>
                                </div>
                                <MapPin className="w-8 h-8 text-chart-3" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="add" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Patta Holder
                        </TabsTrigger>
                        <TabsTrigger value="list" className="flex items-center gap-2">
                            <List className="w-4 h-4" />
                            View All ({holders.length})
                        </TabsTrigger>
                        <TabsTrigger value="map" className="flex items-center gap-2">
                            <Map className="w-4 h-4" />
                            Location Map
                        </TabsTrigger>
                    </TabsList>

                    {/* Add Patta Holder Tab */}
                    <TabsContent value="add" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Add New Patta Holder
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Basic Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Basic Information</h3>

                                            <div>
                                                <Label htmlFor="claimNumber">Claim Number *</Label>
                                                <Input
                                                    id="claimNumber"
                                                    value={formData.claimNumber}
                                                    onChange={(e) => handleInputChange("claimNumber", e.target.value)}
                                                    placeholder="Enter claim number"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="applicantName">Applicant Name *</Label>
                                                <Input
                                                    id="applicantName"
                                                    value={formData.applicantName}
                                                    onChange={(e) => handleInputChange("applicantName", e.target.value)}
                                                    placeholder="Enter applicant name"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="applicantAddress">Applicant Address</Label>
                                                <Textarea
                                                    id="applicantAddress"
                                                    value={formData.applicantAddress}
                                                    onChange={(e) => handleInputChange("applicantAddress", e.target.value)}
                                                    placeholder="Enter complete address"
                                                    rows={3}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="claimType">Claim Type *</Label>
                                                <Select
                                                    value={formData.claimType}
                                                    onValueChange={(value) => handleInputChange("claimType", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select claim type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Individual">Individual Forest Rights (IFR)</SelectItem>
                                                        <SelectItem value="Community">Community Forest Rights (CFR)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Location Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Location Information</h3>

                                            <div>
                                                <Label htmlFor="village">Village</Label>
                                                <Input
                                                    id="village"
                                                    value={formData.village}
                                                    onChange={(e) => handleInputChange("village", e.target.value)}
                                                    placeholder="Enter village name"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="district">District</Label>
                                                <Input
                                                    id="district"
                                                    value={formData.district}
                                                    onChange={(e) => handleInputChange("district", e.target.value)}
                                                    placeholder="Enter district name"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="state">State *</Label>
                                                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select state" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {INDIAN_STATES.map((state) => (
                                                            <SelectItem key={state} value={state}>
                                                                {state}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="landArea">Land Area (Hectares)</Label>
                                                <Input
                                                    id="landArea"
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.landArea}
                                                    onChange={(e) => handleInputChange("landArea", e.target.value)}
                                                    placeholder="Enter land area in hectares"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Land Description */}
                                    <div>
                                        <Label htmlFor="landDescription">Land Description</Label>
                                        <Textarea
                                            id="landDescription"
                                            value={formData.landDescription}
                                            onChange={(e) => handleInputChange("landDescription", e.target.value)}
                                            placeholder="Describe the land characteristics, boundaries, etc."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="latitude">Latitude *</Label>
                                            <Input
                                                id="latitude"
                                                type="number"
                                                step="any"
                                                value={formData.coordinates.lat}
                                                onChange={(e) => handleCoordinateChange("lat", e.target.value)}
                                                placeholder="Enter latitude (e.g., 28.6139)"
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">Range: -90 to 90</p>
                                        </div>
                                        <div>
                                            <Label htmlFor="longitude">Longitude *</Label>
                                            <Input
                                                id="longitude"
                                                type="number"
                                                step="any"
                                                value={formData.coordinates.lng}
                                                onChange={(e) => handleCoordinateChange("lng", e.target.value)}
                                                placeholder="Enter longitude (e.g., 77.2090)"
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">Range: -180 to 180</p>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={loading} className="min-w-32">
                                            {loading ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Patta Holder
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* List Tab */}
                    <TabsContent value="list" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <List className="w-5 h-5" />
                                    All Patta Holders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PattaHoldersList
                                    holders={holders}
                                    onHolderSelect={handleHolderSelect}
                                    selectedHolderId={selectedHolder?.id}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Map Tab */}
                    <TabsContent value="map" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Selected Holder Info */}
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Location Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {selectedHolder ? (
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">{selectedHolder.applicantName}</h3>
                                                <Badge variant={selectedHolder.claimType === "Individual" ? "default" : "secondary"}>
                                                    {selectedHolder.claimType === "Individual" ? "IFR" : "CFR"}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium">Claim #:</span> {selectedHolder.claimNumber}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Village:</span> {selectedHolder.village}
                                                </div>
                                                <div>
                                                    <span className="font-medium">District:</span> {selectedHolder.district}
                                                </div>
                                                <div>
                                                    <span className="font-medium">State:</span> {selectedHolder.state}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Land Area:</span> {selectedHolder.landArea} hectares
                                                </div>
                                            </div>

                                            {selectedHolder.landDescription && (
                                                <div>
                                                    <span className="font-medium text-sm">Description:</span>
                                                    <p className="text-sm text-muted-foreground mt-1">{selectedHolder.landDescription}</p>
                                                </div>
                                            )}

                                            <div className="pt-2 border-t">
                                                <div className="text-sm">
                                                    <div>
                                                        <span className="font-medium">Latitude:</span> {selectedHolder.coordinates.lat.toFixed(6)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Longitude:</span> {selectedHolder.coordinates.lng.toFixed(6)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground">
                                                Select a patta holder from the list to view their location
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Map Display */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Map className="w-5 h-5" />
                                        Location Map
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {selectedHolder ? (
                                        <DisplayMap
                                            selectedLocation={selectedHolder.coordinates}
                                            onLocationSelect={() => { }} // Read-only for display
                                            height="500px"
                                        />
                                    ) : (
                                        <div
                                            className="w-full flex items-center justify-center bg-muted rounded-lg border"
                                            style={{ height: "500px" }}
                                        >
                                            <p className="text-muted-foreground">Select a patta holder to view location</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
