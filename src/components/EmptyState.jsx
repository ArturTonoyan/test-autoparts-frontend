import { Center, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconPackageOff } from '@tabler/icons-react'

export default function EmptyState({ title, text }) {
  return (
    <Center py="xl" px="md">
      <Stack align="center" gap="xs" maw={360}>
        <ThemeIcon size={44} radius="xl" variant="light" color="gray">
          <IconPackageOff size={22} />
        </ThemeIcon>
        <Text fw={700} ta="center">
          {title}
        </Text>
        {text ? (
          <Text size="sm" c="dimmed" ta="center">
            {text}
          </Text>
        ) : null}
      </Stack>
    </Center>
  )
}
