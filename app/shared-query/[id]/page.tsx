"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { getQueryById } from "@/lib/queries"
import type { SavedQuery } from "@/lib/queries"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import DashboardPageLayout from "@/components/dashboard/layout"
import BracketsIcon from "@/components/icons/brackets"

export default function SharedQueryPage() {
  const params = useParams()
  const [query, setQuery] = useState<SavedQuery | null>(null)

  useEffect(() => {
    if (params.id) {
      const savedQuery = getQueryById(params.id as string)
      setQuery(savedQuery)
    }
  }, [params.id])

  if (!query) {
    return (
      <DashboardPageLayout
        header={{
          title: "Shared Query",
          description: "Query not found",
          icon: BracketsIcon,
        }}
      >
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Query not found.</p>
          </CardContent>
        </Card>
      </DashboardPageLayout>
    )
  }

  return (
    <DashboardPageLayout
      header={{
        title: query.name,
        description: query.description || "Shared Solana Query",
        icon: BracketsIcon,
      }}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <Bullet />
              QUERY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-3 bg-accent rounded text-sm font-mono">{query.query}</pre>
          </CardContent>
        </Card>

        {query.chartData && query.chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <Bullet />
                VISUALIZATION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={query.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Area type="monotone" dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {query.result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <Bullet />
                RESULT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-64 bg-accent p-3 rounded">
                {JSON.stringify(query.result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardPageLayout>
  )
}