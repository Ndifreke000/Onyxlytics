/**
 * Utility functions for formatting numbers and values
 */

export function formatLargeNumber(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value
  
  if (isNaN(numValue)) return value.toString()
  
  const absValue = Math.abs(numValue)
  
  if (absValue >= 1e12) {
    return `${(numValue / 1e12).toFixed(1)}T`
  } else if (absValue >= 1e9) {
    return `${(numValue / 1e9).toFixed(1)}B`
  } else if (absValue >= 1e6) {
    return `${(numValue / 1e6).toFixed(1)}M`
  } else if (absValue >= 1e3) {
    return `${(numValue / 1e3).toFixed(1)}K`
  }
  
  return numValue.toLocaleString()
}

export function formatTVL(value: string): string {
  // Extract numeric value from TVL string like "$8.2B" or "$16,640,071,091.4B"
  const match = value.match(/\$?([\d,.-]+)([KMBT]?)/)
  if (!match) return value
  
  const [, numStr, suffix] = match
  const num = parseFloat(numStr.replace(/,/g, ''))
  
  if (isNaN(num)) return value
  
  // If already has suffix, use it, otherwise format the number
  if (suffix) {
    return `$${num.toFixed(1)}${suffix}`
  }
  
  return `$${formatLargeNumber(num)}`
}

export function parseNumericValue(value: string) {
  const match = value.match(/^([^\\d.-]*)([+-]?\\d*\\.?\\d+)([^\\d]*)$/)
  
  if (match) {
    const [, prefix, numStr, suffix] = match
    return {
      prefix: prefix || "",
      numericValue: parseFloat(numStr),
      suffix: suffix || "",
      isNumeric: !isNaN(parseFloat(numStr)),
    }
  }
  
  return {
    prefix: "",
    numericValue: 0,
    suffix: value,
    isNumeric: false,
  }
}