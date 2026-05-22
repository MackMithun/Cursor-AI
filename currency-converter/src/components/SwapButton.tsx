type SwapButtonProps = {
  onClick: () => void
}

export function SwapButton({ onClick }: SwapButtonProps) {
  return (
    <button
      type="button"
      className="swap-button"
      onClick={onClick}
      aria-label="Swap currencies"
    >
      ↔
    </button>
  )
}
