// Solana RPC client for fetching blockchain data
const RPC_URL = "https://api.mainnet-beta.solana.com"

interface RpcRequest {
  jsonrpc: string
  id: number
  method: string
  params: unknown[]
}

async function makeRpcCall(method: string, params: unknown[] = []): Promise<unknown> {
  const request: RpcRequest = {
    jsonrpc: "2.0",
    id: 1,
    method,
    params,
  }

  try {
    const response = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })

    const data = (await response.json()) as { result?: unknown; error?: unknown }
    if (data.error) {
      throw new Error(`RPC Error: ${JSON.stringify(data.error)}`)
    }
    return data.result
  } catch (error) {
    console.error(`[v0] RPC call failed for ${method}:`, error)
    throw error
  }
}

export async function getSolanaMetrics() {
  try {
    const [slotInfo, supply, versionInfo] = await Promise.all([
      makeRpcCall("getSlot"),
      makeRpcCall("getSupply"),
      makeRpcCall("getVersion"),
    ])

    return {
      slot: slotInfo,
      supply,
      version: versionInfo,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("[v0] Failed to fetch Solana metrics:", error)
    throw error
  }
}

export async function getTransactionCount() {
  try {
    const count = await makeRpcCall("getTransactionCount")
    return count
  } catch (error) {
    console.error("[v0] Failed to fetch transaction count:", error)
    throw error
  }
}

export async function getClusterNodes() {
  try {
    const nodes = await makeRpcCall("getClusterNodes")
    return nodes
  } catch (error) {
    console.error("[v0] Failed to fetch cluster nodes:", error)
    throw error
  }
}

export async function getBlockTime(slot: number) {
  try {
    const blockTime = await makeRpcCall("getBlockTime", [slot])
    return blockTime
  } catch (error) {
    console.error("[v0] Failed to fetch block time:", error)
    throw error
  }
}

export async function executeQuery(query: string) {
  // Parse and execute custom queries
  // This is a simplified version - in production, you'd want more robust parsing
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes("slot")) {
    return getSolanaMetrics()
  } else if (lowerQuery.includes("transaction")) {
    return getTransactionCount()
  } else if (lowerQuery.includes("nodes") || lowerQuery.includes("validators")) {
    return getClusterNodes()
  }

  throw new Error("Query not recognized")
}
