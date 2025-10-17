import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import BracketsIcon from "@/components/icons/brackets"

export default function DocumentationPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Documentation",
        description: "Learn how to use Onyxlytics",
        icon: BracketsIcon,
      }}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <Bullet />
              GETTING STARTED
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">What is Onyxlytics?</h3>
              <p className="text-sm text-muted-foreground">
                Onyxlytics is a blockchain analytics platform for Solana that provides real-time network metrics,
                advanced data visualization, and custom query capabilities. It helps analysts and developers understand
                Solana network activity, validator performance, and transaction patterns.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Key Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Real-time Solana network metrics (TPS, TVL, Active Wallets)</li>
                <li>Advanced data visualizations and performance charts</li>
                <li>Custom query editor for blockchain data analysis</li>
                <li>Network health monitoring and validator tracking</li>
                <li>Save and manage custom queries</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 text-base">
              <Bullet />
              DASHBOARD
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Overview</h3>
              <p className="text-sm text-muted-foreground">
                The Dashboard provides a real-time overview of Solana network metrics. It displays key performance
                indicators including Transactions Per Second (TPS), Network Total Value Locked (TVL), and Active
                Wallets.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Metrics Explained</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">TPS (Transactions/Sec):</span> Current transaction throughput of the
                  network
                </p>
                <p>
                  <span className="font-medium">Network TVL:</span> Total value locked in Solana programs and protocols
                </p>
                <p>
                  <span className="font-medium">Active Wallets:</span> Number of active wallet addresses on the network
                </p>
                <p>
                  <span className="font-medium">Slot Time:</span> Average time between block production
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Query Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 text-base">
              <Bullet />
              QUERY EDITOR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">How to Use</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Navigate to the Query Editor page</li>
                <li>Enter your Solana query in the editor</li>
                <li>Click "EXECUTE QUERY" to run the query</li>
                <li>View results in the result panel below</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Example Queries</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-mono bg-accent px-2 py-1 rounded">SELECT slot FROM solana_network</span>
                </p>
                <p className="text-xs">Get the current slot number</p>
                <p>
                  <span className="font-mono bg-accent px-2 py-1 rounded">SELECT validators FROM solana_network</span>
                </p>
                <p className="text-xs">Get total active validators</p>
                <p>
                  <span className="font-mono bg-accent px-2 py-1 rounded">
                    SELECT slot, validators, transaction_count FROM solana_network
                  </span>
                </p>
                <p className="text-xs">Get comprehensive network health metrics</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Saving Queries</h3>
              <p className="text-sm text-muted-foreground">
                After writing a query, click "SAVE QUERY" to store it for future use. Saved queries appear in the "Saved
                Queries" section and can be quickly loaded with a single click.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Visualizations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 text-base">
              <Bullet />
              VISUALIZATIONS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Overview Tab</h3>
              <p className="text-sm text-muted-foreground">
                Displays blockchain metrics in a comprehensive chart format, showing trends and patterns in network
                activity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Performance Tab</h3>
              <p className="text-sm text-muted-foreground">
                Shows network performance metrics including TPS trends and latency over time. Includes peak TPS and
                average latency statistics for the last 24 hours.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Validators Tab</h3>
              <p className="text-sm text-muted-foreground">
                Displays validator distribution and network health status. Shows the number of active validators and
                overall network uptime percentage.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Network Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 text-base">
              <Bullet />
              NETWORK HEALTH
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Monitoring Network Status</h3>
              <p className="text-sm text-muted-foreground">
                The Network Health page provides real-time monitoring of Solana network status, including validator
                count, slot time, and overall network health indicators.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Key Indicators</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Network Status: Current operational state</li>
                <li>Validator Nodes: Number of active validators</li>
                <li>Slot Time: Average time between blocks</li>
                <li>Network Uptime: Percentage of time network is operational</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Saved Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 text-base">
              <Bullet />
              SAVED QUERIES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Managing Your Queries</h3>
              <p className="text-sm text-muted-foreground">
                The Saved Queries page allows you to view, manage, and execute all your previously saved queries. Each
                query is stored with its name, description, and execution history.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Actions</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  <span className="font-medium">Load:</span> Load a saved query into the editor
                </li>
                <li>
                  <span className="font-medium">Delete:</span> Remove a saved query
                </li>
                <li>
                  <span className="font-medium">Execute:</span> Run a query directly from the list
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tips & Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 text-base">
              <Bullet />
              TIPS & BEST PRACTICES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Use example queries as templates for your custom queries</li>
              <li>Save frequently used queries for quick access</li>
              <li>Monitor network health regularly to track trends</li>
              <li>Use visualizations to identify patterns and anomalies</li>
              <li>Check the dashboard for real-time network status</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  )
}
