"use client"

import { useEffect, useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import BracketsIcon from "@/components/icons/brackets"
import mockDataJson from "@/mock.json"
import { useSolanaMetrics } from "@/hooks/use-solana-metrics"
import type { MockData } from "@/types/dashboard"

const mockData = mockDataJson as MockData

interface HealthIndicator {
  label: string
  value: string | number
  status: "healthy" | "warning" | "critical"
  trend?: "up" | "down" | "stable"
}

export default function NetworkHealthPage() {
  const { metrics } = useSolanaMetrics(10000)
  const [indicators, setIndicators] = useState<HealthIndicator[]>([
    {
      label: "Network Status",
      value: "OPERATIONAL",
      status: "healthy",
      trend: "stable",
    },
    {
      label: "Validator Nodes",
      value: metrics.validatorCount,
      status: "healthy",
      trend: "up",
    },
    {
      label: "Avg Slot Time",
      value: `${metrics.avgSlotTime}ms`,
      status: "healthy",
      trend: "stable",
    },
    {
      label: "Current TPS",
      value: metrics.tps,
      status: "healthy",
      trend: "up",
    },
  ])

  useEffect(() => {
    setIndicators([
      {
        label: "Network Status",
        value: "OPERATIONAL",
        status: "healthy",
        trend: "stable",
      },
      {
        label: "Validator Nodes",
        value: metrics.validatorCount,
        status: "healthy",
        trend: "up",
      },
      {
        label: "Avg Slot Time",
        value: `${metrics.avgSlotTime}ms`,
        status: "healthy",
        trend: "stable",
      },
      {
        label: "Current TPS",
        value: metrics.tps,
        status: "healthy",
        trend: "up",
      },
    ])
  }, [metrics])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-success"
      case "warning":
        return "text-warning"
      case "critical":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return "↑"
      case "down":
        return "↓"
      default:
        return "→"
    }
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Network Health",
        description: "Real-time Solana network status and metrics",
        icon: BracketsIcon,
      }}
    >
      {/* Health Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {mockData.securityStatus.map((status, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm">
                <Bullet />
                {status.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent pt-2 md:pt-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-display">{status.value}</span>
                <span className={`text-sm font-medium ${getStatusColor(status.variant)}`}>{status.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Health Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <Bullet />
            HEALTH INDICATORS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {indicators.map((indicator, index) => (
              <div
                key={index}
                className="p-4 bg-accent rounded-lg border border-muted flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">{indicator.label}</p>
                  <p className="text-lg font-display">{indicator.value}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getStatusColor(indicator.status)}`}>
                    {indicator.status.toUpperCase()}
                  </p>
                  <p className="text-xl">{getTrendIcon(indicator.trend)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <Bullet />
            PERFORMANCE METRICS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-accent rounded-lg border border-muted">
              <p className="text-xs font-medium text-muted-foreground mb-2">TRANSACTIONS PER SECOND</p>
              <p className="text-3xl font-display">{metrics.tps}</p>
              <p className="text-xs text-success mt-2">↑ Optimal</p>
            </div>
            <div className="p-4 bg-accent rounded-lg border border-muted">
              <p className="text-xs font-medium text-muted-foreground mb-2">AVERAGE SLOT TIME</p>
              <p className="text-3xl font-display">{metrics.avgSlotTime}ms</p>
              <p className="text-xs text-success mt-2">↑ Optimal</p>
            </div>
            <div className="p-4 bg-accent rounded-lg border border-muted">
              <p className="text-xs font-medium text-muted-foreground mb-2">ACTIVE VALIDATORS</p>
              <p className="text-3xl font-display">{metrics.validatorCount}</p>
              <p className="text-xs text-success mt-2">↑ Healthy</p>
            </div>
            <div className="p-4 bg-accent rounded-lg border border-muted">
              <p className="text-xs font-medium text-muted-foreground mb-2">LAST UPDATE</p>
              <p className="text-xs font-mono">{new Date(metrics.lastUpdate).toLocaleTimeString()}</p>
              <p className="text-xs text-success mt-2">Live</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardPageLayout>
  )
}
