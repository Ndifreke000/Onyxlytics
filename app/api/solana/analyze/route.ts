import { analyzeContract } from "@/lib/solana-eda"

export async function POST(request: Request) {
  try {
    const { address } = await request.json()

    if (!address || typeof address !== 'string') {
      return Response.json(
        { success: false, error: "Valid contract address is required" },
        { status: 400 }
      )
    }

    if (address.length < 32 || address.length > 44) {
      return Response.json(
        { success: false, error: "Invalid Solana address format" },
        { status: 400 }
      )
    }

    const contractInfo = await analyzeContract(address)

    return Response.json({
      success: true,
      data: contractInfo,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Analysis failed",
      },
      { status: 500 }
    )
  }
}