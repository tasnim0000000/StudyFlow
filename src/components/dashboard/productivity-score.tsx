import { motion } from 'framer-motion'

export function ProductivityScore({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="glass-card flex flex-col items-center">
      <h3 className="mb-4 text-lg font-semibold text-text">Productivity Score</h3>
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r="54" fill="none" stroke="#CDB4DB" strokeOpacity="0.2" strokeWidth="12" />
          <motion.circle
            cx="70"
            cy="70"
            r="54"
            fill="none"
            stroke="#B8A0C8"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-text">{score}</span>
          <span className="text-xs text-text-muted">out of 100</span>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-text-muted">
        Based on tasks, study hours & goals
      </p>
    </div>
  )
}
