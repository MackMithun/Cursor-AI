import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CurrencySelect } from './CurrencySelect'

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
]

describe('CurrencySelect', () => {
  it('filters options when typing a currency code', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <CurrencySelect
        id="to"
        label="To"
        value="USD"
        disabledCodes={[]}
        currencies={currencies}
        onChange={onChange}
      />,
    )

    const input = screen.getByLabelText('To')
    await user.clear(input)
    await user.type(input, 'EUR')

    expect(screen.getByRole('option', { name: /EUR/i })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /GBP/i })).not.toBeInTheDocument()
  })

  it('selects a currency from the list on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <CurrencySelect
        id="to"
        label="To"
        value="USD"
        disabledCodes={[]}
        currencies={currencies}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByLabelText('To'))
    await user.click(screen.getByRole('option', { name: /EUR/i }))

    expect(onChange).toHaveBeenCalledWith('EUR')
  })

  it('does not select disabled currency codes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <CurrencySelect
        id="from"
        label="From"
        value="USD"
        disabledCodes={['EUR']}
        currencies={currencies}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByLabelText('From'))
    await user.click(screen.getByRole('option', { name: /EUR/i }))

    expect(onChange).not.toHaveBeenCalledWith('EUR')
  })

  it('selects highlighted option on Enter', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <CurrencySelect
        id="to"
        label="To"
        value="USD"
        disabledCodes={[]}
        currencies={currencies}
        onChange={onChange}
      />,
    )

    const input = screen.getByLabelText('To')
    await user.click(input)
    await user.type(input, 'GB')
    await user.keyboard('{Enter}')

    expect(onChange).toHaveBeenCalledWith('GBP')
  })
})
