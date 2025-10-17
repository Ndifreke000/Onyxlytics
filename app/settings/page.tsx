"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import BracketsIcon from "@/components/icons/brackets"

export default function SettingsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Settings",
        description: "Configure your Onyxlytics preferences",
        icon: BracketsIcon,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RPC Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <Bullet />
              RPC CONFIGURATION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">RPC ENDPOINT</label>
              <input
                type="text"
                value="https://api.mainnet-beta.solana.com"
                disabled
                className="w-full mt-2 p-2 bg-accent border border-muted rounded text-sm text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-2">Currently using Solana Mainnet Beta RPC</p>
            </div>
          </CardContent>
        </Card>

        {/* Query Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <Bullet />
              QUERY SETTINGS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto-save Queries</label>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Real-time Updates</label>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Data Refresh */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <Bullet />
              DATA REFRESH
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">REFRESH INTERVAL</label>
              <select className="w-full mt-2 p-2 bg-accent border border-muted rounded text-sm">
                <option>5 seconds</option>
                <option>10 seconds</option>
                <option>30 seconds</option>
                <option>1 minute</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <Bullet />
              ABOUT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">VERSION</p>
              <p className="text-sm">1.0.0 MVP</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">NETWORK</p>
              <p className="text-sm">Solana Mainnet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  )
}
