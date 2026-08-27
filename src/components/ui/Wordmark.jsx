/** STRYVE wordmark: pulse-signal mark + geometric type. */
export function Wordmark({ className = '', withMark = true }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {withMark && (
        <svg viewBox="0 0 40 24" className="h-[0.95em] w-auto" aria-hidden>
          <path
            d="M2 12 H10 L14 12 L18 3 L24 21 L28 12 H38"
            fill="none"
            stroke="#FF4127"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span className="font-display font-black uppercase leading-none tracking-[0.2em]">STRYVE</span>
    </span>
  )
}
