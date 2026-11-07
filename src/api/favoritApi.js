// API отдаёт Access-Control-Allow-Origin: *, поэтому ходим напрямую.
// Vite-прокси на этот хост отвечает 502 (QRATOR).
// HTTPS обязателен для GitHub Pages (иначе mixed content блокирует fetch).
const API_BASE = 'https://api.favorit-parts.ru/hs/hsprice/'
const API_KEY = import.meta.env.VITE_API_KEY

function buildUrl({ number, brand, analogues }) {
  const params = new URLSearchParams()
  params.set('key', API_KEY)
  params.set('number', number.trim())
  if (brand) params.set('brand', brand)
  if (analogues) params.set('analogues', 'on')
  return `${API_BASE}?${params.toString()}`
}

export async function fetchGoods({ number, brand, analogues = false }) {
  let response

  try {
    response = await fetch(buildUrl({ number, brand, analogues }))
  } catch {
    throw new Error('Нет соединения с сервером. Проверьте сеть и повторите попытку.')
  }

  if (!response.ok) {
    throw new Error(`Сервер вернул ошибку (${response.status}).`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(Array.isArray(data.error) ? data.error.join('; ') : String(data.error))
  }

  return data.goods ?? []
}
