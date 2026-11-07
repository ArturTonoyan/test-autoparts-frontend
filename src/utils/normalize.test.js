import { describe, expect, it } from 'vitest'
import {
  extractBrands,
  flattenOffers,
  formatPrice,
  isEmptyGoods,
  summarizeWarehouses,
} from './normalize'

describe('summarizeWarehouses', () => {
  it('берёт минимальную цену и суммирует остаток', () => {
    expect(
      summarizeWarehouses([
        { price: 100, stock: 2 },
        { price: 80, stock: 5 },
        { price: 90, stock: 1 },
      ]),
    ).toEqual({ price: 80, stock: 8 })
  })

  it('возвращает пустой итог без складов', () => {
    expect(summarizeWarehouses([])).toEqual({ price: null, stock: 0 })
  })
})

describe('extractBrands', () => {
  it('собирает уникальные бренды и игнорирует пустые записи', () => {
    const goods = [
      { brand: 'MEYLE', number: '1', name: 'A', goodsID: '1' },
      { brand: 'MEYLE', number: '2', name: 'B', goodsID: '2' },
      { brand: 'ZEN', number: '3', name: 'C', goodsID: '3' },
      {},
    ]
    expect(extractBrands(goods)).toEqual(['MEYLE', 'ZEN'])
  })
})

describe('flattenOffers', () => {
  it('включает оригинал и аналоги', () => {
    const rows = flattenOffers([
      {
        goodsID: 'g1',
        brand: 'MEYLE',
        number: '716',
        name: 'Рычаг',
        warehouses: [{ price: 1000, stock: 3 }],
        analogues: [
          {
            goodsID: 'g2',
            brand: 'FEBI',
            number: '123',
            name: 'Аналог',
            warehouses: [{ price: 900, stock: 1 }],
          },
        ],
      },
    ])

    expect(rows).toHaveLength(2)
    expect(rows[0]).toMatchObject({ brand: 'MEYLE', price: 1000, stock: 3, kind: 'original' })
    expect(rows[1]).toMatchObject({ brand: 'FEBI', price: 900, stock: 1, kind: 'analogue' })
  })
})

describe('isEmptyGoods', () => {
  it('считает пустым массив и пустые структуры', () => {
    expect(isEmptyGoods([])).toBe(true)
    expect(isEmptyGoods([{}])).toBe(true)
    expect(isEmptyGoods([{ brand: 'A', number: '1', goodsID: 'x' }])).toBe(false)
  })
})

describe('formatPrice', () => {
  it('форматирует рубли', () => {
    expect(formatPrice(null)).toBe('—')
    expect(formatPrice(1234.5)).toMatch(/1[\s\u00a0]?234/)
  })
})
