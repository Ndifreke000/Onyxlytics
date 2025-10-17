import { executeQuery } from "@/lib/solana-rpc"

export async function POST(request: Request) {
  try {
    const { query } = (await request.json()) as { query: string }

    if (!query || typeof query !== "string") {
      return Response.json({ success: false, error: "Invalid query" }, { status: 400 })
    }

    const result = await executeQuery(query)

    return Response.json({
      success: true,
      query,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Query API error:", error)
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Query execution failed" },
      { status: 500 },
    )
  }
}
