"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, User, Building, Search, Filter } from "lucide-react"
import type { PattaHolder } from "@/lib/firebase"

interface PattaHoldersListProps {
    holders: PattaHolder[]
    onHolderSelect: (holder: PattaHolder) => void
    selectedHolderId?: string
}

export function PattaHoldersList({ holders, onHolderSelect, selectedHolderId }: PattaHoldersListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterState, setFilterState] = useState("all")
    const [filterType, setFilterType] = useState("all")

    const filteredHolders = holders.filter((holder) => {
        const matchesSearch =
            holder.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            holder.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            holder.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
            holder.district.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesState = filterState === "all" || holder.state === filterState
        const matchesType = filterType === "all" || holder.claimType === filterType

        return matchesSearch && matchesState && matchesType
    })

    const uniqueStates = [...new Set(holders.map((h) => h.state))].sort()

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, claim number, village, or district..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterState}
                                onChange={(e) => setFilterState(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="all">All States</option>
                                {uniqueStates.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="all">All Types</option>
                                <option value="Individual">Individual</option>
                                <option value="Community">Community</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    Showing {filteredHolders.length} of {holders.length} patta holders
                </span>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span>
                        Filters active: {[searchTerm, filterState !== "all", filterType !== "all"].filter(Boolean).length}
                    </span>
                </div>
            </div>

            {/* Patta Holders List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredHolders.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-muted-foreground">No patta holders found matching your criteria.</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredHolders.map((holder) => (
                        <Card
                            key={holder.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${selectedHolderId === holder.id ? "ring-2 ring-primary bg-primary/5" : ""
                                }`}
                            onClick={() => onHolderSelect(holder)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-foreground">{holder.applicantName}</h3>
                                            <Badge variant={holder.claimType === "Individual" ? "default" : "secondary"}>
                                                {holder.claimType === "Individual" ? (
                                                    <>
                                                        <User className="w-3 h-3 mr-1" /> IFR
                                                    </>
                                                ) : (
                                                    <>
                                                        <Building className="w-3 h-3 mr-1" /> CFR
                                                    </>
                                                )}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                            <div>
                                                <span className="font-medium">Claim #:</span> {holder.claimNumber}
                                            </div>
                                            <div>
                                                <span className="font-medium">Land Area:</span> {holder.landArea} hectares
                                            </div>
                                            <div>
                                                <span className="font-medium">Village:</span> {holder.village}
                                            </div>
                                            <div>
                                                <span className="font-medium">District:</span> {holder.district}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <span className="font-medium">State:</span> {holder.state}
                                            </div>
                                        </div>

                                        {holder.landDescription && (
                                            <div className="mt-2 text-sm text-muted-foreground">
                                                <span className="font-medium">Description:</span> {holder.landDescription}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onHolderSelect(holder)
                                            }}
                                        >
                                            <MapPin className="w-4 h-4 mr-1" />
                                            View Location
                                        </Button>

                                        <div className="text-xs text-muted-foreground text-right">
                                            <div>Lat: {holder.coordinates.lat.toFixed(4)}</div>
                                            <div>Lng: {holder.coordinates.lng.toFixed(4)}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
