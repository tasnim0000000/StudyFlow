import { getSeedForUser } from '@/lib/demo-seeds'
import type { Assignment, ClassSchedule, Goal, Note, Profile, StudySession, Task } from '@/types'

const DATA_PREFIX = 'studyflow-user-data-'
const AUTH_KEY = 'studyflow-demo-auth'
const LEGACY_KEY = 'studyflow-demo-data'

interface UserStore {
  profile: Profile
  tasks: Task[]
  assignments: Assignment[]
  notes: Note[]
  studySessions: StudySession[]
  goals: Goal[]
  classes: ClassSchedule[]
}

let currentUserId: string | null = null

function storageKey(userId: string) {
  return `${DATA_PREFIX}${userId}`
}

function loadUserStore(userId: string): UserStore {
  const stored = localStorage.getItem(storageKey(userId))
  if (stored) {
    try {
      return JSON.parse(stored) as UserStore
    } catch {
      // fall through to seed
    }
  }

  const seed = getSeedForUser(userId)
  if (!seed) throw new Error(`No seed data for user ${userId}`)

  const store: UserStore = {
    profile: seed.profile,
    tasks: [...seed.tasks],
    assignments: [...seed.assignments],
    notes: [...seed.notes],
    studySessions: [...seed.studySessions],
    goals: [...seed.goals],
    classes: [...seed.classes],
  }
  saveUserStore(userId, store)
  return store
}

function saveUserStore(userId: string, store: UserStore) {
  localStorage.setItem(storageKey(userId), JSON.stringify(store))
}

function requireUserId(): string {
  if (!currentUserId) throw new Error('No demo user logged in')
  return currentUserId
}

function withStore<T>(fn: (store: UserStore, userId: string) => T): T {
  const userId = requireUserId()
  const store = loadUserStore(userId)
  const result = fn(store, userId)
  saveUserStore(userId, store)
  return result
}

function generateId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

/** Remove legacy single-user storage from earlier versions */
function migrateLegacyStorage() {
  if (localStorage.getItem(LEGACY_KEY)) {
    localStorage.removeItem(LEGACY_KEY)
  }
}

export const demoStore = {
  setCurrentUser(userId: string) {
    currentUserId = userId
    migrateLegacyStorage()
    loadUserStore(userId)
    localStorage.setItem(AUTH_KEY, userId)
  },

  clearCurrentUser() {
    currentUserId = null
    localStorage.removeItem(AUTH_KEY)
  },

  restoreSession(): string | null {
    migrateLegacyStorage()
    const userId = localStorage.getItem(AUTH_KEY)
    if (userId) {
      currentUserId = userId
      return userId
    }
    return null
  },

  getProfile(): Profile {
    return loadUserStore(requireUserId()).profile
  },

  updateProfile(updates: Partial<Profile>): Profile {
    return withStore((store) => {
      store.profile = { ...store.profile, ...updates }
      return store.profile
    })
  },

  getTasks(): Task[] {
    return loadUserStore(requireUserId()).tasks
  },

  createTask(data: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Task {
    return withStore((store, userId) => {
      const task: Task = {
        ...data,
        id: generateId('task'),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      store.tasks.push(task)
      return task
    })
  },

  updateTask(id: string, updates: Partial<Task>): Task {
    return withStore((store) => {
      const index = store.tasks.findIndex((t) => t.id === id)
      if (index === -1) throw new Error('Task not found')
      store.tasks[index] = { ...store.tasks[index], ...updates, updated_at: new Date().toISOString() }
      return store.tasks[index]
    })
  },

  deleteTask(id: string): void {
    withStore((store) => {
      store.tasks = store.tasks.filter((t) => t.id !== id)
    })
  },

  getAssignments(): Assignment[] {
    return loadUserStore(requireUserId()).assignments
  },

  createAssignment(data: Omit<Assignment, 'id' | 'user_id' | 'created_at'>): Assignment {
    return withStore((store, userId) => {
      const assignment: Assignment = {
        ...data,
        id: generateId('assign'),
        user_id: userId,
        created_at: new Date().toISOString(),
      }
      store.assignments.push(assignment)
      return assignment
    })
  },

  updateAssignment(id: string, updates: Partial<Assignment>): Assignment {
    return withStore((store) => {
      const index = store.assignments.findIndex((a) => a.id === id)
      if (index === -1) throw new Error('Assignment not found')
      store.assignments[index] = { ...store.assignments[index], ...updates }
      return store.assignments[index]
    })
  },

  deleteAssignment(id: string): void {
    withStore((store) => {
      store.assignments = store.assignments.filter((a) => a.id !== id)
    })
  },

  getNotes(): Note[] {
    return loadUserStore(requireUserId()).notes
  },

  createNote(data: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Note {
    return withStore((store, userId) => {
      const note: Note = {
        ...data,
        id: generateId('note'),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      store.notes.push(note)
      return note
    })
  },

  updateNote(id: string, updates: Partial<Note>): Note {
    return withStore((store) => {
      const index = store.notes.findIndex((n) => n.id === id)
      if (index === -1) throw new Error('Note not found')
      store.notes[index] = { ...store.notes[index], ...updates, updated_at: new Date().toISOString() }
      return store.notes[index]
    })
  },

  deleteNote(id: string): void {
    withStore((store) => {
      store.notes = store.notes.filter((n) => n.id !== id)
    })
  },

  getStudySessions(): StudySession[] {
    return loadUserStore(requireUserId()).studySessions
  },

  createStudySession(data: Omit<StudySession, 'id' | 'user_id' | 'created_at'>): StudySession {
    return withStore((store, userId) => {
      const session: StudySession = {
        ...data,
        id: generateId('session'),
        user_id: userId,
        created_at: new Date().toISOString(),
      }
      store.studySessions.push(session)
      return session
    })
  },

  updateStudySession(id: string, updates: Partial<StudySession>): StudySession {
    return withStore((store) => {
      const index = store.studySessions.findIndex((s) => s.id === id)
      if (index === -1) throw new Error('Study session not found')
      store.studySessions[index] = { ...store.studySessions[index], ...updates }
      return store.studySessions[index]
    })
  },

  deleteStudySession(id: string): void {
    withStore((store) => {
      store.studySessions = store.studySessions.filter((s) => s.id !== id)
    })
  },

  getGoals(): Goal[] {
    return loadUserStore(requireUserId()).goals
  },

  createGoal(data: Omit<Goal, 'id' | 'user_id' | 'created_at'>): Goal {
    return withStore((store, userId) => {
      const goal: Goal = {
        ...data,
        id: generateId('goal'),
        user_id: userId,
        created_at: new Date().toISOString(),
      }
      store.goals.push(goal)
      return goal
    })
  },

  updateGoal(id: string, updates: Partial<Goal>): Goal {
    return withStore((store) => {
      const index = store.goals.findIndex((g) => g.id === id)
      if (index === -1) throw new Error('Goal not found')
      store.goals[index] = { ...store.goals[index], ...updates }
      return store.goals[index]
    })
  },

  deleteGoal(id: string): void {
    withStore((store) => {
      store.goals = store.goals.filter((g) => g.id !== id)
    })
  },

  getClasses(): ClassSchedule[] {
    return loadUserStore(requireUserId()).classes
  },

  /** Reset current user's data to factory seed */
  resetCurrentUser(): void {
    const userId = requireUserId()
    localStorage.removeItem(storageKey(userId))
    loadUserStore(userId)
  },

  /** Reset all demo users' stored data */
  resetAll(): void {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(DATA_PREFIX))
      .forEach((k) => localStorage.removeItem(k))
    localStorage.removeItem(LEGACY_KEY)
  },
}
