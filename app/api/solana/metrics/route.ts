import { getSolanaMetrics, getClusterNodes } from "@/lib/solana-rpc"

export async function GET() {
  try {
    const metrics = await getSolanaMetrics()
    const nodes = await getClusterNodes()

    // Calculate derived metrics
    const nodeCount = Array.isArray(nodes) ? nodes.length : 0
    const avgSlotTime = 400 // ms - typical Solana slot time

    return Response.json({
      success: true,
      data: {
        ...metrics,
        validatorCount: nodeCount,
        avgSlotTime,
      },
    })
  } catch (error) {
    console.error("[v0] Metrics API error:", error)
    return Response.json({ success: false, error: "Failed to fetch metrics" }, { status: 500 })
  }
}
