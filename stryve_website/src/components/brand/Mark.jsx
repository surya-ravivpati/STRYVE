/**
 * STRYVE mark — the Y-spike, traced from the source logo art.
 * Single path so it stays crisp at any size and can be recolored/animated.
 */
export const MARK_VIEWBOX = '0 0 100 106.09'
export const MARK_PATH =
  'M58.24,106.09 L41.04,106.09 L40.14,105.56 L39.78,94.44 L40.50,87.63 L40.50,71.15 L24.73,52.15 L0.00,23.84 L0.00,23.12 L1.25,22.22 L11.65,28.67 L26.34,38.71 L42.83,51.25 L43.37,50.72 L44.09,43.19 L44.80,41.40 L44.80,37.10 L45.52,35.30 L45.52,31.36 L46.24,29.21 L46.24,24.55 L46.95,22.76 L48.39,5.56 L49.10,0.90 L50.36,0.00 L51.25,0.90 L51.25,4.48 L51.97,6.27 L52.69,15.95 L53.41,18.46 L53.41,23.12 L54.12,25.27 L54.12,28.14 L54.84,29.57 L55.56,40.68 L56.27,41.76 L56.27,46.77 L57.17,50.90 L88.71,28.67 L98.75,22.22 L100.00,22.40 L100.00,24.19 L75.27,52.15 L63.08,66.49 L59.50,71.51 L59.14,72.58 L59.86,82.97 L59.86,105.56 L58.24,106.09 Z'

export default function Mark({ className = '', color = 'currentColor', title, ...rest }) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title && <title>{title}</title>}
      <path d={MARK_PATH} />
    </svg>
  )
}
