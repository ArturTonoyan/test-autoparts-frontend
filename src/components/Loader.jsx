import { Center, Loader as MantineLoader, Stack, Text } from '@mantine/core'
import SoftCard from './SoftCard'
import FadeIn from './FadeIn'

export default function Loader({ label = 'Загрузка…' }) {
  return (
    <FadeIn>
      <SoftCard>
        <Center py="xl" role="status" aria-live="polite">
          <Stack align="center" gap="sm">
            <MantineLoader color="brand" type="dots" />
            <Text size="sm" c="dimmed">
              {label}
            </Text>
          </Stack>
        </Center>
      </SoftCard>
    </FadeIn>
  )
}
