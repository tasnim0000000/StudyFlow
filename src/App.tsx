import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ProtectedRoute } from '@/components/shared/protected-route'
import { ForgotPasswordPage } from '@/pages/auth/forgot-password'
import { LoginPage } from '@/pages/auth/login'
import { RegisterPage } from '@/pages/auth/register'
import { AnalyticsPage } from '@/pages/analytics'
import { AssignmentsPage } from '@/pages/assignments'
import { CalendarPage } from '@/pages/calendar'
import { DashboardPage } from '@/pages/dashboard'
import { GoalsPage } from '@/pages/goals'
import { NotesPage } from '@/pages/notes'
import { SettingsPage } from '@/pages/settings'
import { StudyPlannerPage } from '@/pages/study-planner'
import { TasksPage } from '@/pages/tasks'
import { AuthProvider } from '@/providers/auth-provider'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-provider'

export default function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/assignments" element={<AssignmentsPage />} />
                  <Route path="/study-planner" element={<StudyPlannerPage />} />
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/goals" element={<GoalsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
