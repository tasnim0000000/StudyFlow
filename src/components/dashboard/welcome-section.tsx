import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getDailyQuote } from '@/constants/quotes'
import { formatDate, getGreeting, getInitials } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'

export function WelcomeSection() {
  const { user } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-sm text-text-muted">{formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h2 className="mt-1 text-2xl font-bold text-text md:text-3xl">
          {getGreeting()}, {user?.name?.split(' ')[0] ?? 'Student'}
        </h2>
        <p className="mt-2 text-sm italic text-text-muted">&ldquo;{getDailyQuote()}&rdquo;</p>
      </div>
      <Avatar className="h-16 w-16">
        <AvatarImage src={user?.avatar ?? undefined} />
        <AvatarFallback className="text-lg">{getInitials(user?.name ?? 'S')}</AvatarFallback>
      </Avatar>
    </motion.div>
  )
}
