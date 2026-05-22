import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const currencies = {
  USD: 'United States Dollar',
  EUR: 'Euro',
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
          return Promise.resolve({
            ok: true,
            json: async () => ({
              amount: 100,
              base: 'USD',
              date: '2026-05-21',
              rates: { EUR: 92 },
            }),
          })
        }

        return Promise.reject(new Error('Unexpected URL'))
      }),
    )
  }

  it('loads currencies and converts on button click', async () => {
    mockFetch()
    const user = userEvent.setup()

    render(<App />)

    await waitFor(() => {
      expect(screen.getByLabelText('From')).toBeEnabled()
    })

    await user.clear(screen.getByLabelText('Enter Amount'))
    await user.type(screen.getByLabelText('Enter Amount'), '100')
    await user.click(screen.getByRole('button', { name: 'Get Exchange Rate' }))

    await waitFor(() => {
      expect(screen.getByText('100 USD = 92 EUR')).toBeInTheDocument()
    })
  })

  it('clears result when amount changes after conversion', async () => {
    mockFetch()
    const user = userEvent.setup()

    render(<App />)

    await waitFor(() => expect(screen.getByLabelText('From')).toBeEnabled())

    await user.clear(screen.getByLabelText('Enter Amount'))
    await user.type(screen.getByLabelText('Enter Amount'), '100')
    await user.click(screen.getByRole('button', { name: 'Get Exchange Rate' }))

    await waitFor(() => {
      expect(screen.getByText('100 USD = 92 EUR')).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText('Enter Amount'), '1')

    expect(screen.queryByText('100 USD = 92 EUR')).not.toBeInTheDocument()
    expect(screen.getByText(/Click "Get Exchange Rate"/)).toBeInTheDocument()
  })

  it('swaps currencies and clears the previous result', async () => {
    mockFetch()
    const user = userEvent.setup()

    render(<App />)

    await waitFor(() => expect(screen.getByLabelText('From')).toBeEnabled())

    await user.click(screen.getByRole('button', { name: 'Swap currencies' }))

    expect((screen.getByLabelText('From') as HTMLInputElement).value).toContain('EUR')
    expect((screen.getByLabelText('To') as HTMLInputElement).value).toContain('USD')
    expect(screen.getByText(/Click "Get Exchange Rate"/)).toBeInTheDocument()
  })
})
