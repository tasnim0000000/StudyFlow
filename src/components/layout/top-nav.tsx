import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, Moon, Search, Sun, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useGlobalSearch } from '@/hooks/use-global-search'
import { useAuth } from '@/providers/auth-provider'
import { useTheme } from '@/providers/theme-provider'
import { getInitials } from '@/lib/utils'

const typeLabels: Record<string, string> = {
  task: 'Task',
  note: 'Note',
  assignment: 'Assignment',
  goal: 'Goal',
  study_session: 'Study Session',
  class: 'Class',
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <Sun className="h-3.5 w-3.5 text-muted-foreground" />
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb" />
      </div>
      <Moon className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  )
}

export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, signOut } = useAuth()
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const results = useGlobalSearch(query)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks, notes, assignments..."
          className="pl-10"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true) }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results.length > 0) {
              navigate(results[0].route)
              setQuery('')
              setShowResults(false)
            }
          }}
        />
        {showResults && query && (
          <div className="absolute top-full z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-glass">
            {results.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
            ) : (
              results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  type="button"
                  className="flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-primary/10"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { navigate(r.route); setQuery(''); setShowResults(false) }}
                >
                  <span className="text-sm font-medium">{r.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {typeLabels[r.type] ?? r.type}
                    {r.subtitle ? ` · ${r.subtitle}` : ''}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <ThemeToggle />

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-xl p-1 hover:bg-primary/10">
            <Avatar>
              <AvatarImage src={user?.avatar ?? undefined} />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {getInitials(user?.name ?? 'U')}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile & Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
