"use client"

import { useEffect, useState, useRef } from "react"

export interface SolanaMetrics {
  tps: number
  tvl: string
  activeWallets: string
  validatorCount: number
  avgSlotTime: number
  networkStatus: "healthy" | "degraded" | "critical"
  lastUpdate: string
  isLive: boolean
  source: "rpc" | "fallback"
}

const defaultMetrics: SolanaMetrics = {
  tps: 2847,
  tvl: "$8.2B",
  activeWallets: "1.2M",
  validatorCount: 3847,
  avgSlotTime: 412,
  networkStatus: "healthy",
  lastUpdate: new Date().toISOString(),
  isLive: false,
  source: "fallback",
}

export function useSolanaMetrics(refreshInterval = 1000) {
  const [metrics, setMetrics] = useState<SolanaMetrics>(defaultMetrics)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    const fetchMetrics = async () => {
      if (!isMountedRef.current) return

      try {
        console.log("[v0] Fetching metrics from API...")
        const response = await fetch("/api/solana/metrics", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const result = (await response.json()) as {
          success: boolean
          data?: {
            tps?: number
            tvl?: string
            activeWallets?: string
            validatorCount?: number
            avgSlotTime?: number
            timestamp?: string
            source?: "rpc" | "fallback"
          }
          error?: string
        }

        if (!isMountedRef.current) return

        if (result.data) {
          const newMetrics: SolanaMetrics = {
            tps: result.data.tps ?? defaultMetrics.tps,
            tvl: result.data.tvl ?? defaultMetrics.tvl,
            activeWallets: result.data.activeWallets ?? defaultMetrics.activeWallets,
            validatorCount: result.data.validatorCount ?? defaultMetrics.validatorCount,
            avgSlotTime: result.data.avgSlotTime ?? defaultMetrics.avgSlotTime,
            networkStatus: "healthy",
            lastUpdate: result.data.timestamp ?? new Date().toISOString(),
            isLive: result.data.source === "rpc",
            source: result.data.source ?? "fallback",
          }

          console.log(
            `[v0] Metrics updated - TPS: ${newMetrics.tps}, TVL: ${newMetrics.tvl}, Source: ${newMetrics.source}`,
          )

          setMetrics(newMetrics)
          setError(null)
        }

        setLoading(false)
      } catch (err) {
        console.error("[v0] Failed to fetch metrics:", err)
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : "Failed to fetch metrics")
          setLoading(false)
        }
      }
    }

    // Initial fetch
    fetchMetrics()

    intervalRef.current = setInterval(fetchMetrics, refreshInterval)

    return () => {
      isMountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refreshInterval])

  return { metrics, loading, error }
}
