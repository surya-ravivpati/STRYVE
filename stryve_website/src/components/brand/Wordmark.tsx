import Mark from './Mark'

/**
 * Official STRYVE wordmark artwork — used verbatim rather than approximated
 * with a webfont.
 */
export default function Wordmark({
  className = 'h-4',
  withMark = false,
  markClassName = 'h-5 w-auto',
}: {
  className?: string
  withMark?: boolean
  markClassName?: string
}) {
  return (
    <span className="inline-flex items-center gap-3">
      {withMark && <Mark className={`${markClassName} text-pulse`} />}
      <img
        src="/brand/word_mark.png"
        alt="STRYVE"
        className={`${className} w-auto select-none`}
        draggable={false}
      />
    </span>
  )
}
