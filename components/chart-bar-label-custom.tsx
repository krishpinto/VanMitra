"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export const description = "A bar chart with OCR processing statistics"

const chartData = [
    { month: "January", processed: 245, extracted: 238 },
    { month: "February", processed: 312, extracted: 298 },
    { month: "March", processed: 189, extracted: 185 },
    { month: "April", processed: 428, extracted: 415 },
    { month: "May", processed: 356, extracted: 342 },
    { month: "June", processed: 287, extracted: 279 },
]

const chartConfig = {
    processed: {
        label: "PDFs Processed",
        color: "var(--chart-1)",
    },
    extracted: {
        label: "Data Extracted",
        color: "var(--chart-2)",
    },
    label: {
        color: "var(--background)",
    },
} satisfies ChartConfig

export function ChartBarLabelCustom() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>OCR Processing Statistics</CardTitle>
                <CardDescription>PDF Processing & Data Extraction - January - June 2025</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: 16,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="month"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="processed" type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Bar dataKey="processed" layout="vertical" fill="var(--color-processed)" radius={4}>
                            <LabelList
                                dataKey="month"
                                position="insideLeft"
                                offset={8}
                                className="fill-(--color-label)"
                                fontSize={12}
                            />
                            <LabelList dataKey="processed" position="right" offset={8} className="fill-foreground" fontSize={12} />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Processing efficiency up by 8.3% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing OCR processing statistics for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
