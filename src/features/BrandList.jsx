import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, Group, Text, TextInput, ThemeIcon, Title } from '@mantine/core'
import { IconChevronRight, IconSearch } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { fetchGoods } from '../api/favoritApi'
import { extractBrands, isEmptyGoods } from '../utils/normalize'
import { selectBrand } from '../store/searchSlice'
import Loader from '../components/Loader'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'
import SoftCard from '../components/SoftCard'
import FadeIn, { Stagger, StaggerItem } from '../components/FadeIn'
import FetchingBar from '../components/FetchingBar'

const PALETTE = ['brand', 'teal', 'coral', 'indigo', 'cyan', 'grape']

function brandTone(name) {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) hash = (hash + name.charCodeAt(i) * (i + 1)) % PALETTE.length
  return PALETTE[hash]
}

function brandInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function BrandList() {
  const dispatch = useDispatch()
  const number = useSelector((s) => s.search.number)
  const selected = useSelector((s) => s.search.brand)
  const [q, setQ] = useState('')

  const query = useQuery({
    queryKey: ['brands', number],
    queryFn: () => fetchGoods({ number }),
    enabled: Boolean(number),
    placeholderData: keepPreviousData,
  })

  const brands = useMemo(
    () => (query.data ? extractBrands(query.data) : []),
    [query.data],
  )

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return brands
    return brands.filter((b) => b.toLowerCase().includes(needle))
  }, [brands, q])

  if (query.isPending && !query.data) return <Loader label="Ищем производителей…" />
  if (query.isError && !query.data) {
    return <ErrorAlert message={query.error.message} onRetry={() => query.refetch()} />
  }
  if (!query.data || isEmptyGoods(query.data) || !brands.length) {
    return (
      <EmptyState
        title="Ничего не найдено"
        text={`По артикулу «${number}» производители не найдены.`}
      />
    )
  }

  return (
    <FadeIn>
      <SoftCard className="fp-brands-panel">
        <div className="fp-brands-panel__head">
          <div>
            <Group gap="sm" align="center" mb={6}>
              <Title order={2}>Производители</Title>
              <Badge variant="light" color="brand" radius="xl">
                {filtered.length}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Артикул <span className="fp-mono">{number}</span> — выберите бренд для этапа 3
            </Text>
          </div>
          <Group gap="sm">
            {query.isFetching ? <FetchingBar label="Обновляем…" /> : null}
            <Text size="xs" c="dimmed">
              из {brands.length}
            </Text>
          </Group>
        </div>

        <TextInput
          className="fp-brands-panel__search"
          placeholder="Найти бренд…"
          leftSection={<IconSearch size={16} />}
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          radius="xl"
        />

        {filtered.length === 0 ? (
          <EmptyState title="Нет брендов" text="Измените фильтр." />
        ) : (
          <Stagger className="fp-brand-grid">
            {filtered.map((brand) => {
              const active = selected === brand
              const tone = brandTone(brand)
              return (
                <StaggerItem key={brand}>
                  <motion.button
                    type="button"
                    className={`fp-brand-card${active ? ' is-active' : ''}`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => dispatch(selectBrand(brand))}
                  >
                    <ThemeIcon
                      size={40}
                      radius="md"
                      variant={active ? 'filled' : 'light'}
                      color={tone}
                      className="fp-brand-card__mark"
                    >
                      {brandInitials(brand)}
                    </ThemeIcon>
                    <span className="fp-brand-card__body">
                      <span className="fp-brand-card__name">{brand}</span>
                      <span className="fp-brand-card__hint">
                        {active ? 'Выбрано' : 'Открыть предложения'}
                      </span>
                    </span>
                    <IconChevronRight size={16} className="fp-brand-card__chevron" />
                  </motion.button>
                </StaggerItem>
              )
            })}
          </Stagger>
        )}
      </SoftCard>
    </FadeIn>
  )
}
