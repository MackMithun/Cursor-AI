/** Currencies whose first two letters are not a valid ISO country code. */
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  EUR: 'EU',
  GBP: 'GB',
  CHF: 'CH',
  XCD: 'AG',
  XPF: 'PF',
  XAF: 'CM',
  XOF: 'SN',
}

export function countryCodeToFlag(countryCode: string): string {
  if (!/^[A-Z]{2}$/i.test(countryCode)) {
    return ''
  }

  const code = countryCode.toUpperCase()
  try {
    return String.fromCodePoint(
      ...[...code].map((char) => 0x1f1e6 - 65 + char.charCodeAt(0)),
    )
  } catch {
    return ''
  }
}

export function currencyCodeToCountryCode(currencyCode: string): string {
  const code = currencyCode.toUpperCase()
  return CURRENCY_TO_COUNTRY[code] ?? code.slice(0, 2)
}

export function makeFlagFromCurrency(currencyCode: string): string {
  const countryCode = currencyCodeToCountryCode(currencyCode)
  return countryCodeToFlag(countryCode)
}

/** Flag image URL from flagcdn.com (ISO 3166-1 alpha-2 country code). */
export function getFlagImageUrl(currencyCode: string): string | null {
  const countryCode = currencyCodeToCountryCode(currencyCode)
  if (!/^[A-Z]{2}$/i.test(countryCode)) {
    return null
  }
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
}
