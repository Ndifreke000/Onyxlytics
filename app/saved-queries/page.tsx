"use client"

import { useEffect, useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bullet } from "@/components/ui/bullet"
import BracketsIcon from "@/components/icons/brackets"
import { getSavedQueries, deleteQuery, updateQueryLastRun } from "@/lib/queries"
import type { SavedQuery } from "@/lib/queries"

export default function SavedQueriesPage() {
  const [queries, setQueries] = useState<SavedQuery[]>([])
  const [selectedQuery, setSelectedQuery] = useState<SavedQuery | null>(null)

  useEffect(() => {
    setQueries(getSavedQueries())
  }, [])

  const handleLoadQuery = (query: SavedQuery) => {
    setSelectedQuery(query)
    updateQueryLastRun(query.id)
  }

  const handleDeleteQuery = (id: string) => {
    deleteQuery(id)
    setQueries(queries.filter((q) => q.id !== id))
    if (selectedQuery?.id === id) {
      setSelectedQuery(null)
    }
  }

  const handleExecuteQuery = async (query: SavedQuery) => {
    try {
      const response = await fetch("/api/solana/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.query }),
      })

      const data = (await response.json()) as { success: boolean; result?: unknown }

      if (data.success) {
        setSelectedQuery({ ...query, lastRun: new Date().toISOString() })
      }
    } catch (error) {
      console.error("[v0] Failed to execute query:", error)
    }
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Saved Queries",
        description: "Manage and execute your saved Solana queries",
        icon: BracketsIcon,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queries List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm">
                <Bullet />
                QUERIES ({queries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queries.length === 0 ? (
                <p className="text-xs text-muted-foreground">No saved queries yet. Create one in the Query Editor.</p>
              ) : (
                <div className="space-y-2">
                  {queries.map((query) => (
                    <button
                      key={query.id}
                      onClick={() => handleLoadQuery(query)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedQuery?.id === query.id
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-accent border-muted hover:border-primary"
                      }`}
                    >
                      <p className="font-medium text-sm truncate">{query.name}</p>
                      <p className="text-xs opacity-75 truncate">{query.description || "No description"}</p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Query Details */}
        <div className="lg:col-span-2">
          {selectedQuery ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5">
                    <Bullet />
                    {selectedQuery.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedQuery.description && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">DESCRIPTION</p>
                      <p className="text-sm">{selectedQuery.description}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">QUERY</p>
                    <div className="p-3 bg-accent rounded-lg border border-muted">
                      <pre className="text-xs font-mono overflow-auto max-h-32">{selectedQuery.query}</pre>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleExecuteQuery(selectedQuery)} className="flex-1">
                      EXECUTE
                    </Button>
                    <Button
                      onClick={() => handleDeleteQuery(selectedQuery.id)}
                      variant="outline"
                      className="text-destructive"
                    >
                      DELETE
                    </Button>
                  </div>

                  {selectedQuery.lastRun && (
                    <div className="text-xs text-muted-foreground">
                      Last run: {new Date(selectedQuery.lastRun).toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground text-center">Select a query to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardPageLayout>
  )
}
