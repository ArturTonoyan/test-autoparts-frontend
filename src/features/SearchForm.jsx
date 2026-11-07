import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { Button, TextInput } from '@mantine/core'
import { IconSearch, IconX } from '@tabler/icons-react'
import { setNumber, resetSearch } from '../store/searchSlice'

const schema = z.object({
  number: z
    .string()
    .trim()
    .min(2, 'Введите артикул (минимум 2 символа)')
    .max(64, 'Слишком длинный артикул'),
})

export default function SearchForm({ compact = false }) {
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
      className="fp-search-form"
      onSubmit={handleSubmit(({ number }) => dispatch(setNumber(number.trim())))}
      noValidate
    >
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
            size={compact ? 'md' : 'sm'}
            styles={{
              input: { fontFamily: 'var(--mantine-font-family-monospace)' },
            }}
          />
        )}
      />
      <div className="fp-search-actions">
        <Button type="submit" leftSection={<IconSearch size={16} />} fullWidth={compact}>
          Найти
        </Button>
        {current ? (
          <Button
            type="button"
            variant="light"
            color="gray"
            leftSection={<IconX size={16} />}
            fullWidth={compact}
            onClick={() => {
              reset({ number: '' })
              dispatch(resetSearch())
            }}
          >
            Сброс
          </Button>
        ) : null}
      </div>
    </form>
  )
}
