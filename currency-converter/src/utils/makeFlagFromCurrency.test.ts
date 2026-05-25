import { describe, expect, it } from 'vitest'
import {
  countryCodeToFlag,
  currencyCodeToCountryCode,
  getFlagImageUrl,
  makeFlagFromCurrency,
} from './makeFlagFromCurrency'

describe('makeFlagFromCurrency', () => {
  it('builds a flag for USD via US country code', () => {
    expect(makeFlagFromCurrency('USD')).toBe('🇺🇸')
  })

  it('uses exception mapping for EUR', () => {
    expect(currencyCodeToCountryCode('EUR')).toBe('EU')
    expect(makeFlagFromCurrency('EUR')).toBe('🇪🇺')
  })

  it('returns empty flag when country code is invalid', () => {
    expect(countryCodeToFlag('U')).toBe('')
  })

  it('builds flag image URL from currency code', () => {
    expect(getFlagImageUrl('USD')).toBe('https://flagcdn.com/w40/us.png')
    expect(getFlagImageUrl('EUR')).toBe('https://flagcdn.com/w40/eu.png')
  })
})
