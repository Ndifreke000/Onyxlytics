"use client"

import { useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardChart from "@/components/dashboard/chart"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BracketsIcon from "@/components/icons/brackets"
import { useSolanaMetrics } from "@/hooks/use-solana-metrics"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function VisualizationsPage() {
  const { metrics } = useSolanaMetrics(10000)
  const [activeTab, setActiveTab] = useState("overview")

  const validatorDistribution = [
    { name: "Active", value: metrics.validatorCount },
    { name: "Inactive", value: 150 },
  ]

  const performanceData = [
    { time: "00:00", tps: 2100, latency: 380 },
    { time: "04:00", tps: 2400, latency: 410 },
    { time: "08:00", tps: 2800, latency: 400 },
    { time: "12:00", tps: 2600, latency: 420 },
    { time: "16:00", tps: 2900, latency: 390 },
    { time: "20:00", tps: 2847, latency: 412 },
  ]

  return (
    <DashboardPageLayout
      header={{
        title: "Visualizations",
        description: "Advanced data visualization and analysis",
        icon: BracketsIcon,
      }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">OVERVIEW</TabsTrigger>
          <TabsTrigger value="performance">PERFORMANCE</TabsTrigger>
          <TabsTrigger value="validators">VALIDATORS</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <Bullet />
                BLOCKCHAIN METRICS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="w-full h-[400px] px-4 py-4">
                <DashboardChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <Bullet />
                NETWORK PERFORMANCE
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="w-full bg-accent rounded-lg p-6">
                <ChartContainer
                  config={{
                    tps: {
                      label: "TPS",
                      color: "var(--chart-1)",
                    },
                    latency: {
                      label: "Latency (ms)",
                      color: "var(--chart-2)",
                    },
                  }}
                  className="h-[400px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" opacity={0.3} />
                      <XAxis
                        dataKey="time"
                        stroke="var(--muted-foreground)"
                        tick={{ fontSize: 12, dy: 10 }}
                        label={{ value: "Time", position: "insideBottomRight", offset: -10, fontSize: 12 }}
                      />
                      <YAxis
                        stroke="var(--muted-foreground)"
                        tick={{ fontSize: 12, dx: -10 }}
                        label={{ value: "Value", angle: -90, position: "insideLeft", fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Line
                        type="monotone"
                        dataKey="tps"
                        stroke="var(--color-tps)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="latency"
                        stroke="var(--color-latency)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2.5">
                  <Bullet />
                  PEAK TPS
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-accent pt-6 rounded-b-lg">
                <p className="text-4xl md:text-5xl font-display">2,900</p>
                <p className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide mt-4">
                  HIGHEST IN 24H
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2.5">
                  <Bullet />
                  AVG LATENCY
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-accent pt-6 rounded-b-lg">
                <p className="text-4xl md:text-5xl font-display">405ms</p>
                <p className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide mt-4">
                  AVERAGE SLOT TIME
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Validators Tab */}
        <TabsContent value="validators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <Bullet />
                VALIDATOR DISTRIBUTION
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="w-full bg-accent rounded-lg p-6">
                <ChartContainer
                  config={{
                    active: {
                      label: "Active",
                      color: "var(--chart-1)",
                    },
                    inactive: {
                      label: "Inactive",
                      color: "var(--chart-2)",
                    },
                  }}
                  className="h-[350px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={validatorDistribution} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" opacity={0.3} />
                      <XAxis
                        dataKey="name"
                        stroke="var(--muted-foreground)"
                        tick={{ fontSize: 12, dy: 10 }}
                        label={{ value: "Status", position: "insideBottomRight", offset: -10, fontSize: 12 }}
                      />
                      <YAxis
                        stroke="var(--muted-foreground)"
                        tick={{ fontSize: 12, dx: -10 }}
                        label={{ value: "Count", angle: -90, position: "insideLeft", fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Bar dataKey="value" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2.5">
                  <Bullet />
                  ACTIVE VALIDATORS
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-accent pt-6 rounded-b-lg">
                <p className="text-4xl md:text-5xl font-display">{metrics.validatorCount}</p>
                <p className="text-xs md:text-sm font-medium text-success tracking-wide mt-4">OPERATIONAL</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2.5">
                  <Bullet />
                  NETWORK HEALTH
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-accent pt-6 rounded-b-lg">
                <p className="text-4xl md:text-5xl font-display">99.9%</p>
                <p className="text-xs md:text-sm font-medium text-success tracking-wide mt-4">UPTIME</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardPageLayout>
  )
}
