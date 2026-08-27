import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader.jsx'

const CASES = [
  {
    name: 'Basketball',
    stat: '4th Qtr',
    desc: 'Explosive stop-start load stacks up fast. STRYVE flags fatigue before the closing minutes.',
  },
  {
    name: 'Soccer',
    stat: '90+ min',
    desc: 'Ninety minutes of repeated sprints. Catch calf and hamstring risk before extra time.',
  },
  {
    name: 'Track & Field',
    stat: 'Max effort',
    desc: 'Every rep near the limit. Monitor muscle output across heats and finals.',
  },
  {
    name: 'Fencing',
    stat: 'Explosive',
    desc: 'Sharp lunges under constant tension. Read the legs that carry every touch.',
  },
  {
    name: 'Football',
    stat: 'Collision',
    desc: 'High-load, high-heat drives. Track exertion and cramp risk down the stretch.',
  },
  {
    name: 'Endurance',
    stat: 'Hours',
    desc: 'Long, grinding efforts. Manage hydration and fatigue across the full distance.',
  },
]

export default function UseCases() {
  return (
    <section id="athletes" className="relative border-t border-chalk/[0.07] bg-carbon-950 py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="/ 05"
          eyebrow="For Athletes"
          title="Built for every push."
          kicker="Different sports, one physiology. Wherever fatigue builds and cramps threaten, STRYVE reads the moment."
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CASES.map((c, i) => (
            <motion.article
              key={c.name}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden border border-chalk/[0.08] bg-carbon-800 p-7 transition-all duration-500 hover:border-chalk/25"
            >
              {/* animated corner accent */}
              <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(120% 80% at 100% 0%, rgba(255,66,29,0.14), transparent 60%)' }} />
              <span className="pointer-events-none absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-pulse transition-transform duration-500 group-hover:scale-y-100" />

              <div className="relative flex items-start justify-between">
                <span className="font-mono text-6xl font-bold text-chalk/[0.06] transition-colors duration-500 group-hover:text-chalk/[0.1]">
                  0{i + 1}
                </span>
                <span className="border border-chalk/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ion">
                  {c.stat}
                </span>
              </div>

              <div className="relative">
                <h3 className="font-display text-2xl uppercase tracking-tight text-chalk">
                  {c.name}
                </h3>
                <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-slate-light">{c.desc}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
