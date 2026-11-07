import { Loader, Text } from '@mantine/core'

/** Индикатор фонового обновления, пока на экране данные из кэша */
export default function FetchingBar({ label = 'Обновляем…' }) {
  return (
    <div className="fp-fetching" role="status" aria-live="polite">
      <Loader size="xs" color="brand" type="dots" />
      <Text size="xs" c="dimmed">
        {label}
      </Text>
    </div>
  )
}
