export type ConversionResponse = {
  amount: number
  base: string
  date: string
  rates: Record<string, number>
}

import { frankfurterFetch } from './config'

export async function getRates(
  amount: number,
  from: string,
  to: string,
): Promise<ConversionResponse> {
  const params = new URLSearchParams({
    amount: String(amount),
    from,
    to,
  })

  const response = await frankfurterFetch(`/latest?${params}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rate (${response.status})`)
  }

  return response.json() as Promise<ConversionResponse>
}
