import { describe, expect, it } from 'vitest'
import { convertAmount, getRateFromResponse } from './convertAmount'

describe('convertAmount', () => {
  it('converts using cross rates', () => {
    const result = convertAmount(100, 1, 0.92)
    expect(result.rate).toBeCloseTo(0.92)
    expect(result.total).toBeCloseTo(92)
  })

  it('derives rate from API response values', () => {
    expect(getRateFromResponse(100, 92)).toBeCloseTo(0.92)
  })
})
