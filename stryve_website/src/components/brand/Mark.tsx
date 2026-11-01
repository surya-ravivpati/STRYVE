/**
 * PowerThru mark — the forward "P": an arrow-shaped bowl with the blue
 * drive-bar running through it. Traced from the official artwork to two
 * paths so it stays crisp at any size.
 *
 * The bowl takes `currentColor` (chalk on the dark site), the bar always takes
 * PowerThru blue. Pass `mono` for one-colour use (watermarks, tiny sizes).
 */
export const MARK_VIEWBOX = '120 580 1770 946'
export const MARK_BODY =
  'M498 585L1478 585Q1520 585 1552 612L1858 878Q1885 905 1885 940Q1885 975 1858 1000L1552 1263Q1520 1290 1478 1290L770 1290Q725 1290 698 1318L562 1490Q535 1522 492 1522L268 1522Q245 1522 258 1500L518 1158Q548 1110 600 1110L1330 1110Q1362 1110 1392 1090L1552 970Q1568 955 1568 940Q1568 925 1552 912L1395 795Q1362 770 1320 770L678 770Q640 770 618 748L488 615Q478 600 498 585Z'
export const MARK_BAR =
  'M140 922L258 860Q270 855 285 855L1322 855Q1335 855 1345 862L1442 925Q1455 940 1442 955L1345 1016Q1335 1022 1322 1022L285 1022Q270 1022 258 1016L140 958Q122 940 140 922Z'

type Props = React.SVGProps<SVGSVGElement> & { title?: string; mono?: boolean }

export default function Mark({ className = '', title, mono = false, ...rest }: Props) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title && <title>{title}</title>}
      <path d={MARK_BODY} />
      <path d={MARK_BAR} fill={mono ? 'currentColor' : 'var(--pulse)'} />
    </svg>
  )
}
