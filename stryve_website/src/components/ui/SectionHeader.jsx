import Reveal from './Reveal.jsx'

export default function SectionHeader({ index, eyebrow, title, kicker, align = 'left', className = '' }) {
  return (
    <div
      className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}
    >
      <Reveal variant="up">
        <div className={`flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
          {index && <span className="font-mono text-[11px] text-pulse">{index}</span>}
          <span className="eyebrow">{eyebrow}</span>
          <span className="h-px w-10 bg-white/15" />
        </div>
      </Reveal>
      <Reveal variant="up" delay={0.08}>
        <h2 className="display-tight mt-5 text-[clamp(2rem,5.2vw,3.9rem)]">{title}</h2>
      </Reveal>
      {kicker && (
        <Reveal variant="up" delay={0.16}>
          <p
            className={`mt-5 text-[15px] leading-relaxed text-chalk-dim ${
              align === 'center' ? 'mx-auto' : ''
            } max-w-xl`}
          >
            {kicker}
          </p>
        </Reveal>
      )}
    </div>
  )
}
