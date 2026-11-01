import Mark from './Mark'

/**
 * Official POWERTHRU wordmark artwork (recoloured to chalk for the dark
 * site) — used verbatim rather than approximated with a webfont.
 */
export default function Wordmark({
  className = 'h-3',
  withMark = false,
  markClassName = 'h-6 w-auto',
}: {
  className?: string
  withMark?: boolean
  markClassName?: string
}) {
  return (
    <span className="inline-flex items-center gap-3">
      {withMark && <Mark className={`${markClassName} text-chalk`} />}
      <img
        src="/brand/powerthru-wordmark.png"
        alt="PowerThru"
        className={`${className} w-auto select-none`}
        draggable={false}
      />
    </span>
  )
}
