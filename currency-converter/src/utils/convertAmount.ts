export type ConversionResult = {
  rate: number
  total: number
}

export function convertAmount(
  amount: number,
  fromRate: number,
  toRate: number,
): ConversionResult {
  const rate = toRate / fromRate
  return {
    rate,
    total: amount * rate,
  }
}

export function getRateFromResponse(amount: number, responseAmount: number): number {
  if (amount === 0) {
    return 0
  }
  return responseAmount / amount
}
