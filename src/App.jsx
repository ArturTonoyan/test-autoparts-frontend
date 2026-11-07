import { useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, Group, Stepper, Text, Title, ActionIcon, Burger, Drawer } from '@mantine/core'
import { IconBell, IconMail } from '@tabler/icons-react'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import Sidebar from './layout/Sidebar'
import SoftCard from './components/SoftCard'
import FadeIn from './components/FadeIn'
import SearchForm from './features/SearchForm'
import BrandList from './features/BrandList'
import OffersTable from './features/OffersTable'
import { useScrollHeader } from './hooks/useScrollHeader'

function stepIndex(step, brand) {
  if (step === 'offers' && brand) return 2
  if (step === 'brands' || step === 'offers') return 1
  return 0
}

export default function App() {
  const { step, number, brand } = useSelector((s) => s.search)
  const active = useMemo(() => stepIndex(step, brand), [step, brand])
  const [section, setSection] = useState('search')
  const [opened, { toggle, close }] = useDisclosure(false)
  const isMobile = useMediaQuery('(max-width: 900px)')
  const contentRef = useRef(null)
  const headerHidden = useScrollHeader(contentRef)

  const onNavigate = (id) => {
    setSection(id)
    close()
    const map = {
      search: '.fp-search-card',
      brands: '.fp-brands-anchor',
      analytics: '.fp-analytics',
    }
    const el = document.querySelector(map[id])
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="fp-dash">
      {!isMobile && (
        <div className="fp-dash__sidebar">
          <Sidebar section={section} onNavigate={onNavigate} />
        </div>
      )}

      <Drawer
        opened={opened}
        onClose={close}
        padding={0}
        size={280}
        withCloseButton={false}
        classNames={{ body: 'fp-drawer-body' }}
      >
        <Sidebar section={section} onNavigate={onNavigate} />
      </Drawer>

      <div className="fp-dash__main">
        <header className={`fp-dash__header${headerHidden ? ' is-hidden' : ''}`}>
          <Group gap="sm">
            {isMobile && <Burger opened={opened} onClick={toggle} size="sm" />}
            <div>
              <Title order={1}>Подбор запчастей</Title>
              <Text c="dimmed" size="sm" mt={2}>
                Сводка по артикулу, брендам и складским предложениям
              </Text>
            </div>
          </Group>

          <Group gap="sm" className="fp-dash__actions">
            <ActionIcon variant="white" radius="xl" size={40} className="fp-icon-btn">
              <IconMail size={18} />
            </ActionIcon>
            <ActionIcon variant="white" radius="xl" size={40} className="fp-icon-btn">
              <IconBell size={18} />
            </ActionIcon>
            <Group gap={10} className="fp-user-chip">
              <Avatar radius="xl" color="brand" size={40}>
                ТА
              </Avatar>
              <div className="fp-user-chip__text">
                <Text size="sm" fw={700} lh={1.2}>
                  Тоноян А А
                </Text>
                <Text size="xs" c="dimmed">
                  Frontend
                </Text>
              </div>
            </Group>
          </Group>
        </header>

        <div className="fp-dash__content" ref={contentRef}>
          <FadeIn>
            <SoftCard className="fp-search-card">
              <Stepper
                active={active}
                size="sm"
                allowNextStepsSelect={false}
                mb="lg"
                color="brand"
                styles={{
                  separator: { marginInline: 10 },
                  stepBody: { marginTop: 4 },
                }}
              >
                <Stepper.Step label="Артикул" description={number || 'Ввод номера'} />
                <Stepper.Step label="Бренд" description={brand || 'Производитель'} />
                <Stepper.Step
                  label="Предложения"
                  description={
                    brand ? 'Аналоги, цены, остатки' : 'Таблица после выбора бренда'
                  }
                />
              </Stepper>
              <SearchForm />
            </SoftCard>
          </FadeIn>

          {step === 'idle' && (
            <FadeIn delay={0.08}>
              <SoftCard className="fp-hint-card">
                <Text size="sm" c="dimmed">
                  Попробуйте{' '}
                  <Text span fw={700} className="fp-mono" c="dark">
                    7160500039S
                  </Text>{' '}
                  или{' '}
                  <Text span fw={700} className="fp-mono" c="dark">
                    01089
                  </Text>
                  — увидите бренды, цены и аналитику по складам.
                </Text>
              </SoftCard>
            </FadeIn>
          )}

          <div className="fp-brands-anchor">
            {(step === 'brands' || step === 'offers') && !brand && <BrandList />}
          </div>

          {step === 'offers' && brand && <OffersTable />}
        </div>
      </div>
    </div>
  )
}
