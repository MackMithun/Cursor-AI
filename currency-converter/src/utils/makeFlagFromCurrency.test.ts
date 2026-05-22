import { describe, expect, it } from 'vitest'
import {
  countryCodeToFlag,
  currencyCodeToCountryCode,
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
})
