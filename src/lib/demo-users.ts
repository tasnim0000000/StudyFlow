import type { Profile } from '@/types'

export interface DemoUserAccount {
  id: string
  email: string
  password: string
  profile: Profile
}

export const DEMO_USERS: DemoUserAccount[] = [
  {
    id: 'user-tasnim-001',
    email: 'tasnimahmed123@gmail.com',
    password: 'Tasnim@123',
    profile: {
      id: 'user-tasnim-001',
      name: 'Tasnim Ahmed',
      email: 'tasnimahmed123@gmail.com',
      avatar: null,
      created_at: '2024-09-01T08:00:00.000Z',
    },
  },
  {
    id: 'user-alex-001',
    email: 'alex.johnson@university.edu',
    password: 'Alex@123',
    profile: {
      id: 'user-alex-001',
      name: 'Alex Johnson',
      email: 'alex.johnson@university.edu',
      avatar: null,
      created_at: '2024-09-15T10:00:00.000Z',
    },
  },
  {
    id: 'user-maria-001',
    email: 'maria.garcia@university.edu',
    password: 'Maria@123',
    profile: {
      id: 'user-maria-001',
      name: 'Maria Garcia',
      email: 'maria.garcia@university.edu',
      avatar: null,
      created_at: '2024-09-15T10:00:00.000Z',
    },
  },
  {
    id: 'user-james-001',
    email: 'james.wilson@university.edu',
    password: 'James@123',
    profile: {
      id: 'user-james-001',
      name: 'James Wilson',
      email: 'james.wilson@university.edu',
      avatar: null,
      created_at: '2024-10-01T09:00:00.000Z',
    },
  },
  {
    id: 'user-priya-001',
    email: 'priya.sharma@university.edu',
    password: 'Priya@123',
    profile: {
      id: 'user-priya-001',
      name: 'Priya Sharma',
      email: 'priya.sharma@university.edu',
      avatar: null,
      created_at: '2024-10-01T09:00:00.000Z',
    },
  },
]

export function findDemoUserByEmail(email: string): DemoUserAccount | undefined {
  return DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function validateDemoCredentials(email: string, password: string): DemoUserAccount | null {
  const user = findDemoUserByEmail(email)
  if (!user || user.password !== password) return null
  return user
}

export function findDemoUserById(id: string): DemoUserAccount | undefined {
  return DEMO_USERS.find((u) => u.id === id)
}
