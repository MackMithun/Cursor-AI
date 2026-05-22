import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchCurrencies } from './fetchCurrencies'

describe('fetchCurrencies', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads and sorts currencies from Frankfurter', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          EUR: 'Euro',
          USD: 'United States Dollar',
        }),
      }),
    )

    const currencies = await fetchCurrencies()
    expect(currencies).toEqual([
      { code: 'EUR', name: 'Euro' },
      { code: 'USD', name: 'United States Dollar' },
    ])
  })

  it('throws when the API fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    )

    await expect(fetchCurrencies()).rejects.toThrow('Failed to load currencies')
  })
})
