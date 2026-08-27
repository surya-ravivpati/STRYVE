import Mark from './Mark.jsx'

/**
 * Official STRYVE wordmark artwork. Rendered as an <img> so the supplied
 * letterforms are used verbatim rather than approximated with a webfont.
 */
export function Wordmark({ className = 'h-4', withMark = false, markClassName = 'h-5 w-auto' }) {
  return (
    <span className="inline-flex items-center gap-3">
      {withMark && <Mark className={`${markClassName} text-pulse`} />}
      <img
        src="/brand/word_mark.png"
        alt="STRYVE"
        className={`${className} w-auto select-none`}
        draggable="false"
      />
    </span>
  )
}

export default Wordmark
