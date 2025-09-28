import { type NextRequest, NextResponse } from "next/server"
import { getFRARecords, getFRAStatistics } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get("state")
    const year = searchParams.get("year")
    const month = searchParams.get("month")
    const action = searchParams.get("action")

    if (action === "statistics") {
      const stats = await getFRAStatistics(state || undefined)
      return NextResponse.json(stats)
    }

    const filters: any = {}
    if (state && state !== "all") filters.state = state
    if (year) filters.year = Number.parseInt(year)
    if (month && month !== "all") filters.month = month

    const records = await getFRARecords(filters)

    return NextResponse.json({
      success: true,
      data: records,
      count: records.length,
    })
  } catch (error) {
    console.error("Error fetching FRA data:", error)
    return NextResponse.json({ error: "Failed to fetch FRA data" }, { status: 500 })
  }
}
