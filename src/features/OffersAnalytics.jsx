import { Group, Progress, RingProgress, Text, ThemeIcon } from '@mantine/core'
import {
  IconCoin,
  IconPackage,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react'
import SoftCard from '../components/SoftCard'
import FadeIn, { Stagger, StaggerItem } from '../components/FadeIn'
import { buildOfferStats } from '../utils/analytics'

const brandColors = ['coral', 'teal', 'brand', 'violet']

export default function OffersAnalytics({ rows }) {
  const stats = buildOfferStats(rows)

  return (
    <Stagger className="fp-analytics">
      <StaggerItem>
        <SoftCard className="fp-analytics__hero">
          <Group justify="space-between" align="flex-start" mb="md">
            <div>
              <Text size="sm" c="dimmed" fw={500}>
                Средняя цена
              </Text>
              <Text className="fp-stat-value" mt={4}>
                {stats.labels.avgPrice}
              </Text>
            </div>
            <ThemeIcon size={42} radius="xl" color="brand" variant="light">
              <IconCoin size={22} />
            </ThemeIcon>
          </Group>

          <Group grow gap="sm">
            <div className="fp-mini-stat">
              <Group gap={6} mb={4}>
                <IconTrendingDown size={14} color="var(--mantine-color-teal-6)" />
                <Text size="xs" c="dimmed">
                  Мин.
                </Text>
              </Group>
              <Text fw={700} size="sm">
                {stats.labels.minPrice}
              </Text>
            </div>
            <div className="fp-mini-stat">
              <Group gap={6} mb={4}>
                <IconTrendingUp size={14} color="var(--mantine-color-coral-6)" />
                <Text size="xs" c="dimmed">
                  Макс.
                </Text>
              </Group>
              <Text fw={700} size="sm">
                {stats.labels.maxPrice}
              </Text>
            </div>
          </Group>
        </SoftCard>
      </StaggerItem>

      <StaggerItem>
        <SoftCard>
          <Group justify="space-between" mb="md">
            <div>
              <Text fw={700}>Наличие</Text>
              <Text size="xs" c="dimmed" mt={2}>
                {stats.inStock} из {stats.total} позиций · склад {stats.totalStock}
              </Text>
            </div>
            <RingProgress
              size={72}
              thickness={8}
              roundCaps
              sections={[{ value: stats.stockShare, color: 'teal' }]}
              label={
                <Text ta="center" size="xs" fw={700}>
                  {stats.stockShare}%
                </Text>
              }
            />
          </Group>
          <Progress value={stats.stockShare} color="teal" radius="xl" size="sm" />
        </SoftCard>
      </StaggerItem>

      <StaggerItem>
        <SoftCard>
          <Group justify="space-between" mb="sm">
            <Text fw={700}>Структура</Text>
            <ThemeIcon size={34} radius="xl" variant="light" color="gray">
              <IconPackage size={18} />
            </ThemeIcon>
          </Group>
          <div className="fp-structure">
            <div>
              <Text size="xs" c="dimmed">
                Оригинал
              </Text>
              <Text fw={700}>{stats.originals}</Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Аналоги
              </Text>
              <Text fw={700}>{stats.analogues}</Text>
            </div>
          </div>
          <Progress.Root size={10} radius="xl" mt="md">
            <Progress.Section
              value={stats.total ? (stats.originals / stats.total) * 100 : 0}
              color="brand"
            />
            <Progress.Section
              value={stats.total ? (stats.analogues / stats.total) * 100 : 0}
              color="coral"
            />
          </Progress.Root>
        </SoftCard>
      </StaggerItem>

      <StaggerItem className="fp-analytics__brands">
        <SoftCard className="fp-analytics__brands-card">
          <Text fw={700} mb="md">
            Топ брендов
          </Text>
          <div className="fp-brand-bars">
            {stats.topBrands.map((item, i) => (
              <div key={item.name} className="fp-brand-bar">
                <Group justify="space-between" mb={6}>
                  <Text size="sm" fw={600} lineClamp={1}>
                    {item.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {item.pct}%
                  </Text>
                </Group>
                <Progress
                  value={item.pct}
                  color={brandColors[i % brandColors.length]}
                  radius="xl"
                  size="sm"
                />
              </div>
            ))}
          </div>
        </SoftCard>
      </StaggerItem>
    </Stagger>
  )
}

export function SummaryStrip({ rows }) {
  const stats = buildOfferStats(rows)
  return (
    <FadeIn>
      <div className="fp-summary-strip">
        <SoftCard p="md" className="fp-summary-item">
          <Text size="xs" c="dimmed" fw={500}>
            Всего
          </Text>
          <Text className="fp-stat-value fp-stat-value--sm">{stats.total}</Text>
        </SoftCard>
        <SoftCard p="md" className="fp-summary-item">
          <Text size="xs" c="dimmed" fw={500}>
            В наличии
          </Text>
          <Text className="fp-stat-value fp-stat-value--sm" c="teal.7">
            {stats.inStock}
          </Text>
        </SoftCard>
        <SoftCard p="md" className="fp-summary-item">
          <Text size="xs" c="dimmed" fw={500}>
            От
          </Text>
          <Text className="fp-stat-value fp-stat-value--sm">{stats.labels.minPrice}</Text>
        </SoftCard>
        <SoftCard p="md" className="fp-summary-item">
          <Text size="xs" c="dimmed" fw={500}>
            Средняя
          </Text>
          <Text className="fp-stat-value fp-stat-value--sm">{stats.labels.avgPrice}</Text>
        </SoftCard>
      </div>
    </FadeIn>
  )
}
