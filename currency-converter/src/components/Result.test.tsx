import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Result } from './Result'

describe('Result', () => {
  it('formats the conversion line', () => {
    render(<Result amount={100} from="USD" to="EUR" total={92} />)
    expect(screen.getByText('100 USD = 92 EUR')).toBeInTheDocument()
  })
})
