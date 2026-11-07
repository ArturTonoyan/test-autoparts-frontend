import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Group, TextInput } from '@mantine/core'
import { IconSearch, IconX } from '@tabler/icons-react'
import { setNumber, resetSearch } from '../store/searchSlice'

const schema = z.object({
  number: z
    .string()
    .trim()
    .min(2, 'Введите артикул (минимум 2 символа)')
    .max(64, 'Слишком длинный артикул'),
})

export default function SearchForm() {
  const dispatch = useDispatch()
  const current = useSelector((s) => s.search.number)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { number: current },
  })

  useEffect(() => {
    reset({ number: current })
  }, [current, reset])

  return (
    <form
      onSubmit={handleSubmit(({ number }) => dispatch(setNumber(number.trim())))}
      noValidate
    >
      <Group align="flex-end" gap="sm" wrap="wrap">
        <Controller
          name="number"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Артикул детали"
              placeholder="Например, 7160500039S"
              autoComplete="off"
              spellCheck={false}
              error={errors.number?.message}
              className="fp-search-input"
              styles={{
                input: { fontFamily: 'var(--mantine-font-family-monospace)' },
              }}
            />
          )}
        />
        <Button type="submit" leftSection={<IconSearch size={16} />}>
          Найти
        </Button>
        {current ? (
          <Button
            type="button"
            variant="light"
            color="gray"
            leftSection={<IconX size={16} />}
            onClick={() => {
              reset({ number: '' })
              dispatch(resetSearch())
            }}
          >
            Сброс
          </Button>
        ) : null}
      </Group>
    </form>
  )
}
