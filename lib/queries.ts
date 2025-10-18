// Saved queries management
export interface SavedQuery {
  id: string
  name: string
  query: string
  description: string
  createdAt: string
  lastRun?: string
  tags: string[]
  result?: any
  chartData?: any[]
}

const STORAGE_KEY = "onyxlytics_saved_queries"

export function getSavedQueries(): SavedQuery[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveQuery(query: Omit<SavedQuery, "id" | "createdAt">): SavedQuery {
  const newQuery: SavedQuery = {
    ...query,
    id: `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  }

  const queries = getSavedQueries()
  queries.push(newQuery)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queries))
  return newQuery
}

export function getQueryById(id: string): SavedQuery | null {
  const queries = getSavedQueries()
  return queries.find(q => q.id === id) || null
}

export function deleteQuery(id: string): void {
  const queries = getSavedQueries()
  const filtered = queries.filter((q) => q.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function updateQueryLastRun(id: string): void {
  const queries = getSavedQueries()
  const query = queries.find((q) => q.id === id)
  if (query) {
    query.lastRun = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queries))
  }
}
