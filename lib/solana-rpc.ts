// This prevents CORS errors and ensures proper server-side handling

const RPC_URL = "https://api.mainnet-beta.solana.com"

interface RpcRequest {
  jsonrpc: string
  id: number
  method: string
  params: unknown[]
}

// Cache for RPC responses with TTL
const responseCache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 1000 // 1 second for real-time updates

async function makeRpcCall(method: string, params: unknown[] = []): Promise<unknown> {
  const cacheKey = `${method}:${JSON.stringify(params)}`

  // Check cache first
  const cached = responseCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[v0] Cache hit for ${method}`)
    return cached.data
  }

  const request: RpcRequest = {
    jsonrpc: "2.0",
    id: 1,
    method,
    params,
  }

  try {
    console.log(`[v0] Making RPC call: ${method}`)
    const response = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = (await response.json()) as { result?: unknown; error?: unknown }

    if (data.error) {
      throw new Error(`RPC Error: ${JSON.stringify(data.error)}`)
    }

    // Cache successful response
    responseCache.set(cacheKey, { data: data.result, timestamp: Date.now() })
    console.log(`[v0] RPC call successful for ${method}`)
    return data.result
  } catch (error) {
    console.error(`[v0] RPC call failed for ${method}:`, error)
    throw error
  }
}

export async function getSolanaMetrics() {
  try {
    const [slotInfo, supply] = await Promise.all([makeRpcCall("getSlot"), makeRpcCall("getSupply")])

    return {
      slot: slotInfo,
      supply,
      timestamp: new Date().toISOString(),
      source: "rpc",
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
