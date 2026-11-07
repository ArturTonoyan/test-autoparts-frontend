import { QueryClient, dehydrate, hydrate } from '@tanstack/react-query'

const CACHE_KEY = 'fp-rq-cache-v1'

export function createQueryClient() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60_000,
        gcTime: 30 * 60_000,
      },
    },
  })

  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (raw) hydrate(client, JSON.parse(raw))
  } catch {
    /* ignore broken cache */
  }

  let timer
  const persist = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        const state = dehydrate(client, {
          shouldDehydrateQuery: (q) => q.state.status === 'success',
        })
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(state))
      } catch {
        /* quota / private mode */
      }
    }, 250)
  }

  client.getQueryCache().subscribe(persist)
  return client
}
