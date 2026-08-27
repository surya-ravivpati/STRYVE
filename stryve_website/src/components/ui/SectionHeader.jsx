import Reveal from './Reveal.jsx'
import Mark from '../brand/Mark.jsx'

export default function SectionHeader({ index, eyebrow, title, kicker, align = 'left', className = '' }) {
  return (
    <div className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}>
      <Reveal variant="up">
        <div className={`flex items-center gap-3.5 ${align === 'center' ? 'justify-center' : ''}`}>
          <Mark className="h-3.5 w-auto text-pulse" />
          {index && <span className="font-mono text-[11px] text-pulse">{index}</span>}
          <span className="eyebrow">{eyebrow}</span>
          <span className="h-px w-12 bg-chalk/15" />
        </div>
      </Reveal>
      <Reveal variant="up" delay={0.08}>
        <h2 className="display-tight mt-6 text-[clamp(2.1rem,5.4vw,4rem)]">{title}</h2>
      </Reveal>
      {kicker && (
        <Reveal variant="up" delay={0.16}>
          <p className={`mt-6 max-w-xl text-[15px] leading-[1.75] text-chalk-dim ${align === 'center' ? 'mx-auto' : ''}`}>
            {kicker}
          </p>
        </Reveal>
      )}
    </div>
  )
}
