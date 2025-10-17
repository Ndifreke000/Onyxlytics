export const exampleQueries = [
  {
    name: "Current Network Slot",
    query: "SELECT slot FROM solana_network",
    description: "Get the current slot number of the Solana network",
  },
  {
    name: "Validator Count",
    query: "SELECT validators FROM solana_network",
    description: "Get the total number of active validators",
  },
  {
    name: "Transaction Count",
    query: "SELECT transaction_count FROM solana_network",
    description: "Get the total transaction count",
  },
  {
    name: "Network Health",
    query: "SELECT slot, validators, transaction_count FROM solana_network",
    description: "Get comprehensive network health metrics",
  },
  {
    name: "Block Time Analysis",
    query: "SELECT block_time FROM solana_network",
    description: "Analyze block time metrics",
  },
]
