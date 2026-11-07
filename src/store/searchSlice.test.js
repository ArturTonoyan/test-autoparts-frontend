import { describe, expect, it } from 'vitest'
import reducer, { clearBrand, resetSearch, selectBrand, setNumber } from './searchSlice'

describe('searchSlice', () => {
  it('сохраняет артикул и сбрасывает бренд', () => {
    const state = reducer({ number: '', brand: 'X', step: 'offers' }, setNumber('01089'))
    expect(state).toEqual({ number: '01089', brand: null, step: 'brands' })
  })

  it('выбирает бренд и переходит к предложениям', () => {
    const state = reducer({ number: '01089', brand: null, step: 'brands' }, selectBrand('NGK'))
    expect(state.brand).toBe('NGK')
    expect(state.step).toBe('offers')
  })

  it('возвращает к брендам и полностью сбрасывает поиск', () => {
    const withBrand = { number: '01089', brand: 'NGK', step: 'offers' }
    expect(reducer(withBrand, clearBrand())).toEqual({
      number: '01089',
      brand: null,
      step: 'brands',
    })
    expect(reducer(withBrand, resetSearch())).toEqual({
      number: '',
      brand: null,
      step: 'idle',
    })
  })
})
