"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
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
      { name: "Titles Distributed", value: 2511375, color: "hsl(var(--success))" },
      { name: "Rejected Claims", value: 1862056, color: "hsl(var(--destructive))" },
      { name: "Pending Claims", value: 749673, color: "hsl(var(--warning))" },
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Monthly Trends */}
      {selectedState === "all" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Monthly Claims & Titles Trend (2025)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData.monthlyTrends}>
                <defs>
                  <linearGradient id="claimsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="titlesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="claims"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#claimsGradient)"
                  name="Claims Received"
                />
                <Area
                  type="monotone"
                  dataKey="titles"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#titlesGradient)"
                  name="Titles Distributed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* IFR and CFR Status Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <BarChart3 className="w-4 h-4 text-warning" />
              <span>Individual Forest Rights (IFR)</span>
              {selectedState !== "all" && (
                <span className="text-sm text-muted-foreground ml-2">
                  - {selectedState.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData.ifrData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="state"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="received" fill="hsl(var(--chart-1))" name="Claims Received" radius={[2, 2, 0, 0]} />
                <Bar dataKey="distributed" fill="hsl(var(--success))" name="Titles Distributed" radius={[2, 2, 0, 0]} />
                <Bar dataKey="pending" fill="hsl(var(--warning))" name="Pending" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <BarChart3 className="w-4 h-4 text-chart-2" />
              <span>Community Forest Rights (CFR)</span>
              {selectedState !== "all" && (
                <span className="text-sm text-muted-foreground ml-2">
                  - {selectedState.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData.cfrData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="state"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="received" fill="hsl(var(--chart-2))" name="Claims Received" radius={[2, 2, 0, 0]} />
                <Bar dataKey="distributed" fill="hsl(var(--chart-3))" name="Titles Distributed" radius={[2, 2, 0, 0]} />
                <Bar dataKey="pending" fill="hsl(var(--chart-4))" name="Pending" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Forest Land and Claims Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <Activity className="w-4 h-4 text-success" />
              <span>Forest Land Recognised (Lakh Acres)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData.forestLandData} layout="vertical" margin={{ left: 80, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  domain={[0, "dataMax + 10"]}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} formatter={(value: number) => [`${value} Lakh Acres`, ""]} />
                <Bar dataKey="ifr" fill="hsl(var(--chart-5))" name="IFR Land" radius={[0, 2, 2, 0]} />
                <Bar dataKey="cfr" fill="hsl(var(--chart-6))" name="CFR Land" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <PieChartIcon className="w-4 h-4 text-primary" />
              <span>Overall Claims Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData.claimsStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.claimsStatusData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), "Claims"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--card-foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {chartData.claimsStatusData?.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-medium text-foreground">
                    (
                    {(
                      (item.value / chartData.claimsStatusData.reduce((a: any, b: any) => a + b.value, 0)) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
