import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const colorMap = {
  lavender: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  pink:     'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
  blue:     'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
  mint:     'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  yellow:   'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
}

const bgAccent = {
  lavender: 'from-purple-50 to-white dark:from-purple-900/20 dark:to-card',
  pink:     'from-pink-50 to-white dark:from-pink-900/20 dark:to-card',
  blue:     'from-sky-50 to-white dark:from-sky-900/20 dark:to-card',
  mint:     'from-emerald-50 to-white dark:from-emerald-900/20 dark:to-card',
  yellow:   'from-amber-50 to-white dark:from-amber-900/20 dark:to-card',
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color = 'lavender',
  index = 0,
  href,
}: {
  title: string
  value: string | number
  icon: LucideIcon
  color?: keyof typeof colorMap
  index?: number
  href?: string
}) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => href && navigate(href)}
      className={cn(
        'glass-card bg-gradient-to-br',
        bgAccent[color],
        href && 'cursor-pointer hover:scale-105 hover:shadow-glass active:scale-95'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {href && (
            <p className="mt-1 text-xs text-muted-foreground">Click to view →</p>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', colorMap[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  )
}
