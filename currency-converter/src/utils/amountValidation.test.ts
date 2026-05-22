import { describe, expect, it } from 'vitest'
import {
  exceedsMaxIntegerDigits,
  isValidAmountInput,
  sanitizeAmountInput,
} from './amountValidation'

describe('amountValidation', () => {
  it('validates positive numeric amounts', () => {
    expect(isValidAmountInput('100')).toBe(true)
    expect(isValidAmountInput('0')).toBe(false)
    expect(isValidAmountInput('')).toBe(false)
  })

  it('detects integer digit overflow', () => {
    expect(exceedsMaxIntegerDigits('1234567890123')).toBe(true)
    expect(exceedsMaxIntegerDigits('100')).toBe(false)
  })

  it('sanitizes non-numeric characters and decimal length', () => {
    expect(sanitizeAmountInput('12a.3456')).toBe('12.34')
  })
})
