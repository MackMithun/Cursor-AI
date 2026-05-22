import { afterEach, describe, expect, it, vi } from 'vitest'
import { getRates } from './getRates'

describe('getRates', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requests conversion with amount, from, and to', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        amount: 100,
        base: 'USD',
        date: '2026-05-21',
        rates: { EUR: 86.21 },
      }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const response = await getRates(100, 'USD', 'EUR')
    expect(response.rates.EUR).toBe(86.21)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.frankfurter.app/latest?amount=100&from=USD&to=EUR',
      undefined,
    )
  })

  it('throws when the API fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    )

    await expect(getRates(1, 'USD', 'EUR')).rejects.toThrow('Failed to fetch exchange rate')
  })
})
