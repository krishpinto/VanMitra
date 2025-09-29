"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getFRARecords, type FRARecord } from "./firebase"

interface DataFilters {
  state: string
  year: string
  month: string
}

interface DataContextType {
  data: FRARecord[]
  filteredData: FRARecord[]
  filters: DataFilters
  loading: boolean
  error: string | null
  availableYears: string[]
  availableMonths: string[]
  availableStates: string[]
  updateFilters: (newFilters: Partial<DataFilters>) => void
  refreshData: () => Promise<void>
  addData: (newData: FRARecord) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FRARecord[]>([])
  const [filteredData, setFilteredData] = useState<FRARecord[]>([])
  const [filters, setFilters] = useState<DataFilters>({
    state: "all",
    year: "all",
    month: "all",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [availableMonths, setAvailableMonths] = useState<string[]>([])
  const [availableStates, setAvailableStates] = useState<string[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Loading FRA records from Firebase...")
      const records = await getFRARecords()
      console.log("[v0] Loaded records:", records.length)
      setData(records)

      const years = [...new Set(records.map((r) => r.year.toString()))].sort(
        (a, b) => Number.parseInt(b) - Number.parseInt(a),
      )
      const months = [...new Set(records.map((r) => r.month))].sort()
      const states = [...new Set(records.map((r) => r.state))].sort()

      setAvailableYears(years)
      setAvailableMonths(months)
      setAvailableStates(states)

      console.log("[v0] Available years:", years)
      console.log("[v0] Available months:", months)
      console.log("[v0] Available states:", states)
    } catch (err) {
      console.error("[v0] Error loading data:", err)
      setError("Failed to load data from database")
      setData([])
    } finally {
      setLoading(false)
    }
  }

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

    console.log("[v0] Filtered data:", filtered.length, "records")
    setFilteredData(filtered)
  }, [data, filters])

  const updateFilters = (newFilters: Partial<DataFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const refreshData = async () => {
    await loadData()
  }

  const addData = (newData: FRARecord) => {
    setData((prev) => [newData, ...prev])
  }

  const contextValue: DataContextType = {
    data,
    filteredData,
    filters,
    loading,
    error,
    availableYears,
    availableMonths,
    availableStates,
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

export function aggregateData(data: FRARecord[]) {
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

export function getStateData(data: FRARecord[], stateName: string) {
  return data.filter(
    (record) => record.state.toLowerCase().replace(/\s+/g, "-") === stateName.toLowerCase().replace(/\s+/g, "-"),
  )
}

export function getMonthlyTrends(data: FRARecord[]) {
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
