import { MAX_INTEGER_DIGITS } from '../utils/amountValidation'

type AmountInputProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export function AmountInput({ id, label, value, onChange }: AmountInputProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        min="0"
        step="0.01"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="0"
      />
      <p className="field-hint">
        Up to {MAX_INTEGER_DIGITS} digits before the decimal point.
      </p>
    </div>
  )
}
