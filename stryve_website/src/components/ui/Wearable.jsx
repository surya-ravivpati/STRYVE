import { motion } from 'framer-motion'

/**
 * Engineered SVG rendering of the STRYVE wearable — a muscle-worn sensor module
 * on an athletic strap. Pure vector so it renders crisp at any size with no
 * external image assets. Pulse lighting + animated sensor signals included.
 */
export default function Wearable({ className = '', animate = true }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="STRYVE wearable sensor module on an athletic strap"
    >
      <defs>
        <linearGradient id="strap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#20242E" />
          <stop offset="0.5" stopColor="#141922" />
          <stop offset="1" stopColor="#0C0F15" />
        </linearGradient>
        <linearGradient id="module" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#2A303C" />
          <stop offset="0.55" stopColor="#171C25" />
          <stop offset="1" stopColor="#0B0E13" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0E141C" />
          <stop offset="1" stopColor="#05070A" />
        </linearGradient>
        <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3A4250" />
          <stop offset="1" stopColor="#12161D" />
        </linearGradient>
        <radialGradient id="pulseGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FF4127" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FF4127" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#31E7E0" />
          <stop offset="1" stopColor="#FF4127" />
        </linearGradient>
        <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* ambient pulse glow behind the module */}
      <ellipse cx="260" cy="280" rx="210" ry="210" fill="url(#pulseGlow)" filter="url(#soft)" />

      {/* strap — upper */}
      <path
        d="M150 40 C 210 12, 320 12, 380 46 L 350 190 L 176 190 Z"
        fill="url(#strap)"
        stroke="#2B313D"
        strokeWidth="1.5"
      />
      {/* strap — lower */}
      <path
        d="M176 370 L 350 370 L 384 512 C 322 548, 210 548, 148 516 Z"
        fill="url(#strap)"
        stroke="#2B313D"
        strokeWidth="1.5"
      />
      {/* strap stitching */}
      <path d="M188 60 C 240 40, 300 40, 344 64" stroke="#000" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" />
      <path d="M186 496 C 240 520, 300 520, 346 498" stroke="#000" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" />

      {/* main module body */}
      <rect x="120" y="170" width="280" height="220" rx="34" fill="url(#module)" stroke="url(#edge)" strokeWidth="2" />
      <rect x="120" y="170" width="280" height="220" rx="34" fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="1" transform="translate(0,2)" />

      {/* side machined buttons */}
      <rect x="112" y="238" width="10" height="46" rx="4" fill="#20252F" stroke="#3A4250" strokeWidth="1" />
      <rect x="398" y="252" width="10" height="30" rx="4" fill="#20252F" stroke="#3A4250" strokeWidth="1" />

      {/* screen bezel */}
      <rect x="150" y="196" width="220" height="120" rx="22" fill="url(#glass)" stroke="#000" strokeOpacity="0.6" strokeWidth="1.5" />
      <rect x="150" y="196" width="220" height="120" rx="22" fill="none" stroke="#31E7E0" strokeOpacity="0.14" strokeWidth="1" />

      {/* screen content: readout */}
      <text x="170" y="228" fill="#7A828C" fontFamily="'Space Mono', monospace" fontSize="12" letterSpacing="2">
        CRAMP RISK
      </text>
      <text x="170" y="266" fill="#F4F6F5" fontFamily="'Archivo', sans-serif" fontSize="34" fontWeight="800" letterSpacing="-1">
        LOW
      </text>
      <circle cx="342" cy="216" r="4" fill="#31E7E0">
        {animate && <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite" />}
      </circle>

      {/* animated waveform inside screen */}
      <g clipPath="url(#screenClip)">
        <motion.path
          d="M165 296 L200 296 L212 272 L228 306 L244 284 L262 296 L360 296"
          stroke="url(#wave)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={animate ? { pathLength: 0 } : false}
          animate={animate ? { pathLength: 1 } : false}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
      </g>
      <clipPath id="screenClip">
        <rect x="150" y="196" width="220" height="120" rx="22" />
      </clipPath>

      {/* EMG sensor array (underside contacts shown as a strip) */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <circle cx={172 + i * 44} cy="352" r="12" fill="#0B0E13" stroke="#3A4250" strokeWidth="1.5" />
            <circle cx={172 + i * 44} cy="352" r="5" fill="#FF4127">
              {animate && (
                <animate
                  attributeName="opacity"
                  values="0.25;1;0.25"
                  dur="2.2s"
                  begin={`${i * 0.24}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </g>
        ))}
      </g>

      {/* embossed wordmark */}
      <text x="260" y="180" textAnchor="middle" fill="#3A4250" fontFamily="'Archivo', sans-serif" fontSize="11" fontWeight="800" letterSpacing="6">
        STRYVE
      </text>
    </svg>
  )
}
