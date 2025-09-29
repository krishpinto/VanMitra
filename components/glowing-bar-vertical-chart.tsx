"use client"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type ActiveProperty = string | "all"

interface GlowingBarVerticalChartProps {
    data: any[]
    config: ChartConfig
    title: string
    description: string
}

export function GlowingBarVerticalChart({ data, config, title, description }: GlowingBarVerticalChartProps) {
    const [activeProperty, setActiveProperty] = React.useState<ActiveProperty>("all")

    const chartData = data.map((item) => ({
        state: item.state.length > 10 ? item.state.substring(0, 10) + "..." : item.state,
        fullState: item.state,
        claims: item.claims,
        titles: item.titles,
    }))

    const configKeys = Object.keys(config)

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-row justify-between">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <Select
                        value={activeProperty}
                        onValueChange={(value: ActiveProperty) => {
                            setActiveProperty(value)
                        }}
                    >
                        <SelectTrigger className="text-xs !h-6 !px-1.5">
                            <SelectValue placeholder="Select a property" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectGroup>
                                <SelectLabel>Properties</SelectLabel>
                                <SelectItem className="text-xs" value="all">
                                    All
                                </SelectItem>
                                {configKeys.map((key) => (
                                    <SelectItem key={key} className="text-xs" value={key}>
                                        {config[key].label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={config}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: -15,
                        }}
                    >
                        <YAxis type="category" dataKey="state" tickLine={false} tickMargin={10} axisLine={false} width={80} />
                        <XAxis type="number" tickLine={false} tickMargin={10} axisLine={false} hide />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value, payload) => {
                                        const item = payload?.[0]?.payload
                                        return item?.fullState || value
                                    }}
                                />
                            }
                        />
                        {configKeys.map((key, index) => (
                            <Bar
                                key={key}
                                stackId="a"
                                barSize={8}
                                className={index === 0 ? "dark:text-[#1A1A1C] text-[#E4E4E7]" : ""}
                                dataKey={key}
                                fill={config[key].color}
                                radius={4}
                                shape={<CustomGradientBar activeProperty={activeProperty} />}
                                background={index === 0 ? { fill: "currentColor", radius: 4 } : undefined}
                                overflow="visible"
                            />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

const CustomGradientBar = (
    props: React.SVGProps<SVGRectElement> & {
        dataKey?: string
        activeProperty?: ActiveProperty | null
        glowOpacity?: number
    },
) => {
    const { fill, x, y, width, height, dataKey, activeProperty, radius } = props

    const isActive = activeProperty === "all" ? true : activeProperty === dataKey

    return (
        <>
            <rect
                x={x}
                y={y}
                rx={radius}
                width={width}
                height={height}
                stroke="none"
                fill={fill}
                opacity={isActive ? 1 : 0.1}
                filter={isActive && activeProperty !== "all" ? `url(#glow-chart-${dataKey})` : undefined}
            />
            <defs>
                <filter id={`glow-chart-${dataKey}`} x="-200%" y="-200%" width="600%" height="600%">
                    <feGaussianBlur stdDeviation="10" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
        </>
    )
}
