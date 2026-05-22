import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { CurrencyInfo } from '../api/fetchCurrencies'
import { makeFlagFromCurrency } from '../utils/makeFlagFromCurrency'

type CurrencySelectProps = {
  id: string
  label: string
  value: string
  disabledCodes: string[]
  currencies: CurrencyInfo[]
  disabled?: boolean
  onChange: (code: string) => void
}

export function formatOptionLabel(code: string): string {
  const flag = makeFlagFromCurrency(code)
  return flag ? `${flag} ${code}` : code
}

function matchesQuery(currency: CurrencyInfo, query: string): boolean {
  const normalized = query.trim().toUpperCase()
  if (!normalized) {
    return true
  }
  return (
    currency.code.includes(normalized) ||
    currency.name.toUpperCase().includes(normalized)
  )
}

export function CurrencySelect({
  id,
  label,
  value,
  disabledCodes,
  currencies,
  disabled = false,
  onChange,
}: CurrencySelectProps) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(0)

  const selected = currencies.find((currency) => currency.code === value)

  const filtered = useMemo(
    () => currencies.filter((currency) => matchesQuery(currency, query)),
    [currencies, query],
  )

  const selectableFiltered = filtered.filter(
    (currency) => !disabledCodes.includes(currency.code),
  )

  useEffect(() => {
    if (!open) {
      setQuery('')
      setHighlightIndex(0)
    }
  }, [open, value])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const commitSelection = (code: string) => {
    onChange(code)
    setOpen(false)
    setQuery('')
  }

  const handleSelect = (code: string) => {
    if (disabledCodes.includes(code)) {
      return
    }
    commitSelection(code)
  }

  const handleInputChange = (nextQuery: string) => {
    setQuery(nextQuery.toUpperCase())
    setOpen(true)
    setHighlightIndex(0)

    const exact = currencies.find(
      (currency) =>
        currency.code === nextQuery.toUpperCase() &&
        !disabledCodes.includes(currency.code),
    )
    if (exact) {
      onChange(exact.code)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setHighlightIndex((index) =>
        Math.min(index + 1, Math.max(selectableFiltered.length - 1, 0)),
      )
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setHighlightIndex((index) => Math.max(index - 1, 0))
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const choice = selectableFiltered[highlightIndex]
      if (choice) {
        commitSelection(choice.code)
      }
      return
    }

    if (event.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  const displayValue = open
    ? query
    : selected
      ? formatOptionLabel(selected.code)
      : value

  const inputDisabled = disabled || currencies.length === 0

  return (
    <div className="field field--compact currency-combobox" ref={rootRef}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
        disabled={inputDisabled}
        placeholder={inputDisabled ? 'Loading...' : 'Type code (e.g. USD)'}
        value={displayValue}
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={() => {
          setOpen(true)
          setQuery('')
        }}
        onKeyDown={handleKeyDown}
      />
      {open && filtered.length > 0 && (
        <ul id={listboxId} className="currency-combobox__list" role="listbox">
          {filtered.map((currency) => {
            const isDisabled = disabledCodes.includes(currency.code)
            const isHighlighted =
              selectableFiltered[highlightIndex]?.code === currency.code

            return (
              <li
                key={currency.code}
                role="option"
                aria-label={`${currency.code} ${currency.name}`}
                aria-selected={currency.code === value}
                aria-disabled={isDisabled}
                className={[
                  'currency-combobox__option',
                  isHighlighted ? 'currency-combobox__option--active' : '',
                  isDisabled ? 'currency-combobox__option--disabled' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(currency.code)}
                onMouseEnter={() => {
                  const selectableIndex = selectableFiltered.findIndex(
                    (item) => item.code === currency.code,
                  )
                  if (selectableIndex >= 0) {
                    setHighlightIndex(selectableIndex)
                  }
                }}
              >
                <span className="currency-combobox__code">
                  {formatOptionLabel(currency.code)}
                </span>
                <span className="currency-combobox__name">{currency.name}</span>
              </li>
            )
          })}
        </ul>
      )}
      {open && filtered.length === 0 && (
        <p className="currency-combobox__empty">No matching currencies</p>
      )}
    </div>
  )
}
