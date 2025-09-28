"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  MapPin,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Filter,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { PDFUploadSection } from "@/components/pdf-upload-section"
import { IndiaMap } from "@/components/india-map"
import { StatsCards } from "@/components/stats-cards"
import { ChartsSection } from "@/components/simple-charts"
import { useData } from "@/lib/data-context"

export default function FRADashboard() {
  const { filters, updateFilters, refreshData, loading, error, filteredData } = useData()
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString())
  }, [filters])

  const handleRefresh = async () => {
    await refreshData()
    setLastUpdated(new Date().toLocaleString())
  }

  const handleStateChange = (state: string) => {
    updateFilters({ state })
  }

  const handleYearChange = (year: string) => {
    updateFilters({ year })
  }

  const handleMonthChange = (month: string) => {
    updateFilters({ month })
  }

  const stateOptions = [
    { value: "all", label: "All States" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "odisha", label: "Odisha" },
    { value: "telangana", label: "Telangana" },
    { value: "madhya-pradesh", label: "Madhya Pradesh" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "andhra-pradesh", label: "Andhra Pradesh" },
    { value: "karnataka", label: "Karnataka" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "west-bengal", label: "West Bengal" },
    { value: "rajasthan", label: "Rajasthan" },
  ]

  const yearOptions = [
    { value: "all", label: "All Years" },
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
  ]

  const monthOptions = [
    { value: "all", label: "All Months" },
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" },
  ]

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
                  <h1 className="text-2xl font-bold text-foreground">FRA Monitoring System</h1>
                  <p className="text-sm text-muted-foreground">Ministry of Tribal Affairs, Government of India</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Filters */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filters.state} onValueChange={handleStateChange}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.year} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.month} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Data as on:</span>
                </div>
                <div className="text-sm font-medium text-warning">01.06.2025</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 space-y-8">
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

        {/* Data Summary */}
        {filteredData.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredData.length}</span> records
                  </div>
                  {filters.state !== "all" && (
                    <Badge variant="outline" className="text-primary border-primary">
                      {stateOptions.find((s) => s.value === filters.state)?.label}
                    </Badge>
                  )}
                  {filters.year !== "all" && <Badge variant="outline">{filters.year}</Badge>}
                  {filters.month !== "all" && (
                    <Badge variant="outline">{monthOptions.find((m) => m.value === filters.month)?.label}</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Last updated: {lastUpdated}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PDF Upload Section */}
        <PDFUploadSection />

        {/* Stats Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Overview Statistics</h2>
            {loading && <Badge variant="secondary">Loading...</Badge>}
          </div>
          <StatsCards selectedState={filters.state} />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
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

          {/* Charts and Analytics */}
          <div className="xl:col-span-3">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Data Analytics</h2>
              <ChartsSection selectedState={filters.state} />
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Claims Disposal Rate</p>
                    <p className="text-2xl font-bold text-success">78.5%</p>
                    <p className="text-xs text-muted-foreground mt-1">Target: 80%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Claims</p>
                    <p className="text-2xl font-bold text-warning">749K</p>
                    <p className="text-xs text-muted-foreground mt-1">14.6% of total</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active States</p>
                    <p className="text-2xl font-bold text-primary">28</p>
                    <p className="text-xs text-muted-foreground mt-1">All participating</p>
                  </div>
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Processing Time</p>
                    <p className="text-2xl font-bold text-chart-1">45 days</p>
                    <p className="text-xs text-muted-foreground mt-1">Average</p>
                  </div>
                  <PieChart className="w-8 h-8 text-chart-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border pt-6 mt-12">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <p>© 2025 Ministry of Tribal Affairs, Government of India</p>
              <p>Forest Rights Act Monitoring System</p>
            </div>
            <div className="text-right">
              <p>Last updated: {lastUpdated}</p>
              <p>
                System Status: <span className="text-success">Online</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
