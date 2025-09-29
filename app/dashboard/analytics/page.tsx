"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, TrendingUp, RefreshCw, AlertCircle, Users, Building, TreePine, FileText, X } from "lucide-react"
import { IndiaMap } from "@/components/india-map"
import { useData, aggregateData } from "@/lib/data-context"
import { GlowingBarVerticalChart } from "@/components/glowing-bar-vertical-chart"

export default function AnalyticsDashboard() {
    const { filters, updateFilters, refreshData, loading, error, filteredData, availableYears, availableMonths } =
        useData()
    const [lastUpdated, setLastUpdated] = useState<string>("")
    const [selectedYear, setSelectedYear] = useState<string>("all")
    const [selectedMonth, setSelectedMonth] = useState<string>("all")

    useEffect(() => {
        setLastUpdated(new Date().toLocaleString())
    }, [filteredData])

    const handleRefresh = async () => {
        await refreshData()
        setLastUpdated(new Date().toLocaleString())
    }

    const handleStateChange = (state: string) => {
        updateFilters({ state })
    }

    const handleYearChange = (year: string) => {
        setSelectedYear(year)
        updateFilters({ year })
        // Reset month when year changes
        if (year !== "all") {
            setSelectedMonth("all")
            updateFilters({ month: "all" })
        }
    }

    const handleMonthChange = (month: string) => {
        setSelectedMonth(month)
        updateFilters({ month })
    }

    const handleClearFilters = () => {
        setSelectedYear("all")
        setSelectedMonth("all")
        updateFilters({ state: "all", year: "all", month: "all" })
    }

    const getAvailableMonthsForYear = () => {
        if (selectedYear === "all") return availableMonths

        const yearData = filteredData.filter((record) => record.year.toString() === selectedYear)
        return [...new Set(yearData.map((record) => record.month))].sort()
    }

    const getIFRChartData = () => {
        const stateData = filteredData.reduce(
            (acc, record) => {
                const stateName = record.state
                if (!acc[stateName]) {
                    acc[stateName] = {
                        state: stateName,
                        claims: 0,
                        titles: 0,
                    }
                }
                acc[stateName].claims += record.individualClaimsReceived
                acc[stateName].titles += record.individualTitlesDistributed
                return acc
            },
            {} as Record<string, any>,
        )

        return Object.values(stateData)
            .sort((a: any, b: any) => b.claims - a.claims)
            .slice(0, 10)
    }

    const getCFRChartData = () => {
        const stateData = filteredData.reduce(
            (acc, record) => {
                const stateName = record.state
                if (!acc[stateName]) {
                    acc[stateName] = {
                        state: stateName,
                        claims: 0,
                        titles: 0,
                    }
                }
                acc[stateName].claims += record.communityClaimsReceived
                acc[stateName].titles += record.communityTitlesDistributed
                return acc
            },
            {} as Record<string, any>,
        )

        return Object.values(stateData)
            .sort((a: any, b: any) => b.claims - a.claims)
            .slice(0, 10)
    }

    const stats = aggregateData(filteredData)

    const yearOptions = [
        { value: "all", label: "Select Year" },
        ...availableYears.map((year) => ({
            value: year,
            label: year,
        })),
    ]

    const monthOptions = [
        { value: "all", label: "Select Month" },
        ...getAvailableMonthsForYear().map((month) => ({
            value: month.toLowerCase(),
            label: month.charAt(0).toUpperCase() + month.slice(1),
        })),
    ]

    return (
        <div className="p-6 space-y-8">
            {/* Error Display */}
            {error && (
                <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters Section */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h3 className="text-lg font-semibold">Filters</h3>

                            <Select value={selectedYear} onValueChange={handleYearChange}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedMonth} onValueChange={handleMonthChange} disabled={selectedYear === "all"}>
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Select Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearFilters}
                                className="flex items-center gap-2 bg-transparent"
                            >
                                <X className="w-4 h-4" />
                                Clear Filters
                            </Button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                            <div className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(selectedYear !== "all" || selectedMonth !== "all" || filters.state !== "all") && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                            <span className="text-sm text-muted-foreground">Active filters:</span>
                            {selectedYear !== "all" && <Badge variant="outline">{selectedYear}</Badge>}
                            {selectedMonth !== "all" && (
                                <Badge variant="outline">{monthOptions.find((m) => m.value === selectedMonth)?.label}</Badge>
                            )}
                            {filters.state !== "all" && <Badge variant="outline">{filters.state}</Badge>}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Data Summary */}
            {filteredData.length > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium text-foreground">{filteredData.length}</span> records
                                    {stats.stateCount > 0 && (
                                        <span>
                                            {" "}
                                            from <span className="font-medium text-foreground">{stats.stateCount}</span> states
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Data Period: {selectedYear !== "all" ? selectedYear : "All Years"}
                                {selectedMonth !== "all" && ` - ${monthOptions.find((m) => m.value === selectedMonth)?.label}`}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Overall Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Claims Received</p>
                                    <p className="text-2xl font-bold text-primary">{stats.totalClaimsReceived.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mt-1">All categories</p>
                                </div>
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Titles Distributed</p>
                                    <p className="text-2xl font-bold text-success">{stats.totalTitlesDistributed.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Rights granted</p>
                                </div>
                                <Users className="w-8 h-8 text-success" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Forest Land Recognised</p>
                                    <p className="text-2xl font-bold text-chart-1">{(stats.totalForestLand / 1000000).toFixed(2)}M Ha</p>
                                    <p className="text-xs text-muted-foreground mt-1">Total area</p>
                                </div>
                                <TreePine className="w-8 h-8 text-chart-1" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Claims Disposal Rate</p>
                                    <p className="text-2xl font-bold text-warning">{stats.averageDisposalRate.toFixed(1)}%</p>
                                    <p className="text-xs text-muted-foreground mt-1">Processing efficiency</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-warning" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Interactive India Map */}
                <div className="xl:col-span-1">
                    <Card className="h-full">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span>FRA Activity Map</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <IndiaMap selectedState={filters.state} onStateSelect={handleStateChange} />
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="xl:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-chart-1" />
                                <span>Individual Forest Rights (IFR) - Claims & Titles</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <GlowingBarVerticalChart
                                data={getIFRChartData()}
                                config={{
                                    claims: {
                                        label: "Claims Received",
                                        color: "var(--chart-1)",
                                    },
                                    titles: {
                                        label: "Titles Distributed",
                                        color: "var(--chart-2)",
                                    },
                                }}
                                title="Individual Forest Rights by State"
                                description={`Top 10 states - ${selectedYear !== "all" ? selectedYear : "All Years"}`}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Building className="w-5 h-5 text-chart-3" />
                                <span>Community Forest Rights (CFR) - Claims & Titles</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <GlowingBarVerticalChart
                                data={getCFRChartData()}
                                config={{
                                    claims: {
                                        label: "Claims Received",
                                        color: "var(--chart-3)",
                                    },
                                    titles: {
                                        label: "Titles Distributed",
                                        color: "var(--chart-4)",
                                    },
                                }}
                                title="Community Forest Rights by State"
                                description={`Top 10 states - ${selectedYear !== "all" ? selectedYear : "All Years"}`}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
