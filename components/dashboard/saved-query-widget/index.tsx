"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bullet } from "@/components/ui/bullet"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"
import type { SavedQuery } from "@/lib/queries"

interface SavedQueryWidgetProps {
  query: SavedQuery
  onRemove?: () => void
}

export default function SavedQueryWidget({ query, onRemove }: SavedQueryWidgetProps) {
  const copyShareLink = () => {
    const url = `${window.location.origin}/shared-query/${query.id}`
    navigator.clipboard.writeText(url)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2.5 text-sm">
            <Bullet />
            {query.name}
          </CardTitle>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={copyShareLink}>
              SHARE
            </Button>
            {onRemove && (
              <Button size="sm" variant="outline" onClick={onRemove}>
                ×
              </Button>
            )}
          </div>
        </div>
        {query.description && (
          <p className="text-xs text-muted-foreground">{query.description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {query.chartData && query.chartData.length > 0 ? (
          <div className="h-32 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={query.chartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--chart-1)" 
                  fill="var(--chart-1)" 
                  fillOpacity={0.3}
                  strokeWidth={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 bg-accent rounded flex items-center justify-center mb-3">
            <p className="text-xs text-muted-foreground">No visualization</p>
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          <p className="truncate font-mono">{query.query}</p>
          <p className="mt-1">Created: {new Date(query.createdAt).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}