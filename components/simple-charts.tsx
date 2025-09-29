"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChartIcon, TrendingUp, Activity } from "lucide-react"
import { useData, getStateData, getMonthlyTrends } from "@/lib/data-context"

interface ChartsSectionProps {
  selectedState: string
}

export function ChartsSection({ selectedState }: ChartsSectionProps) {
  const { data } = useData()
  const [chartData, setChartData] = useState<any>({})

  useEffect(() => {
    if (data.length === 0) {
      setChartData({})
      return
    }

    const relevantData = selectedState === "all" ? data : getStateData(data, selectedState)

    // Group data by state for IFR/CFR charts
    const stateGroups = relevantData.reduce((acc: any, record) => {
      if (!acc[record.state]) {
        acc[record.state] = {
          state: record.state,
          totalReceived: 0,
          totalDistributed: 0,
          totalPending: 0,
          ifrLand: 0,
          cfrLand: 0,
        }
      }
      acc[record.state].totalReceived += record.totalClaimsReceived
      acc[record.state].totalDistributed += record.totalTitlesDistributed
      acc[record.state].totalPending += record.totalClaimsReceived - record.totalClaimsDisposedOff
      acc[record.state].ifrLand += record.areaHaIFRTitlesDistributed
      acc[record.state].cfrLand += record.areaHaCFRTitlesDistributed
      return acc
    }, {})

    const stateData = Object.values(stateGroups).map((state: any) => ({
      state: state.state.length > 10 ? state.state.substring(0, 8) + "..." : state.state,
      received: Math.round(state.totalReceived / 1000), // Convert to thousands
      distributed: Math.round(state.totalDistributed / 1000),
      pending: Math.round(state.totalPending / 1000),
      ifr: (state.ifrLand / 100000).toFixed(1), // Convert to lakh acres
      cfr: (state.cfrLand / 100000).toFixed(1),
    }))

    // Calculate overall claims status
    const totalClaims = relevantData.reduce((sum, record) => sum + record.totalClaimsReceived, 0)
    const totalDistributed = relevantData.reduce((sum, record) => sum + record.totalTitlesDistributed, 0)
    const totalRejected = relevantData.reduce((sum, record) => sum + record.claimsRejected, 0)
    const totalPending = totalClaims - totalDistributed - totalRejected

    const claimsStatusData = [
      {
        name: "Titles Distributed",
        value: totalDistributed,
        color: "hsl(var(--success))",
        percentage: totalClaims > 0 ? ((totalDistributed / totalClaims) * 100).toFixed(1) : "0",
      },
      {
        name: "Rejected Claims",
        value: totalRejected,
        color: "hsl(var(--destructive))",
        percentage: totalClaims > 0 ? ((totalRejected / totalClaims) * 100).toFixed(1) : "0",
      },
      {
        name: "Pending Claims",
        value: totalPending,
        color: "hsl(var(--warning))",
        percentage: totalClaims > 0 ? ((totalPending / totalClaims) * 100).toFixed(1) : "0",
      },
    ]

    // Get monthly trends
    const monthlyTrends = getMonthlyTrends(relevantData)
      .slice(-6)
      .map((item: any) => ({
        month: item.month.substring(0, 3),
        claims: Math.round(item.claims / 1000), // Convert to thousands
        titles: Math.round(item.titles / 1000),
      }))

    setChartData({
      ifrData: stateData,
      cfrData: stateData,
      forestLandData: stateData,
      claimsStatusData,
      monthlyTrends,
    })
  }, [data, selectedState])

  const SimpleBarChart = ({ data, title, icon }: { data: any[]; title: string; icon: React.ReactNode }) => {
    if (!data || data.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              {icon}
              <span>{title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">No data available</div>
          </CardContent>
        </Card>
      )
    }

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
            {data.slice(0, 5).map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="text-sm font-medium text-foreground">{item.state}</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-chart-1">Received: {item.received}K</span>
                    <span className="text-success">Distributed: {item.distributed}K</span>
                    <span className="text-warning">Pending: {item.pending}K</span>
                  </div>
                  <div className="flex space-x-1 h-4">
                    <div
                      className="bg-chart-1 rounded-l"
                      style={{ width: `${maxValue > 0 ? (item.received / maxValue) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-success"
                      style={{ width: `${maxValue > 0 ? (item.distributed / maxValue) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-warning rounded-r"
                      style={{ width: `${maxValue > 0 ? (item.pending / maxValue) * 100 : 0}%` }}
                    />
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
    if (!data || data.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <PieChartIcon className="w-4 h-4 text-primary" />
              <span>Overall Claims Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">No data available</div>
          </CardContent>
        </Card>
      )
    }

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
    if (!data || data.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Monthly Claims & Titles Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">No data available</div>
          </CardContent>
        </Card>
      )
    }

    const maxValue = Math.max(...data.map((d) => Math.max(d.claims, d.titles)))

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Monthly Claims & Titles Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="text-sm font-medium text-foreground">{item.month}</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-chart-1">Claims: {item.claims}K</span>
                    <span className="text-success">Titles: {item.titles}K</span>
                  </div>
                  <div className="flex space-x-1 h-3">
                    <div
                      className="bg-chart-1/30 rounded"
                      style={{ width: `${maxValue > 0 ? (item.claims / maxValue) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-success/30 rounded"
                      style={{ width: `${maxValue > 0 ? (item.titles / maxValue) * 100 : 0}%` }}
                    />
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
    if (!data || data.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <Activity className="w-4 h-4 text-success" />
              <span>Forest Land Recognised (Lakh Acres)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">No data available</div>
          </CardContent>
        </Card>
      )
    }

    const maxValue = Math.max(...data.map((d) => Number.parseFloat(d.ifr) + Number.parseFloat(d.cfr)))

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
            {data.slice(0, 5).map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="text-sm font-medium text-foreground">{item.state}</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-chart-5">IFR: {item.ifr} Lakh Acres</span>
                    <span className="text-chart-6">CFR: {item.cfr} Lakh Acres</span>
                  </div>
                  <div className="flex h-4 rounded overflow-hidden">
                    <div
                      className="bg-chart-5"
                      style={{ width: `${maxValue > 0 ? (Number.parseFloat(item.ifr) / maxValue) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-chart-6"
                      style={{ width: `${maxValue > 0 ? (Number.parseFloat(item.cfr) / maxValue) * 100 : 0}%` }}
                    />
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
