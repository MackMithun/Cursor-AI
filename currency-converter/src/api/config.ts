/** Frankfurter API base URL (proxied in dev to avoid browser CORS/network blocks). */
export function getFrankfurterBaseUrl(): string {
  if (import.meta.env.VITEST) {
    return 'https://api.frankfurter.app'
  }

  if (import.meta.env.DEV) {
    return '/api/frankfurter'
  }

  return import.meta.env.VITE_FRANKFURTER_API ?? 'https://api.frankfurter.app'
}

export async function frankfurterFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = `${getFrankfurterBaseUrl()}${path}`

  try {
    return await fetch(url, init)
  } catch {
    throw new Error(
      'Cannot reach the exchange rate service. Check your internet connection, disable ad blockers for this site, or try again later.',
    )
  }
}
