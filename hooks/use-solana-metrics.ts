"use client"

import { useEffect, useState } from "react"

export interface SolanaMetrics {
  tps: number
  tvl: string
  activeWallets: string
  validatorCount: number
  avgSlotTime: number
  networkStatus: "healthy" | "degraded" | "critical"
  lastUpdate: string
}

const defaultMetrics: SolanaMetrics = {
  tps: 2847,
  tvl: "$8.2B",
  activeWallets: "1.2M",
  validatorCount: 3847,
  avgSlotTime: 412,
  networkStatus: "healthy",
  lastUpdate: new Date().toISOString(),
}

export function useSolanaMetrics(refreshInterval = 5000) {
  const [metrics, setMetrics] = useState<SolanaMetrics>(defaultMetrics)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/solana/metrics")
        const data = (await response.json()) as {
          success: boolean
          data?: {
            validatorCount?: number
            avgSlotTime?: number
          }
        }

        if (data.success && data.data) {
          setMetrics((prev) => ({
            ...prev,
            validatorCount: data.data?.validatorCount || prev.validatorCount,
            avgSlotTime: data.data?.avgSlotTime || prev.avgSlotTime,
            lastUpdate: new Date().toISOString(),
          }))
          setError(null)
        }
      } catch (err) {
        console.error("[v0] Failed to fetch metrics:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch metrics")
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  return { metrics, loading, error }
}
