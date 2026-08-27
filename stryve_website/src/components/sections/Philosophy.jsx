import { motion } from 'framer-motion'

const LINES = [
  { text: 'Train hard.', accent: false },
  { text: 'Understand more.', accent: false },
  { text: 'Perform longer.', accent: true },
]

export default function Philosophy() {
  return (
    <section id="about" className="relative overflow-hidden border-t border-chalk/[0.07] bg-carbon py-28 md:py-44">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.35]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pulse/[0.07] blur-[150px]" />
      <div className="container-x relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
          className="mx-auto max-w-5xl text-center"
        >
          {LINES.map((l) => (
            <div key={l.text} className="overflow-hidden">
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: '110%' },
                  show: { opacity: 1, y: '0%', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
                className={`display-tight text-[clamp(2.6rem,11vw,8.5rem)] ${
                  l.accent ? 'text-pulse' : 'text-chalk'
                }`}
              >
                {l.text}
              </motion.h2>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-12 max-w-md text-center font-mono text-[11px] uppercase tracking-[0.3em] text-slate"
        >
          Intelligent athletic performance technology
        </motion.p>
      </div>
    </section>
  )
}
