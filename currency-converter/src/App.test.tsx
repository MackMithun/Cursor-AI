import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const currencies = {
  USD: 'United States Dollar',
  EUR: 'Euro',
}

function parseLatestUrl(url: string) {
  const params = new URL(url, 'http://localhost').searchParams
  return {
    amount: Number(params.get('amount') ?? 1),
    from: params.get('from') ?? 'USD',
    to: params.get('to') ?? 'EUR',
  }
}

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  function mockFetch() {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo) => {
        const url = String(input)
        if (url.includes('/currencies')) {
          return Promise.resolve({
            ok: true,
            json: async () => currencies,
          })
        }

        if (url.includes('/latest')) {
          const { amount, to } = parseLatestUrl(url)
          return Promise.resolve({
            ok: true,
            json: async () => ({
              amount,
              base: parseLatestUrl(url).from,
              date: '2026-05-21',
              rates: { [to]: amount * 0.92 },
            }),
          })
        }

        return Promise.reject(new Error('Unexpected URL'))
      }),
    )
  }

  it('auto-converts when amount is entered', async () => {
    mockFetch()
    const user = userEvent.setup()

    render(<App />)

    await waitFor(() => {
      expect(screen.getByLabelText('From')).toBeEnabled()
    })

    await user.clear(screen.getByLabelText('Enter Amount'))
    await user.type(screen.getByLabelText('Enter Amount'), '100')

    await waitFor(
      () => {
        expect(screen.getByText('100 USD = 92 EUR')).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it('auto-updates result when amount changes', async () => {
    mockFetch()
    const user = userEvent.setup()

    render(<App />)

    await waitFor(() => expect(screen.getByLabelText('From')).toBeEnabled())

    const amountInput = screen.getByLabelText('Enter Amount')
    await user.clear(amountInput)
    await user.type(amountInput, '100')

    await waitFor(() => {
      expect(screen.getByText('100 USD = 92 EUR')).toBeInTheDocument()
    })

    await user.clear(amountInput)
    await user.type(amountInput, '200')

    await waitFor(() => {
      expect(screen.getByText('200 USD = 184 EUR')).toBeInTheDocument()
    })
  })

  it('auto-converts after swapping currencies', async () => {
    mockFetch()
    const user = userEvent.setup()

    render(<App />)

    await waitFor(() => expect(screen.getByLabelText('From')).toBeEnabled())

    await waitFor(() => {
      expect(screen.getByText(/1 USD = /)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Swap currencies' }))

    expect((screen.getByLabelText('From') as HTMLInputElement).value).toContain('EUR')
    expect((screen.getByLabelText('To') as HTMLInputElement).value).toContain('USD')

    await waitFor(
      () => {
        expect(screen.getByText(/1 EUR = .* USD/)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })
})
