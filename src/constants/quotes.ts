export const MOTIVATIONAL_QUOTES = [
  'Small steps every day lead to big achievements.',
  'Focus on progress, not perfection.',
  'Your future self will thank you for studying today.',
  'Discipline is choosing between what you want now and what you want most.',
  'Every expert was once a beginner.',
  'Success is the sum of small efforts repeated daily.',
  'The secret of getting ahead is getting started.',
  'Dream big. Study hard. Stay humble.',
]

export function getDailyQuote(): string {
  const dayIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length
  return MOTIVATIONAL_QUOTES[dayIndex]
}
