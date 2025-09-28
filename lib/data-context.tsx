"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface FRAData {
  id: string
  date: string
  year: number
  month: string
  state: string
  individualClaimsReceived: number
  communityClaimsReceived: number
  totalClaimsReceived: number
  individualTitlesDistributed: number
  communityTitlesDistributed: number
  totalTitlesDistributed: number
  claimsRejected: number
  totalClaimsDisposedOff: number
  percentageClaimsDisposedOff: number
  areaHaIFRTitlesDistributed: number
  areaHaCFRTitlesDistributed: number
  uploadDate: string
  fileName: string
}

interface DataFilters {
  state: string
  year: string
  month: string
}

interface DataContextType {
  data: FRAData[]
  filteredData: FRAData[]
  filters: DataFilters
  loading: boolean
  error: string | null
  updateFilters: (newFilters: Partial<DataFilters>) => void
  refreshData: () => Promise<void>
  addData: (newData: FRAData) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Mock data for demonstration
const mockData: FRAData[] = [
  {
    id: "1",
    date: "01.06.2025",
    year: 2025,
    month: "June",
    state: "Chhattisgarh",
    individualClaimsReceived: 45000,
    communityClaimsReceived: 845000,
    totalClaimsReceived: 890000,
    individualTitlesDistributed: 28000,
    communityTitlesDistributed: 453000,
    totalTitlesDistributed: 481000,
    claimsRejected: 125000,
    totalClaimsDisposedOff: 606000,
    percentageClaimsDisposedOff: 68.1,
    areaHaIFRTitlesDistributed: 3200000,
    areaHaCFRTitlesDistributed: 9103000,
    uploadDate: "2025-06-01T10:00:00Z",
    fileName: "chhattisgarh_fra_june_2025.pdf",
  },
  {
    id: "2",
    date: "01.06.2025",
    year: 2025,
    month: "June",
    state: "Odisha",
    individualClaimsReceived: 38000,
    communityClaimsReceived: 663000,
    totalClaimsReceived: 701000,
    individualTitlesDistributed: 25000,
    communityTitlesDistributed: 437000,
    totalTitlesDistributed: 462000,
    claimsRejected: 89000,
    totalClaimsDisposedOff: 551000,
    percentageClaimsDisposedOff: 78.6,
    areaHaIFRTitlesDistributed: 2800000,
    areaHaCFRTitlesDistributed: 743000,
    uploadDate: "2025-06-01T10:30:00Z",
    fileName: "odisha_fra_june_2025.pdf",
  },
  {
    id: "3",
    date: "01.06.2025",
    year: 2025,
    month: "June",
    state: "Telangana",
    individualClaimsReceived: 32000,
    communityClaimsReceived: 620000,
    totalClaimsReceived: 652000,
    individualTitlesDistributed: 15000,
    communityTitlesDistributed: 216000,
    totalTitlesDistributed: 231000,
    claimsRejected: 156000,
    totalClaimsDisposedOff: 387000,
    percentageClaimsDisposedOff: 59.4,
    areaHaIFRTitlesDistributed: 1800000,
    areaHaCFRTitlesDistributed: 580000,
    uploadDate: "2025-06-01T11:00:00Z",
    fileName: "telangana_fra_june_2025.pdf",
  },
  {
    id: "4",
    date: "01.05.2025",
    year: 2025,
    month: "May",
    state: "Madhya Pradesh",
    individualClaimsReceived: 28000,
    communityClaimsReceived: 392000,
    totalClaimsReceived: 420000,
    individualTitlesDistributed: 18000,
    communityTitlesDistributed: 262000,
    totalTitlesDistributed: 280000,
    claimsRejected: 78000,
    totalClaimsDisposedOff: 358000,
    percentageClaimsDisposedOff: 85.2,
    areaHaIFRTitlesDistributed: 2100000,
    areaHaCFRTitlesDistributed: 1464000,
    uploadDate: "2025-05-01T09:00:00Z",
    fileName: "mp_fra_may_2025.pdf",
  },
  {
    id: "5",
    date: "01.05.2025",
    year: 2025,
    month: "May",
    state: "Jharkhand",
    individualClaimsReceived: 22000,
    communityClaimsReceived: 358000,
    totalClaimsReceived: 380000,
    individualTitlesDistributed: 12000,
    communityTitlesDistributed: 178000,
    totalTitlesDistributed: 190000,
    claimsRejected: 95000,
    totalClaimsDisposedOff: 285000,
    percentageClaimsDisposedOff: 75.0,
    areaHaIFRTitlesDistributed: 1500000,
    areaHaCFRTitlesDistributed: 425000,
    uploadDate: "2025-05-01T14:00:00Z",
    fileName: "jharkhand_fra_may_2025.pdf",
  },
]

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FRAData[]>([])
  const [filteredData, setFilteredData] = useState<FRAData[]>([])
  const [filters, setFilters] = useState<DataFilters>({
    state: "all",
    year: "2025",
    month: "all",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize with mock data
  useEffect(() => {
    setData(mockData)
  }, [])

  // Filter data whenever filters or data change
  useEffect(() => {
    let filtered = [...data]

    if (filters.state !== "all") {
      const stateKey = filters.state.toLowerCase().replace(/\s+/g, "-")
      filtered = filtered.filter((item) => item.state.toLowerCase().replace(/\s+/g, "-") === stateKey)
    }

    if (filters.year !== "all") {
      filtered = filtered.filter((item) => item.year.toString() === filters.year)
    }

    if (filters.month !== "all") {
      filtered = filtered.filter((item) => item.month.toLowerCase() === filters.month.toLowerCase())
    }

    setFilteredData(filtered)
  }, [data, filters])

  const updateFilters = (newFilters: Partial<DataFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const refreshData = async () => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would fetch from Firebase/API
      const response = await fetch(`/api/fra-data?state=${filters.state}&year=${filters.year}&month=${filters.month}`)

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setData(result.data)
        } else {
          throw new Error("Failed to fetch data")
        }
      } else {
        // Fallback to mock data if API fails
        console.log("[v0] API not available, using mock data")
        setData(mockData)
      }
    } catch (err) {
      console.error("[v0] Error fetching data:", err)
      setError("Failed to refresh data")
      // Use mock data as fallback
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  const addData = (newData: FRAData) => {
    setData((prev) => [newData, ...prev])
  }

  const contextValue: DataContextType = {
    data,
    filteredData,
    filters,
    loading,
    error,
    updateFilters,
    refreshData,
    addData,
  }

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

// Utility functions for data aggregation
export function aggregateData(data: FRAData[]) {
  if (data.length === 0) {
    return {
      totalClaimsReceived: 0,
      totalTitlesDistributed: 0,
      totalForestLand: 0,
      averageDisposalRate: 0,
      stateCount: 0,
    }
  }

  const totals = data.reduce(
    (acc, record) => ({
      totalClaimsReceived: acc.totalClaimsReceived + record.totalClaimsReceived,
      totalTitlesDistributed: acc.totalTitlesDistributed + record.totalTitlesDistributed,
      totalForestLand: acc.totalForestLand + record.areaHaIFRTitlesDistributed + record.areaHaCFRTitlesDistributed,
      totalDisposed: acc.totalDisposed + record.totalClaimsDisposedOff,
    }),
    {
      totalClaimsReceived: 0,
      totalTitlesDistributed: 0,
      totalForestLand: 0,
      totalDisposed: 0,
    },
  )

  const uniqueStates = new Set(data.map((record) => record.state))

  return {
    ...totals,
    averageDisposalRate: totals.totalClaimsReceived > 0 ? (totals.totalDisposed / totals.totalClaimsReceived) * 100 : 0,
    stateCount: uniqueStates.size,
  }
}

export function getStateData(data: FRAData[], stateName: string) {
  return data.filter(
    (record) => record.state.toLowerCase().replace(/\s+/g, "-") === stateName.toLowerCase().replace(/\s+/g, "-"),
  )
}

export function getMonthlyTrends(data: FRAData[]) {
  const monthlyData = data.reduce(
    (acc, record) => {
      const key = `${record.year}-${record.month}`
      if (!acc[key]) {
        acc[key] = {
          month: record.month,
          year: record.year,
          claims: 0,
          titles: 0,
          count: 0,
        }
      }
      acc[key].claims += record.totalClaimsReceived
      acc[key].titles += record.totalTitlesDistributed
      acc[key].count += 1
      return acc
    },
    {} as Record<string, any>,
  )

  return Object.values(monthlyData).sort((a: any, b: any) => {
    if (a.year !== b.year) return a.year - b.year
    return new Date(`${a.month} 1, ${a.year}`).getMonth() - new Date(`${b.month} 1, ${b.year}`).getMonth()
  })
}
