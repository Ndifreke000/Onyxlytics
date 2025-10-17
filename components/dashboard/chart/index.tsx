"use client"

import * as React from "react"
import { XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts"
import { useEffect, useState } from "react"

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import mockDataJson from "@/mock.json"
import { Bullet } from "@/components/ui/bullet"
import type { MockData, TimePeriod } from "@/types/dashboard"

const mockData = mockDataJson as MockData

type ChartDataPoint = {
  date: string
  tps: number
  tvl: number
  volume: number
}

const chartConfig = {
  tps: {
    label: "TPS",
    color: "var(--chart-1)",
  },
  tvl: {
    label: "TVL",
    color: "var(--chart-2)",
  },
  volume: {
    label: "Volume",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export default function DashboardChart() {
  const [activeTab, setActiveTab] = React.useState<TimePeriod>("week")
  const [chartData, setChartData] = useState(mockData.chartData)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch("/api/solana/metrics")
        const data = (await response.json()) as { success: boolean }

        if (data.success) {
          // Keep mock data for now, but structure is ready for real data
          setChartData(mockData.chartData)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch chart data:", error)
      }
    }

    fetchChartData()
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchChartData, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleTabChange = (value: string) => {
    if (value === "week" || value === "month" || value === "year") {
      setActiveTab(value as TimePeriod)
    }
  }

  const formatYAxisValue = (value: number) => {
    if (value === 0) {
      return ""
    }

    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return value.toString()
  }

  const renderChart = (data: ChartDataPoint[]) => {
    return (
      <div className="bg-accent rounded-lg p-3">
        <ChartContainer className="md:aspect-[3/1] w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: -12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient id="fillTps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-tps)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-tps)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillTvl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-tvl)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-tvl)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-volume)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-volume)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal={false}
              strokeDasharray="8 8"
              strokeWidth={2}
              stroke="var(--muted-foreground)"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={12}
              strokeWidth={1.5}
              className="uppercase text-sm fill-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={0}
              tickCount={6}
              className="text-sm fill-muted-foreground"
              tickFormatter={formatYAxisValue}
              domain={[0, "dataMax"]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" className="min-w-[200px] px-4 py-3" />}
            />
            <Area
              dataKey="tps"
              type="linear"
              fill="url(#fillTps)"
              fillOpacity={0.4}
              stroke="var(--color-tps)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              dataKey="tvl"
              type="linear"
              fill="url(#fillTvl)"
              fillOpacity={0.4}
              stroke="var(--color-tvl)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              dataKey="volume"
              type="linear"
              fill="url(#fillVolume)"
              fillOpacity={0.4}
              stroke="var(--color-volume)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="max-md:gap-4">
      <div className="flex items-center justify-between mb-4 max-md:contents">
        <TabsList className="max-md:w-full">
          <TabsTrigger value="week">WEEK</TabsTrigger>
          <TabsTrigger value="month">MONTH</TabsTrigger>
          <TabsTrigger value="year">YEAR</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-6 max-md:order-1">
          {Object.entries(chartConfig).map(([key, value]) => (
            <ChartLegend key={key} label={value.label} color={value.color} />
          ))}
        </div>
      </div>
      <TabsContent value="week" className="space-y-4">
        {renderChart(chartData.week)}
      </TabsContent>
      <TabsContent value="month" className="space-y-4">
        {renderChart(chartData.month)}
      </TabsContent>
      <TabsContent value="year" className="space-y-4">
        {renderChart(chartData.year)}
      </TabsContent>
    </Tabs>
  )
}

export const ChartLegend = ({
  label,
  color,
}: {
  label: string
  color: string
}) => {
  return (
    <div className="flex items-center gap-2 uppercase">
      <Bullet style={{ backgroundColor: color }} className="rotate-45" />
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  )
}
