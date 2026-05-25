import { useState } from 'react'
import {
  getFlagImageUrl,
  makeFlagFromCurrency,
} from '../utils/makeFlagFromCurrency'

type CurrencyFlagProps = {
  code: string
  size?: number
  className?: string
}

export function CurrencyFlag({ code, size = 28, className = '' }: CurrencyFlagProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = getFlagImageUrl(code)
  const emoji = makeFlagFromCurrency(code)
  const classes = ['currency-flag', className].filter(Boolean).join(' ')

  if (!imageUrl || imageFailed) {
    return (
      <span
        className={`${classes} currency-flag--emoji`}
        aria-hidden="true"
        style={{ fontSize: `${size * 0.85}px`, lineHeight: 1 }}
      >
        {emoji || code.slice(0, 2)}
      </span>
    )
  }

  return (
    <img
      src={imageUrl}
      alt=""
      width={size}
      height={Math.round(size * 0.67)}
      className={classes}
      loading="lazy"
      decoding="async"
      onError={() => setImageFailed(true)}
    />
  )
}
