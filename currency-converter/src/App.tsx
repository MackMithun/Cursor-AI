import { useEffect, useMemo, useState } from 'react'
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

function App() {
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>([])
  const [amount, setAmount] = useState('1')
  const [from, setFrom] = useState(DEFAULT_FROM)
  const [to, setTo] = useState(DEFAULT_TO)
  const [result, setResult] = useState<ConversionState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingCurrencies, setLoadingCurrencies] = useState(true)
  const [converting, setConverting] = useState(false)

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

  const canConvert =
    amountIsValid &&
    from !== to &&
    currencies.length > 0 &&
    !converting &&
    !loadingCurrencies

  const clearResult = () => setResult(null)

  const handleAmountChange = (value: string) => {
    setAmount(sanitizeAmountInput(value))
    clearResult()
    setError(null)
  }

  const handleFromChange = (code: string) => {
    setFrom(code)
    clearResult()
    setError(null)
  }

  const handleToChange = (code: string) => {
    setTo(code)
    clearResult()
    setError(null)
  }

  const handleConvert = async () => {
    if (!canConvert) {
      return
    }

    const parsedAmount = Number(amount)
    setConverting(true)
    setError(null)

    try {
      const response = await getRates(parsedAmount, from, to)
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
    } catch (convertError) {
      setResult(null)
      setError(
        convertError instanceof Error
          ? convertError.message
          : 'Conversion failed. Please try again.',
      )
    } finally {
      setConverting(false)
    }
  }

  const handleSwap = () => {
    setFrom(to)
    setTo(from)
    clearResult()
    setError(null)
  }

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
            <p className="result-hint">
              {loadingCurrencies
                ? 'Loading currencies...'
                : 'Click "Get Exchange Rate" to see the conversion.'}
            </p>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        <button
          type="button"
          className="primary-button"
          onClick={handleConvert}
          disabled={!canConvert}
        >
          {converting ? 'Converting...' : 'Get Exchange Rate'}
        </button>
      </section>
    </main>
  )
}

export default App
