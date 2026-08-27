import type { ReactNode } from 'react'
import Reveal from './Reveal'
import Mark from '../brand/Mark'

export default function SectionHead({
  index,
  label,
  title,
  body,
  align = 'left',
  className = '',
}: {
  index?: string
  label: string
  title: ReactNode
  body?: ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  const centred = align === 'center'
  return (
    <div className={`${centred ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}>
      <Reveal>
        <div className={`flex items-center gap-3.5 ${centred ? 'justify-center' : ''}`}>
          <Mark className="h-3 w-auto text-pulse" />
          {index && <span className="font-mono text-[10px] text-pulse">{index}</span>}
          <span className="label">{label}</span>
          <span className="h-px w-12 bg-chalk/15" />
        </div>
      </Reveal>
      <Reveal delay={0.07}>
        <h2 className="editorial mt-6 text-[clamp(2rem,5vw,3.8rem)]">{title}</h2>
      </Reveal>
      {body && (
        <Reveal delay={0.14}>
          <p className={`mt-6 max-w-xl text-[15px] leading-[1.75] text-chalk-dim ${centred ? 'mx-auto' : ''}`}>
            {body}
          </p>
        </Reveal>
      )}
    </div>
  )
}
