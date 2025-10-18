// Solana Contract EDA (Exploratory Data Analysis)

export interface ContractInfo {
  address: string
  owner: string
  executable: boolean
  lamports: number
  dataSize: number
  programId: string
  accountType: string
  tokenInfo?: {
    mint?: string
    decimals?: number
    supply?: string
    symbol?: string
    name?: string
  }
  transactions?: {
    total: number
    recent: number
  }
  lastActivity?: string
}

const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"

async function makeRpcCall(method: string, params: unknown[] = []): Promise<unknown> {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
  })

  const data = await response.json()
  if (data.error) throw new Error(data.error.message)
  return data.result
}

export async function analyzeContract(address: string): Promise<ContractInfo> {
  try {
    // Get account info
    const accountInfo = await makeRpcCall("getAccountInfo", [
      address,
      { encoding: "base64" }
    ]) as any

    if (!accountInfo?.value) {
      throw new Error("Account not found")
    }

    const account = accountInfo.value
    
    // Basic account info
    const contractInfo: ContractInfo = {
      address,
      owner: account.owner,
      executable: account.executable,
      lamports: account.lamports,
      dataSize: account.data?.[0]?.length || 0,
      programId: account.owner,
      accountType: account.executable ? "Program" : "Account",
    }

    // Try to get token info if it's a token account
    try {
      if (account.owner === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
        const tokenInfo = await makeRpcCall("getTokenAccountBalance", [address]) as any
        if (tokenInfo?.value) {
          contractInfo.tokenInfo = {
            decimals: tokenInfo.value.decimals,
            supply: tokenInfo.value.amount,
          }
        }
      }
    } catch (e) {
      // Not a token account
    }

    // Get recent transaction signatures
    try {
      const signatures = await makeRpcCall("getSignaturesForAddress", [
        address,
        { limit: 10 }
      ]) as any[]

      if (signatures?.length > 0) {
        contractInfo.transactions = {
          total: signatures.length,
          recent: signatures.length,
        }
        contractInfo.lastActivity = new Date(signatures[0].blockTime * 1000).toISOString()
      }
    } catch (e) {
      // No transaction history available
    }

    return contractInfo
  } catch (error) {
    throw new Error(`Failed to analyze contract: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}