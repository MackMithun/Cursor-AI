import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SwapButton } from './SwapButton'

describe('SwapButton', () => {
  it('calls onClick when pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<SwapButton onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: 'Swap currencies' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
