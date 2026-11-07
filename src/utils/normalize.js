/** Минимальная цена и суммарный остаток по складам */
export function summarizeWarehouses(warehouses = []) {
  if (!warehouses.length) {
    return { price: null, stock: 0 }
  }

  let price = null
  let stock = 0

  for (const wh of warehouses) {
    const p = Number(wh.price)
    const s = Number(wh.stock) || 0
    stock += s
    if (!Number.isNaN(p) && (price === null || p < price)) price = p
  }

  return { price, stock }
}

/** Уникальные бренды из ответа этапа 1 */
export function extractBrands(goods = []) {
  const seen = new Set()
  const brands = []

  for (const item of goods) {
    const brand = item?.brand?.trim()
    if (!brand || seen.has(brand)) continue
    // пустая структура ответа при «не найдено»
    if (!item.number && !item.name && !item.goodsID) continue
    seen.add(brand)
    brands.push(brand)
  }

  return brands.sort((a, b) => a.localeCompare(b, 'ru'))
}

/** Позиция для таблицы: оригинал + аналоги */
export function flattenOffers(goods = []) {
  const rows = []

  const push = (item, kind) => {
    if (!item?.brand && !item?.name) return
    if (!item.number && !item.name && !item.goodsID) return

    const { price, stock } = summarizeWarehouses(item.warehouses)
    rows.push({
      id: item.goodsID || `${item.brand}-${item.number}-${kind}`,
      brand: item.brand || '—',
      number: item.number || '—',
      name: item.name || 'Без названия',
      price: price ?? (item.price != null ? Number(item.price) : null),
      stock: stock || Number(item.count) || 0,
      kind,
    })
  }

  for (const item of goods) {
    push(item, 'original')
    for (const analogue of item.analogues || []) {
      push(analogue, 'analogue')
    }
  }

  return rows
}

export function formatPrice(value) {
  if (value == null || Number.isNaN(value) || value <= 0) return '—'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(value)
}

export function isEmptyGoods(goods) {
  if (!goods?.length) return true
  return goods.every(
    (item) => !item?.brand && !item?.number && !item?.name && !item?.goodsID,
  )
}
