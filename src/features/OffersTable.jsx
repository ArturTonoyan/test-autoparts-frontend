import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  Badge,
  Button,
  Group,
  SegmentedControl,
  Switch,
  Text,
  TextInput,
  Title,
  Select,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowLeft, IconSearch } from '@tabler/icons-react'
import { fetchGoods } from '../api/favoritApi'
import { flattenOffers, formatPrice, isEmptyGoods } from '../utils/normalize'
import { clearBrand } from '../store/searchSlice'
import Loader from '../components/Loader'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'
import SoftCard from '../components/SoftCard'
import FadeIn from '../components/FadeIn'
import FetchingBar from '../components/FetchingBar'
import OffersAnalytics, { SummaryStrip } from './OffersAnalytics'

const ROW_H = 72

export default function OffersTable() {
  const dispatch = useDispatch()
  const { number, brand } = useSelector((s) => s.search)
  const [queryText, setQueryText] = useState('')
  const [kind, setKind] = useState('all')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState('price-asc')
  const [panelH, setPanelH] = useState(0)
  const parentRef = useRef(null)
  const analyticsRef = useRef(null)
  const isMobile = useMediaQuery('(max-width: 760px)')
  const isCompact = useMediaQuery('(max-width: 560px)')

  const query = useQuery({
    queryKey: ['offers', number, brand],
    queryFn: () => fetchGoods({ number, brand, analogues: true }),
    enabled: Boolean(number && brand),
    placeholderData: keepPreviousData,
  })

  const rows = useMemo(
    () => (query.data ? flattenOffers(query.data) : []),
    [query.data],
  )

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase()
    let list = rows

    if (kind !== 'all') list = list.filter((r) => r.kind === kind)
    if (inStockOnly) list = list.filter((r) => r.stock > 0)
    if (q) {
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.brand.toLowerCase().includes(q) ||
          String(r.number).toLowerCase().includes(q),
      )
    }

    const sorted = [...list]
    const priceOf = (r) => (r.price != null && r.price > 0 ? r.price : null)
    sorted.sort((a, b) => {
      if (sort === 'price-asc') return (priceOf(a) ?? Infinity) - (priceOf(b) ?? Infinity)
      if (sort === 'price-desc') return (priceOf(b) ?? -Infinity) - (priceOf(a) ?? -Infinity)
      if (sort === 'stock-desc') return (b.stock || 0) - (a.stock || 0)
      return a.name.localeCompare(b.name, 'ru')
    })
    return sorted
  }, [rows, queryText, kind, inStockOnly, sort])

  useLayoutEffect(() => {
    if (isMobile) {
      setPanelH(0)
      return undefined
    }
    const el = analyticsRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined

    const sync = () => setPanelH(Math.ceil(el.getBoundingClientRect().height))
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => ro.disconnect()
  }, [rows.length, isMobile])

  const virtualizer = useVirtualizer({
    count: isMobile ? 0 : filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_H,
    overscan: 8,
  })

  if (query.isPending && !query.data) {
    return <Loader label="Загружаем аналоги и предложения…" />
  }
  if (query.isError && !query.data) {
    return <ErrorAlert message={query.error.message} onRetry={() => query.refetch()} />
  }
  if (!query.data || isEmptyGoods(query.data) || !rows.length) {
    return (
      <EmptyState
        title="Предложений нет"
        text={`Для ${brand} / ${number} аналоги не найдены.`}
      />
    )
  }

  return (
    <FadeIn>
      <SummaryStrip rows={rows} />

      <div className="fp-offers-layout">
        <SoftCard
          className="fp-offers-main"
          p={isCompact ? 'md' : 'lg'}
          style={!isMobile && panelH ? { height: panelH, maxHeight: panelH } : undefined}
        >
          <div className="fp-offers-main__head">
            <Group justify="space-between" align="flex-start" mb="md" wrap="wrap" gap="sm">
              <div>
                <Title order={2} className="fp-section-title">
                  Аналоги и предложения
                </Title>
                <Text size="sm" c="dimmed" mt={4}>
                  <span className="fp-mono">{brand}</span>
                  {' · '}
                  <span className="fp-mono">{number}</span>
                  {' · '}
                  {filtered.length} из {rows.length}
                </Text>
              </div>
              <Group gap="sm" className="fp-offers-toolbar">
                {query.isFetching ? <FetchingBar label="Обновляем…" /> : null}
                <Button
                  variant="light"
                  color="gray"
                  leftSection={<IconArrowLeft size={16} />}
                  onClick={() => dispatch(clearBrand())}
                  fullWidth={isCompact}
                >
                  К брендам
                </Button>
              </Group>
            </Group>

            <div className="fp-filters">
              <TextInput
                placeholder={isCompact ? 'Поиск…' : 'Поиск по названию, бренду, артикулу'}
                leftSection={<IconSearch size={16} />}
                value={queryText}
                onChange={(e) => setQueryText(e.currentTarget.value)}
                className="fp-filters__search"
              />
              <SegmentedControl
                className="fp-filters__kind"
                fullWidth={isCompact}
                value={kind}
                onChange={setKind}
                data={[
                  { label: 'Все', value: 'all' },
                  { label: isCompact ? 'Ориг.' : 'Оригинал', value: 'original' },
                  { label: 'Аналоги', value: 'analogue' },
                ]}
              />
              <div className="fp-filters__meta">
                <Select
                  value={sort}
                  onChange={(v) => setSort(v || 'price-asc')}
                  data={[
                    { value: 'price-asc', label: 'Цена ↑' },
                    { value: 'price-desc', label: 'Цена ↓' },
                    { value: 'stock-desc', label: 'Остаток ↓' },
                    { value: 'name', label: 'Название' },
                  ]}
                  allowDeselect={false}
                  className="fp-filters__sort"
                />
                <Switch
                  label="В наличии"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.currentTarget.checked)}
                />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="Нет совпадений" text="Сбросьте фильтры или измените запрос." />
          ) : isMobile ? (
            <div className="fp-offer-cards">
              {filtered.map((row) => (
                <article key={row.id} className="fp-offer-card">
                  <div className="fp-offer-card__top">
                    <Text size="sm" fw={700} lh={1.35} className="fp-offer-card__name">
                      {row.name}
                    </Text>
                    <Badge
                      size="xs"
                      variant="light"
                      color={row.kind === 'analogue' ? 'coral' : 'brand'}
                      radius="xl"
                    >
                      {row.kind === 'analogue' ? 'аналог' : 'оригинал'}
                    </Badge>
                  </div>
                  <Text size="xs" c="dimmed" mt={4}>
                    {row.brand}
                    {' · '}
                    <span className="fp-mono">{row.number}</span>
                  </Text>
                  <div className="fp-offer-card__metrics">
                    <div>
                      <Text size="xs" c="dimmed">
                        Цена
                      </Text>
                      <Text size="sm" fw={800} c="brand.6">
                        {formatPrice(row.price)}
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed">
                        Остаток
                      </Text>
                      <Text size="sm" fw={800} c={row.stock > 0 ? 'teal.7' : 'dimmed'}>
                        {row.stock}
                      </Text>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="fp-vtable">
              <div className="fp-vtable__head" role="row">
                <span>Название / производитель</span>
                <span>Артикул</span>
                <span className="is-right">Цена</span>
                <span className="is-right">Остаток</span>
              </div>

              <div ref={parentRef} className="fp-vtable__body">
                <div
                  className="fp-vtable__spacer"
                  style={{ height: virtualizer.getTotalSize() }}
                >
                  {virtualizer.getVirtualItems().map((item) => {
                    const row = filtered[item.index]
                    return (
                      <div
                        key={row.id}
                        className="fp-vtable__row"
                        role="row"
                        style={{
                          height: item.size,
                          transform: `translateY(${item.start}px)`,
                        }}
                      >
                        <div className="fp-vtable__cell">
                          <Text size="sm" fw={600} lh={1.3} lineClamp={1}>
                            {row.name}
                          </Text>
                          <Group gap={6} mt={2}>
                            <Text size="xs" c="dimmed">
                              {row.brand}
                            </Text>
                            <Badge
                              size="xs"
                              variant="light"
                              color={row.kind === 'analogue' ? 'coral' : 'brand'}
                              radius="xl"
                            >
                              {row.kind === 'analogue' ? 'аналог' : 'оригинал'}
                            </Badge>
                          </Group>
                        </div>
                        <div className="fp-vtable__cell">
                          <Text size="sm" className="fp-mono">
                            {row.number}
                          </Text>
                        </div>
                        <div className="fp-vtable__cell is-right">
                          <Text size="sm" fw={700} c="brand.6">
                            {formatPrice(row.price)}
                          </Text>
                        </div>
                        <div className="fp-vtable__cell is-right">
                          <Text size="sm" fw={700} c={row.stock > 0 ? 'teal.7' : 'dimmed'}>
                            {row.stock}
                          </Text>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </SoftCard>

        <div ref={analyticsRef} className="fp-analytics-wrap">
          <OffersAnalytics rows={rows} />
        </div>
      </div>
    </FadeIn>
  )
}
