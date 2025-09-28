"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatsCardsProps {
  selectedState: string
}

interface StatsData {
  claimsReceived: { individual: number; community: number; total: number }
  titlesDistributed: { individual: number; community: number; total: number }
  forestLand: { ifr: number; cfr: number; total: number }
  trends: { claims: number; titles: number; land: number }
}

export function StatsCards({ selectedState }: StatsCardsProps) {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(false)

  // Enhanced mock data with state-specific information
  const allStatesStats: Record<string, StatsData> = {
    all: {
      claimsReceived: { individual: 211609, community: 4911495, total: 5123104 },
      titlesDistributed: { individual: 121705, community: 2389670, total: 2511375 },
      forestLand: { ifr: 18198864, cfr: 5075084, total: 23273948 },
      trends: { claims: 5.2, titles: 8.1, land: 3.4 },
    },
    chhattisgarh: {
      claimsReceived: { individual: 45000, community: 845000, total: 890000 },
      titlesDistributed: { individual: 28000, community: 453000, total: 481000 },
      forestLand: { ifr: 3200000, cfr: 9103000, total: 12303000 },
      trends: { claims: 7.8, titles: 12.3, land: 5.6 },
    },
    odisha: {
      claimsReceived: { individual: 38000, community: 663000, total: 701000 },
      titlesDistributed: { individual: 25000, community: 437000, total: 462000 },
      forestLand: { ifr: 2800000, cfr: 743000, total: 3543000 },
      trends: { claims: 4.2, titles: 9.7, land: 2.8 },
    },
    telangana: {
      claimsReceived: { individual: 32000, community: 620000, total: 652000 },
      titlesDistributed: { individual: 15000, community: 216000, total: 231000 },
      forestLand: { ifr: 1800000, cfr: 580000, total: 2380000 },
      trends: { claims: -2.1, titles: 6.4, land: 1.2 },
    },
    "madhya-pradesh": {
      claimsReceived: { individual: 28000, community: 392000, total: 420000 },
      titlesDistributed: { individual: 18000, community: 262000, total: 280000 },
      forestLand: { ifr: 2100000, cfr: 1464000, total: 3564000 },
      trends: { claims: 3.7, titles: 11.2, land: 4.1 },
    },
    jharkhand: {
      claimsReceived: { individual: 22000, community: 358000, total: 380000 },
      titlesDistributed: { individual: 12000, community: 178000, total: 190000 },
      forestLand: { ifr: 1500000, cfr: 425000, total: 1925000 },
      trends: { claims: 1.8, titles: 7.9, land: 2.3 },
    },
  }

  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setStats(allStatesStats[selectedState] || allStatesStats["all"])
      setLoading(false)
    }, 300)
  }, [selectedState])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  const formatLandArea = (hectares: number) => {
    const lakhAcres = hectares / 100000
    return `${lakhAcres.toFixed(1)} Lakh Acres`
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-success" />
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-destructive" />
    return <Minus className="w-4 h-4 text-muted-foreground" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-success"
    if (trend < 0) return "text-destructive"
    return "text-muted-foreground"
  }

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Claims Received */}
      <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5 border-chart-1/20 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-chart-1">{formatNumber(stats.claimsReceived.total)}</div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(stats.trends.claims)}
                <span className={`text-sm font-medium ${getTrendColor(stats.trends.claims)}`}>
                  {Math.abs(stats.trends.claims)}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                {selectedState === "all"
                  ? "All India"
                  : selectedState.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                - Claims Received
              </div>
              <div className="text-xs text-muted-foreground">vs previous period</div>
            </div>

            <div className="flex justify-between text-sm">
              <div className="text-center">
                <div className="font-semibold text-destructive">{formatNumber(stats.claimsReceived.individual)}</div>
                <div className="text-muted-foreground text-xs">Individual</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-chart-1">{formatNumber(stats.claimsReceived.community)}</div>
                <div className="text-muted-foreground text-xs">Community</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Titles Distributed */}
      <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-success">{formatNumber(stats.titlesDistributed.total)}</div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(stats.trends.titles)}
                <span className={`text-sm font-medium ${getTrendColor(stats.trends.titles)}`}>
                  {Math.abs(stats.trends.titles)}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                {selectedState === "all"
                  ? "All India"
                  : selectedState.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                - Total Titles Distributed
              </div>
              <div className="text-xs text-muted-foreground">
                Success rate: {((stats.titlesDistributed.total / stats.claimsReceived.total) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div className="text-center">
                <div className="font-semibold text-success">{formatNumber(stats.titlesDistributed.individual)}</div>
                <div className="text-muted-foreground text-xs">IFR</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-success">{formatNumber(stats.titlesDistributed.community)}</div>
                <div className="text-muted-foreground text-xs">CFR</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forest Land Recognized */}
      <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-warning">{formatLandArea(stats.forestLand.total)}</div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(stats.trends.land)}
                <span className={`text-sm font-medium ${getTrendColor(stats.trends.land)}`}>
                  {Math.abs(stats.trends.land)}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                {selectedState === "all"
                  ? "All India"
                  : selectedState.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                - Forest Land Recognised
              </div>
              <div className="text-xs text-muted-foreground">Hectares converted to acres</div>
            </div>

            <div className="flex justify-between text-sm">
              <div className="text-center">
                <div className="font-semibold text-destructive">{formatLandArea(stats.forestLand.ifr)}</div>
                <div className="text-muted-foreground text-xs">IFR</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-warning">{formatLandArea(stats.forestLand.cfr)}</div>
                <div className="text-muted-foreground text-xs">CFR</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
