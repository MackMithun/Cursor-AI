import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchCurrencies, type CurrencyInfo } from './api/fetchCurrencies'
import { getRates } from './api/getRates'
import { AmountInput } from './components/AmountInput'
import { CurrencySelect } from './components/CurrencySelect'
import { Result } from './components/Result'
import { SwapButton } from './components/SwapButton'
import {
  exceedsMaxIntegerDigits,
  isValidAmountInput,
  sanitizeAmountInput,
} from './utils/amountValidation'
import { getRateFromResponse } from './utils/convertAmount'

type ConversionState = {
  amount: number
  from: string
  to: string
  total: number
  rate: number
}

const DEFAULT_FROM = 'USD'
const DEFAULT_TO = 'EUR'
const CONVERT_DEBOUNCE_MS = 400

function App() {
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>([])
  const [amount, setAmount] = useState('1')
  const [from, setFrom] = useState(DEFAULT_FROM)
  const [to, setTo] = useState(DEFAULT_TO)
  const [result, setResult] = useState<ConversionState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingCurrencies, setLoadingCurrencies] = useState(true)
  const [converting, setConverting] = useState(false)
  const convertRequestRef = useRef(0)

  useEffect(() => {
    let cancelled = false

    fetchCurrencies()
      .then((list) => {
        if (cancelled) {
          return
        }
        setCurrencies(list)
        if (!list.some((item) => item.code === from)) {
          setFrom(list[0]?.code ?? DEFAULT_FROM)
        }
        if (!list.some((item) => item.code === to)) {
          setTo(list.find((item) => item.code === DEFAULT_TO)?.code ?? list[1]?.code ?? DEFAULT_TO)
        }
      })
      .catch((fetchError: Error) => {
        if (!cancelled) {
          setError(fetchError.message)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingCurrencies(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const amountIsValid = useMemo(
    () => isValidAmountInput(amount) && !exceedsMaxIntegerDigits(amount),
    [amount],
  )

  const canAutoConvert =
    amountIsValid &&
    from !== to &&
    currencies.length > 0 &&
    !loadingCurrencies

  const handleAmountChange = (value: string) => {
    setAmount(sanitizeAmountInput(value))
    setError(null)
  }

  const handleFromChange = (code: string) => {
    setFrom(code)
    setError(null)
  }

  const handleToChange = (code: string) => {
    setTo(code)
    setError(null)
  }

  const handleSwap = () => {
    setFrom(to)
    setTo(from)
    setError(null)
  }

  useEffect(() => {
    if (!canAutoConvert) {
      setResult(null)
      return
    }

    const timer = setTimeout(() => {
      const requestId = ++convertRequestRef.current
      const parsedAmount = Number(amount)

      setConverting(true)
      setError(null)

      getRates(parsedAmount, from, to)
        .then((response) => {
          if (requestId !== convertRequestRef.current) {
            return
          }

          const converted = response.rates[to]
          if (converted == null) {
            throw new Error('Conversion rate not available for selected currencies.')
          }

          setResult({
            amount: parsedAmount,
            from,
            to,
            total: converted,
            rate: getRateFromResponse(parsedAmount, converted),
          })
        })
        .catch((convertError) => {
          if (requestId !== convertRequestRef.current) {
            return
          }

          setResult(null)
          setError(
            convertError instanceof Error
              ? convertError.message
              : 'Conversion failed. Please try again.',
          )
        })
        .finally(() => {
          if (requestId === convertRequestRef.current) {
            setConverting(false)
          }
        })
    }, CONVERT_DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      convertRequestRef.current += 1
    }
  }, [amount, from, to, canAutoConvert])

  const resultHint = loadingCurrencies
    ? 'Loading currencies...'
    : converting
      ? 'Updating conversion...'
      : !amountIsValid
        ? 'Enter a valid amount to convert.'
        : from === to
          ? 'Choose two different currencies.'
          : null

  return (
    <main className="app">
      <section className="card" aria-labelledby="app-title">
        <h1 id="app-title">Currency Converter</h1>

        <AmountInput
          id="amount"
          label="Enter Amount"
          value={amount}
          onChange={handleAmountChange}
        />

        <div className="currency-row">
          <CurrencySelect
            id="from-currency"
            label="From"
            value={from}
            disabledCodes={[to]}
            currencies={currencies}
            disabled={loadingCurrencies}
            onChange={handleFromChange}
          />
          <SwapButton onClick={handleSwap} />
          <CurrencySelect
            id="to-currency"
            label="To"
            value={to}
            disabledCodes={[from]}
            currencies={currencies}
            disabled={loadingCurrencies}
            onChange={handleToChange}
          />
        </div>

        <div className="result-area" aria-live="polite">
          {result ? (
            <Result
              amount={result.amount}
              from={result.from}
              to={result.to}
              total={result.total}
            />
          ) : (
            resultHint && <p className="result-hint">{resultHint}</p>
          )}
        </div>

        {error && <p className="error">{error}</p>}
      </section>
    </main>
  )
}

export default App
