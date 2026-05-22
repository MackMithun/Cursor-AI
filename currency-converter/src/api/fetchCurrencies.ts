export type CurrencyInfo = {
  code: string
  name: string
}

import { frankfurterFetch } from './config'

export async function fetchCurrencies(): Promise<CurrencyInfo[]> {
  const response = await frankfurterFetch('/currencies')
  if (!response.ok) {
    throw new Error(`Failed to load currencies (${response.status})`)
  }

  const data = (await response.json()) as Record<string, string>
  return Object.entries(data)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.code.localeCompare(b.code))
}
