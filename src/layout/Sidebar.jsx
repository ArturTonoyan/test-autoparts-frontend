import { useSelector } from 'react-redux'
import { Stack, Text, ThemeIcon } from '@mantine/core'
import {
  IconSearch,
  IconChartBar,
  IconBuildingFactory2,
  IconBook2,
  IconSparkles,
} from '@tabler/icons-react'

const links = [
  { id: 'search', label: 'Поиск', icon: IconSearch },
  { id: 'brands', label: 'Бренды', icon: IconBuildingFactory2 },
  { id: 'analytics', label: 'Аналитика', icon: IconChartBar },
  { id: 'docs', label: 'API docs', icon: IconBook2, href: 'https://lk.favorit-parts.ru/static/wsprice.pdf' },
]

export default function Sidebar({ section, onNavigate }) {
  const { step, brand } = useSelector((s) => s.search)

  return (
    <aside className="fp-sidebar">
      <div className="fp-sidebar__brand">
        <div className="fp-sidebar__logo" aria-hidden>
          <IconSparkles size={18} />
        </div>
        <div>
          <div className="fp-sidebar__name">Favorit Parts</div>
          <Text size="xs" c="dimmed">
            Parts finder
          </Text>
        </div>
      </div>

      <nav className="fp-sidebar__nav" aria-label="Разделы">
        {links.map((link) => {
          const Icon = link.icon
          const active = section === link.id
          const disabled =
            (link.id === 'brands' && step === 'idle') ||
            (link.id === 'analytics' && !(step === 'offers' && brand))

          if (link.href) {
            return (
              <a
                key={link.id}
                className="fp-nav-link"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                <ThemeIcon variant="light" color="gray" radius="md" size={32}>
                  <Icon size={16} />
                </ThemeIcon>
                <span>{link.label}</span>
              </a>
            )
          }

          return (
            <button
              key={link.id}
              type="button"
              className={`fp-nav-link${active ? ' is-active' : ''}`}
              disabled={disabled}
              onClick={() => onNavigate(link.id)}
            >
              <ThemeIcon
                variant={active ? 'filled' : 'light'}
                color={active ? 'brand' : 'gray'}
                radius="md"
                size={32}
              >
                <Icon size={16} />
              </ThemeIcon>
              <span>{link.label}</span>
            </button>
          )
        })}
      </nav>

      <Stack gap={4} mt="auto" className="fp-sidebar__foot">
        <Text size="xs" c="dimmed">
          Тестовое задание
        </Text>
        <Text size="xs" fw={600} className="fp-mono">
          Фаворит
        </Text>
      </Stack>
    </aside>
  )
}
