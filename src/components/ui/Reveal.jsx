import { motion } from 'framer-motion'

const variants = {
  up: { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1 } },
  left: { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } },
}

/**
 * Scroll-triggered reveal. Wraps children and animates them into view once.
 */
export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.7,
  className = '',
  as = 'div',
  amount = 0.3,
  ...rest
}) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Staggered container — children use RevealItem.
 */
export function RevealGroup({ children, className = '', stagger = 0.09, delay = 0, amount = 0.25 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className = '', variant = 'up', duration = 0.7, ...rest }) {
  return (
    <motion.div
      className={className}
      variants={variants[variant]}
      transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
