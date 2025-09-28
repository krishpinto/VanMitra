"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChartIcon, TrendingUp, Activity } from "lucide-react"

interface ChartsSectionProps {
  selectedState: string
}

export function ChartsSection({ selectedState }: ChartsSectionProps) {
  const [chartData, setChartData] = useState<any>({})

  // Enhanced mock data with more realistic numbers
  const allStatesData = {
    ifrData: [
      { state: "Chhattisgarh", received: 890, distributed: 481, pending: 409 },
      { state: "Odisha", received: 701, distributed: 462, pending: 239 },
      { state: "Telangana", received: 652, distributed: 231, pending: 421 },
      { state: "M.P.", received: 420, distributed: 280, pending: 140 },
      { state: "Jharkhand", received: 380, distributed: 190, pending: 190 },
    ],
    cfrData: [
      { state: "Chhattisgarh", received: 57, distributed: 53, pending: 4 },
      { state: "M.P.", received: 42, distributed: 28, pending: 14 },
      { state: "Odisha", received: 35, distributed: 9, pending: 26 },
      { state: "Telangana", received: 28, distributed: 15, pending: 13 },
      { state: "Jharkhand", received: 22, distributed: 12, pending: 10 },
    ],
    claimsStatusData: [
      { name: "Titles Distributed", value: 2511375, color: "hsl(var(--success))", percentage: 49.0 },
      { name: "Rejected Claims", value: 1862056, color: "hsl(var(--destructive))", percentage: 36.3 },
      { name: "Pending Claims", value: 749673, color: "hsl(var(--warning))", percentage: 14.7 },
    ],
    forestLandData: [
      { state: "Chhattisgarh", ifr: 9.5, cfr: 91.03 },
      { state: "M.P.", ifr: 9.04, cfr: 14.64 },
      { state: "Odisha", ifr: 6.75, cfr: 7.43 },
      { state: "Telangana", ifr: 4.2, cfr: 5.8 },
      { state: "Jharkhand", ifr: 3.15, cfr: 4.25 },
    ],
    monthlyTrends: [
      { month: "Jan", claims: 45000, titles: 28000 },
      { month: "Feb", claims: 52000, titles: 31000 },
      { month: "Mar", claims: 48000, titles: 35000 },
      { month: "Apr", claims: 55000, titles: 38000 },
      { month: "May", claims: 61000, titles: 42000 },
      { month: "Jun", claims: 58000, titles: 45000 },
    ],
  }

  useEffect(() => {
    // Filter data based on selected state
    if (selectedState === "all") {
      setChartData(allStatesData)
    } else {
      // Filter for specific state
      const filteredData = {
        ...allStatesData,
        ifrData: allStatesData.ifrData.filter(
          (item) => item.state.toLowerCase().replace(/\s+/g, "-") === selectedState,
        ),
        cfrData: allStatesData.cfrData.filter(
          (item) => item.state.toLowerCase().replace(/\s+/g, "-") === selectedState,
        ),
        forestLandData: allStatesData.forestLandData.filter(
          (item) => item.state.toLowerCase().replace(/\s+/g, "-") === selectedState,
        ),
      }
      setChartData(filteredData)
    }
  }, [selectedState])

  const SimpleBarChart = ({ data, title, icon }: { data: any[]; title: string; icon: React.ReactNode }) => {
    const maxValue = Math.max(...data.map((d) => Math.max(d.received || 0, d.distributed || 0, d.pending || 0)))

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            {icon}
            <span>{title}</span>
            {selectedState !== "all" && (
              <span className="text-sm text-muted-foreground ml-2">
                - {selectedState.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="text-sm font-medium text-foreground">{item.state}</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-chart-1">Received: {item.received}</span>
                    <span className="text-success">Distributed: {item.distributed}</span>
                    <span className="text-warning">Pending: {item.pending}</span>
                  </div>
                  <div className="flex space-x-1 h-4">
                    <div className="bg-chart-1 rounded-l" style={{ width: `${(item.received / maxValue) * 100}%` }} />
                    <div className="bg-success" style={{ width: `${(item.distributed / maxValue) * 100}%` }} />
                    <div className="bg-warning rounded-r" style={{ width: `${(item.pending / maxValue) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const SimplePieChart = ({ data }: { data: any[] }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <PieChartIcon className="w-4 h-4 text-primary" />
            <span>Overall Claims Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{item.value.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const SimpleAreaChart = ({ data }: { data: any[] }) => {
    const maxValue = Math.max(...data.map((d) => Math.max(d.claims, d.titles)))

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Monthly Claims & Titles Trend (2025)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="text-sm font-medium text-foreground">{item.month}</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-chart-1">Claims: {item.claims.toLocaleString()}</span>
                    <span className="text-success">Titles: {item.titles.toLocaleString()}</span>
                  </div>
                  <div className="flex space-x-1 h-3">
                    <div className="bg-chart-1/30 rounded" style={{ width: `${(item.claims / maxValue) * 100}%` }} />
                    <div className="bg-success/30 rounded" style={{ width: `${(item.titles / maxValue) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const SimpleHorizontalBarChart = ({ data }: { data: any[] }) => {
    const maxValue = Math.max(...data.map((d) => d.ifr + d.cfr))

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Activity className="w-4 h-4 text-success" />
            <span>Forest Land Recognised (Lakh Acres)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="text-sm font-medium text-foreground">{item.state}</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-chart-5">IFR: {item.ifr} Lakh Acres</span>
                    <span className="text-chart-6">CFR: {item.cfr} Lakh Acres</span>
                  </div>
                  <div className="flex h-4 rounded overflow-hidden">
                    <div className="bg-chart-5" style={{ width: `${(item.ifr / maxValue) * 100}%` }} />
                    <div className="bg-chart-6" style={{ width: `${(item.cfr / maxValue) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Monthly Trends */}
      {selectedState === "all" && <SimpleAreaChart data={chartData.monthlyTrends || []} />}

      {/* IFR and CFR Status Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SimpleBarChart
          data={chartData.ifrData || []}
          title="Individual Forest Rights (IFR)"
          icon={<BarChart3 className="w-4 h-4 text-warning" />}
        />
        <SimpleBarChart
          data={chartData.cfrData || []}
          title="Community Forest Rights (CFR)"
          icon={<BarChart3 className="w-4 h-4 text-chart-2" />}
        />
      </div>

      {/* Forest Land and Claims Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SimpleHorizontalBarChart data={chartData.forestLandData || []} />
        <SimplePieChart data={chartData.claimsStatusData || []} />
      </div>
    </div>
  )
}
