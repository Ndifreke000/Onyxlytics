"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bullet } from "@/components/ui/bullet"
import type { ContractInfo } from "@/lib/solana-eda"

export default function ContractEDA() {
  const [address, setAddress] = useState("")
  const [result, setResult] = useState<ContractInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeContract = async () => {
    if (!address.trim()) {
      setError("Contract address is required")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/solana/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || "Analysis failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze contract")
    } finally {
      setLoading(false)
    }
  }

  const formatLamports = (lamports: number) => {
    return `${(lamports / 1e9).toFixed(4)} SOL`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <Bullet />
            CONTRACT ANALYZER
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">SOLANA CONTRACT ADDRESS</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Solana contract/account address..."
              className="w-full p-3 bg-accent border border-muted rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button onClick={analyzeContract} disabled={loading} className="w-full">
            {loading ? "ANALYZING..." : "ANALYZE CONTRACT"}
          </Button>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <Bullet />
                BASIC INFO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">ADDRESS</p>
                  <p className="font-mono text-sm break-all">{result.address}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">TYPE</p>
                  <p className="text-sm">{result.accountType}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">OWNER</p>
                  <p className="font-mono text-sm break-all">{result.owner}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">BALANCE</p>
                  <p className="text-sm">{formatLamports(result.lamports)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">DATA SIZE</p>
                  <p className="text-sm">{result.dataSize} bytes</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">EXECUTABLE</p>
                  <p className="text-sm">{result.executable ? "Yes" : "No"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.tokenInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2.5">
                  <Bullet />
                  TOKEN INFO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.tokenInfo.decimals && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">DECIMALS</p>
                      <p className="text-sm">{result.tokenInfo.decimals}</p>
                    </div>
                  )}
                  {result.tokenInfo.supply && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">SUPPLY</p>
                      <p className="text-sm">{result.tokenInfo.supply}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {result.transactions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2.5">
                  <Bullet />
                  ACTIVITY
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">RECENT TRANSACTIONS</p>
                    <p className="text-sm">{result.transactions.recent}</p>
                  </div>
                  {result.lastActivity && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">LAST ACTIVITY</p>
                      <p className="text-sm">{new Date(result.lastActivity).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}