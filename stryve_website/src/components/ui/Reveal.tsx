import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const variants: Record<string, Variants> = {
  up: { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  left: { hidden: { opacity: 0, x: -34 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 34 }, show: { opacity: 1, x: 0 } },
}

export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.75,
  className = '',
  amount = 0.3,
}: {
  children: ReactNode
  variant?: keyof typeof variants
  delay?: number
  duration?: number
  className?: string
  amount?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({
  children,
  className = '',
  stagger = 0.08,
  amount = 0.25,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  amount?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
