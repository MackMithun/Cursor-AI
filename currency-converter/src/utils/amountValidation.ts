export const MAX_INTEGER_DIGITS = 12

export function isValidAmountInput(value: string): boolean {
  if (value.trim() === '') {
    return false
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0
}

export function exceedsMaxIntegerDigits(value: string): boolean {
  const [integerPart] = value.split('.')
  const digits = integerPart.replace(/^0+/, '') || '0'
  return digits.length > MAX_INTEGER_DIGITS
}

export function sanitizeAmountInput(value: string): string {
  if (value === '') {
    return ''
  }

  const cleaned = value.replace(/[^\d.]/g, '')
  const [integerRaw, ...decimalParts] = cleaned.split('.')
  const integer = integerRaw.slice(0, MAX_INTEGER_DIGITS)
  const decimal = decimalParts.join('').slice(0, 2)

  if (cleaned.includes('.')) {
    return `${integer}.${decimal}`
  }

  return integer
}
