import { Alert, Button, Group } from '@mantine/core'
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react'
import SoftCard from './SoftCard'
import FadeIn from './FadeIn'

export default function ErrorAlert({ message, onRetry }) {
  if (!message) return null

  return (
    <FadeIn>
      <SoftCard p="md">
        <Alert
          variant="light"
          color="red"
          radius="lg"
          title="Не удалось выполнить запрос"
          icon={<IconAlertCircle size={18} />}
        >
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
            <span>{message}</span>
            {onRetry ? (
              <Button
                size="xs"
                variant="light"
                color="gray"
                leftSection={<IconRefresh size={14} />}
                onClick={onRetry}
              >
                Повторить
              </Button>
            ) : null}
          </Group>
        </Alert>
      </SoftCard>
    </FadeIn>
  )
}
