import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AmountInput } from './AmountInput'

describe('AmountInput', () => {
  it('renders label, value, and limit hint', () => {
    render(
      <AmountInput id="amount" label="Enter Amount" value="10" onChange={vi.fn()} />,
    )

    expect(screen.getByLabelText('Enter Amount')).toHaveValue('10')
    expect(screen.getByText(/12 digits/i)).toBeInTheDocument()
  })

  it('calls onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <AmountInput id="amount" label="Enter Amount" value="" onChange={onChange} />,
    )

    await user.type(screen.getByLabelText('Enter Amount'), '5')
    expect(onChange).toHaveBeenCalled()
  })
})
