"use client"

import { useEffect, useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import DashboardChart from "@/components/dashboard/chart"
import RebelsRanking from "@/components/dashboard/rebels-ranking"
import SecurityStatus from "@/components/dashboard/security-status"
import BracketsIcon from "@/components/icons/brackets"
import ProcessorIcon from "@/components/icons/proccesor"
import BoomIcon from "@/components/icons/boom"
import mockDataJson from "@/mock.json"
import { useSolanaMetrics } from "@/hooks/use-solana-metrics"
import type { MockData, DashboardStat as DashboardStatType } from "@/types/dashboard"

const mockData = mockDataJson as MockData

const iconMap = {
  proccesor: ProcessorIcon,
  boom: BoomIcon,
}

export default function DashboardOverview() {
  const { metrics, loading } = useSolanaMetrics(1000)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  const liveStats: DashboardStatType[] = [
    {
      label: "TRANSACTIONS/SEC",
      value: metrics.tps.toString(),
      description: "CURRENT TPS",
      intent: "positive",
      icon: "proccesor",
      direction: "up",
    },
    {
      label: "NETWORK TVL",
      value: metrics.tvl,
      description: "TOTAL VALUE LOCKED",
      intent: "positive",
      icon: "proccesor",
      direction: "up",
    },
    {
      label: "ACTIVE WALLETS",
      value: metrics.activeWallets,
      description: "24H ACTIVE ADDRESSES",
      intent: "positive",
      icon: "boom",
      tag: "↑ 12% 📈",
    },
  ]

  return (
    <DashboardPageLayout
      header={{
        title: "Solana Analytics",
        description: "Real-time blockchain metrics",
        icon: BracketsIcon,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {liveStats.map((stat, index) => (
          <DashboardStat
            key={index}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            icon={iconMap[stat.icon as keyof typeof iconMap]}
            tag={stat.tag}
            intent={stat.intent}
            direction={stat.direction}
          />
        ))}
      </div>

      <div className="mb-6">
        <DashboardChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RebelsRanking rebels={mockData.rebelsRanking} />
        <SecurityStatus statuses={mockData.securityStatus} />
      </div>
    </DashboardPageLayout>
  )
}
