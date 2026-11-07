const STORAGE_KEY = 'fp-search-v1'

export function readSearchState() {
  const fromUrl = readFromUrl()
  if (fromUrl) return fromUrl

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return normalize(JSON.parse(raw))
  } catch {
    return null
  }
}

export function writeSearchState(state) {
  const payload = {
    number: state.number || '',
    brand: state.brand || null,
    step: state.step || 'idle',
  }

  try {
    if (!payload.number) sessionStorage.removeItem(STORAGE_KEY)
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* private mode */
  }

  writeToUrl(payload)
}

function readFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const number = params.get('number')?.trim() || ''
  if (!number) return null
  const brand = params.get('brand')?.trim() || null
  return normalize({ number, brand })
}

function writeToUrl({ number, brand }) {
  const params = new URLSearchParams()
  if (number) params.set('number', number)
  if (number && brand) params.set('brand', brand)

  const qs = params.toString()
  const next = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
  const current = `${window.location.pathname}${window.location.search}`
  if (next !== current) {
    window.history.replaceState(null, '', next)
  }
}

function normalize({ number = '', brand = null }) {
  const n = String(number || '').trim()
  if (!n) {
    return { number: '', brand: null, step: 'idle' }
  }
  const b = brand ? String(brand).trim() : null
  return {
    number: n,
    brand: b,
    step: b ? 'offers' : 'brands',
  }
}
