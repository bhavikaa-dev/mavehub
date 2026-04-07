export function fmt(n) {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr'
  if (n >= 100000)   return (n / 100000).toFixed(1) + 'L'
  if (n >= 1000)     return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}
