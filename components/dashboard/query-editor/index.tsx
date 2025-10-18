"use client"

import { useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bullet } from "@/components/ui/bullet"
import { getSavedQueries, saveQuery, deleteQuery, updateQueryLastRun } from "@/lib/queries"
import { exampleQueries } from "@/lib/example-queries"
import type { SavedQuery } from "@/lib/queries"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

export default function QueryEditor() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(getSavedQueries())
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [queryName, setQueryName] = useState("")
  const [queryDescription, setQueryDescription] = useState("")
  const [showExamples, setShowExamples] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const executeQuery = async () => {
    if (!query.trim()) {
      setError("Query cannot be empty")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/solana/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      const data = (await response.json()) as { success: boolean; result?: unknown; error?: string }

      if (data.success) {
        setResult(data.result)
        // Generate chart data if result is array-like
        if (Array.isArray(data.result)) {
          setChartData(data.result.slice(0, 20)) // Limit to 20 points
        } else if (typeof data.result === 'object' && data.result) {
          // Convert object to chart-friendly format
          const entries = Object.entries(data.result).map(([key, value], index) => ({
            name: key,
            value: typeof value === 'number' ? value : index,
            index
          }))
          setChartData(entries)
        }
      } else {
        setError(data.error || "Query execution failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to execute query")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveQuery = () => {
    if (!queryName.trim()) {
      setError("Query name is required")
      return
    }

    const newQuery = saveQuery({
      name: queryName,
      query,
      description: queryDescription,
      tags: [],
      result: result,
      chartData: chartData
    })

    setSavedQueries([...savedQueries, newQuery])
    setQueryName("")
    setQueryDescription("")
    setShowSaveDialog(false)
    
    // Generate shareable URL
    const shareId = newQuery.id
    const url = `${window.location.origin}/shared-query/${shareId}`
    setShareUrl(url)
  }

  const handleLoadQuery = (savedQuery: SavedQuery) => {
    setQuery(savedQuery.query)
    updateQueryLastRun(savedQuery.id)
  }

  const handleLoadExample = (exampleQuery: (typeof exampleQueries)[0]) => {
    setQuery(exampleQuery.query)
    setShowExamples(false)
  }

  const handleDeleteQuery = (id: string) => {
    deleteQuery(id)
    setSavedQueries(savedQueries.filter((q) => q.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Query Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <Bullet />
            QUERY EDITOR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">ENTER SOLANA QUERY</label>
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Example: SELECT slot, validators, transaction_count FROM solana_network\n\nSupported queries:\n- Network metrics: slot, supply, validators\n- Transaction data: transaction_count, recent_blocks\n- Account info: account_balance, token_info"
              className="w-full h-80 p-4 bg-accent border border-muted rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ minHeight: '320px', maxHeight: '600px' }}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={executeQuery} disabled={loading} className="flex-1">
              {loading ? "EXECUTING..." : "EXECUTE QUERY"}
            </Button>
            <Button onClick={() => setShowSaveDialog(true)} variant="outline" disabled={!query.trim()}>
              SAVE QUERY
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Chart Visualization */}
              {chartData.length > 0 && (
                <div className="p-4 bg-accent rounded-lg border border-muted">
                  <p className="text-xs font-medium text-muted-foreground mb-3">VISUALIZATION</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" opacity={0.3} />
                        <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="var(--chart-1)" 
                          fill="var(--chart-1)" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              
              {/* Raw Result */}
              <div className="p-4 bg-accent rounded-lg border border-muted">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-muted-foreground">RAW RESULT</p>
                  {shareUrl && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                    >
                      COPY SHARE LINK
                    </Button>
                  )}
                </div>
                <pre className="text-xs overflow-auto max-h-64 text-foreground bg-background p-3 rounded border">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Example Queries */}
      {showExamples && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 text-sm">
              <Bullet />
              EXAMPLE QUERIES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleLoadExample(example)}
                  className="w-full text-left p-3 rounded-lg border border-muted bg-accent hover:border-primary transition-colors"
                >
                  <p className="font-medium text-sm">{example.name}</p>
                  <p className="text-xs text-muted-foreground">{example.description}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-1 truncate">{example.query}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Query Dialog */}
      {showSaveDialog && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-sm">SAVE QUERY</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="text"
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
              placeholder="Query name"
              className="w-full p-2 bg-accent border border-muted rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              value={queryDescription}
              onChange={(e) => setQueryDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full h-20 p-2 bg-accent border border-muted rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveQuery} className="flex-1">
                SAVE
              </Button>
              <Button onClick={() => setShowSaveDialog(false)} variant="outline" className="flex-1">
                CANCEL
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Queries */}
      {savedQueries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <Bullet />
              SAVED QUERIES ({savedQueries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedQueries.map((savedQuery) => (
                <div
                  key={savedQuery.id}
                  className="p-3 bg-accent rounded-lg border border-muted flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{savedQuery.name}</p>
                    {savedQuery.description && (
                      <p className="text-xs text-muted-foreground truncate">{savedQuery.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 truncate">{savedQuery.query}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button onClick={() => handleLoadQuery(savedQuery)} size="sm" variant="outline">
                      LOAD
                    </Button>
                    <Button
                      onClick={() => handleDeleteQuery(savedQuery.id)}
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                    >
                      DELETE
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
