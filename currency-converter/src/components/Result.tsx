type ResultProps = {
  amount: number
  from: string
  to: string
  total: number
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value)

export function Result({ amount, from, to, total }: ResultProps) {
  return (
    <p className="result" aria-live="polite">
      {formatNumber(amount)} {from} = {formatNumber(total)} {to}
    </p>
  )
}
