import { formatPrice } from './normalize'

export function buildOfferStats(rows = []) {
  const priced = rows.filter(
    (r) => r.price != null && !Number.isNaN(r.price) && r.price > 0,
  )
  const withStock = rows.filter((r) => r.stock > 0)
  const originals = rows.filter((r) => r.kind === 'original')
  const analogues = rows.filter((r) => r.kind === 'analogue')

  const prices = priced.map((r) => r.price)
  const minPrice = prices.length ? Math.min(...prices) : null
  const maxPrice = prices.length ? Math.max(...prices) : null
  const avgPrice = prices.length
    ? prices.reduce((a, b) => a + b, 0) / prices.length
    : null

  const totalStock = rows.reduce((s, r) => s + (r.stock || 0), 0)

  const brandMap = new Map()
  for (const row of rows) {
    brandMap.set(row.brand, (brandMap.get(row.brand) || 0) + 1)
  }
  const topBrands = [...brandMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({
      name,
      count,
      pct: rows.length ? Math.round((count / rows.length) * 100) : 0,
    }))

  return {
    total: rows.length,
    originals: originals.length,
    analogues: analogues.length,
    inStock: withStock.length,
    stockShare: rows.length ? Math.round((withStock.length / rows.length) * 100) : 0,
    totalStock,
    minPrice,
    maxPrice,
    avgPrice,
    topBrands,
    labels: {
      minPrice: formatPrice(minPrice),
      maxPrice: formatPrice(maxPrice),
      avgPrice: formatPrice(avgPrice),
    },
  }
}
