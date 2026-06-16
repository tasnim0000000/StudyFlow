import type { Assignment, ClassSchedule, Goal, Note, Profile, StudySession, Task } from '@/types'
import { findDemoUserById } from '@/lib/demo-users'
import { getTasnimSeed } from './tasnim'
import { COURSES, daysFromNow, sessionTime } from './helpers'

export interface UserDataSeed {
  profile: Profile
  tasks: Task[]
  assignments: Assignment[]
  notes: Note[]
  studySessions: StudySession[]
  goals: Goal[]
  classes: ClassSchedule[]
}

function alexSeed(): Omit<UserDataSeed, 'profile'> {
  const id = 'user-alex-001'
  const base = new Date()
  return {
    tasks: [
      { id: 'a-t-1', user_id: id, title: 'Implement REST API', description: 'Build CRUD endpoints', course: COURSES.cs301, priority: 'high', deadline: daysFromNow(3, base), status: 'in_progress', created_at: daysFromNow(-5, base), updated_at: daysFromNow(-1, base) },
      { id: 'a-t-2', user_id: id, title: 'Read Chapter 7', description: null, course: COURSES.math205, priority: 'medium', deadline: daysFromNow(5, base), status: 'todo', created_at: daysFromNow(-3, base), updated_at: daysFromNow(-3, base) },
      { id: 'a-t-3', user_id: id, title: 'Lab Report Draft', description: 'Wave interference', course: COURSES.phys101, priority: 'high', deadline: daysFromNow(1, base), status: 'todo', created_at: daysFromNow(-2, base), updated_at: daysFromNow(-2, base) },
      { id: 'a-t-4', user_id: id, title: 'Database Normalization Review', description: null, course: COURSES.cs202, priority: 'low', deadline: daysFromNow(7, base), status: 'completed', created_at: daysFromNow(-10, base), updated_at: daysFromNow(-1, base) },
      { id: 'a-t-5', user_id: id, title: 'Presentation Slides', description: null, course: COURSES.eng202, priority: 'medium', deadline: daysFromNow(4, base), status: 'in_progress', created_at: daysFromNow(-4, base), updated_at: daysFromNow(-2, base) },
    ],
    assignments: [
      { id: 'a-a-1', user_id: id, course: COURSES.cs301, title: 'Full Stack Web Application', due_date: daysFromNow(14, base), status: 'in_progress', marks: null, created_at: daysFromNow(-20, base) },
      { id: 'a-a-2', user_id: id, course: COURSES.eng202, title: 'Essay: Modernism', due_date: daysFromNow(7, base), status: 'not_started', marks: null, created_at: daysFromNow(-10, base) },
      { id: 'a-a-3', user_id: id, course: COURSES.math205, title: 'Problem Set 5', due_date: daysFromNow(2, base), status: 'in_progress', marks: null, created_at: daysFromNow(-7, base) },
    ],
    notes: [
      { id: 'a-n-1', user_id: id, title: 'React Hooks Cheat Sheet', content: '<ul><li>useState</li><li>useEffect</li><li>useContext</li></ul>', tags: ['react', 'cs301'], created_at: daysFromNow(-6, base), updated_at: daysFromNow(-2, base) },
      { id: 'a-n-2', user_id: id, title: 'SQL Joins Summary', content: '<p>INNER, LEFT, RIGHT joins</p>', tags: ['cs202'], created_at: daysFromNow(-8, base), updated_at: daysFromNow(-8, base) },
    ],
    studySessions: [
      { id: 'a-s-1', user_id: id, subject: 'Data Structures', ...sessionTime(2, 9, 2, base), goal: 'BST exercises', created_at: daysFromNow(-2, base) },
      { id: 'a-s-2', user_id: id, subject: COURSES.cs301, ...sessionTime(1, 14, 3, base), goal: 'React components', created_at: daysFromNow(-1, base) },
    ],
    goals: [
      { id: 'a-g-1', user_id: id, goal_name: 'Complete Java Project', target_date: '2026-06-30', progress: 65, created_at: daysFromNow(-30, base) },
      { id: 'a-g-2', user_id: id, goal_name: 'Study 4 Hours Daily', target_date: '2026-06-15', progress: 40, created_at: daysFromNow(-20, base) },
    ],
    classes: [
      { id: 'a-c-1', user_id: id, class_name: 'Web Dev Lecture', course: 'CS301', day_of_week: base.getDay(), start_time: '09:00', end_time: '10:30' },
      { id: 'a-c-2', user_id: id, class_name: 'Linear Algebra', course: 'MATH205', day_of_week: base.getDay(), start_time: '11:00', end_time: '12:00' },
    ],
  }
}

function mariaSeed(): Omit<UserDataSeed, 'profile'> {
  const id = 'user-maria-001'
  const base = new Date()
  return {
    tasks: [
      { id: 'm-t-1', user_id: id, title: 'Organic Chemistry Lab Prep', description: null, course: 'CHEM201 Organic Chemistry', priority: 'high', deadline: daysFromNow(2, base), status: 'in_progress', created_at: daysFromNow(-4, base), updated_at: daysFromNow(-1, base) },
      { id: 'm-t-2', user_id: id, title: 'Statistics Problem Set 4', description: null, course: 'STAT210 Statistics', priority: 'medium', deadline: daysFromNow(6, base), status: 'todo', created_at: daysFromNow(-3, base), updated_at: daysFromNow(-3, base) },
      { id: 'm-t-3', user_id: id, title: 'Psychology Research Summary', description: null, course: 'PSY101 Introduction to Psychology', priority: 'low', deadline: daysFromNow(10, base), status: 'todo', created_at: daysFromNow(-5, base), updated_at: daysFromNow(-5, base) },
    ],
    assignments: [
      { id: 'm-a-1', user_id: id, course: 'CHEM201 Organic Chemistry', title: 'Lab Report – Synthesis', due_date: daysFromNow(5, base), status: 'in_progress', marks: null, created_at: daysFromNow(-15, base) },
      { id: 'm-a-2', user_id: id, course: 'STAT210 Statistics', title: 'Hypothesis Testing Project', due_date: daysFromNow(12, base), status: 'not_started', marks: null, created_at: daysFromNow(-8, base) },
    ],
    notes: [
      { id: 'm-n-1', user_id: id, title: 'Organic Reactions List', content: '<ol><li>SN1 / SN2</li><li>E1 / E2</li><li>Grignard reaction</li></ol>', tags: ['chem201', 'exam'], created_at: daysFromNow(-10, base), updated_at: daysFromNow(-2, base) },
    ],
    studySessions: [
      { id: 'm-s-1', user_id: id, subject: 'CHEM201', ...sessionTime(1, 10, 2, base), goal: 'Reaction mechanisms', created_at: daysFromNow(-1, base) },
    ],
    goals: [
      { id: 'm-g-1', user_id: id, goal_name: 'Maintain Dean\'s List', target_date: '2026-07-01', progress: 70, created_at: daysFromNow(-60, base) },
    ],
    classes: [
      { id: 'm-c-1', user_id: id, class_name: 'Organic Chemistry Lab', course: 'CHEM201', day_of_week: base.getDay(), start_time: '13:00', end_time: '16:00' },
    ],
  }
}

function jamesSeed(): Omit<UserDataSeed, 'profile'> {
  const id = 'user-james-001'
  const base = new Date()
  return {
    tasks: [
      { id: 'j-t-1', user_id: id, title: 'Mechanics Problem Set 8', description: null, course: 'MECH301 Mechanical Design', priority: 'high', deadline: daysFromNow(4, base), status: 'in_progress', created_at: daysFromNow(-6, base), updated_at: daysFromNow(-2, base) },
      { id: 'j-t-2', user_id: id, title: 'CAD Model Submission', description: null, course: 'MECH301 Mechanical Design', priority: 'high', deadline: daysFromNow(8, base), status: 'todo', created_at: daysFromNow(-3, base), updated_at: daysFromNow(-3, base) },
    ],
    assignments: [
      { id: 'j-a-1', user_id: id, course: 'MECH301 Mechanical Design', title: 'Thermodynamics Final Project', due_date: daysFromNow(20, base), status: 'in_progress', marks: null, created_at: daysFromNow(-25, base) },
    ],
    notes: [
      { id: 'j-n-1', user_id: id, title: 'Thermodynamics Laws', content: '<ul><li>Zeroth law</li><li>First law</li><li>Second law</li></ul>', tags: ['mech301'], created_at: daysFromNow(-12, base), updated_at: daysFromNow(-4, base) },
    ],
    studySessions: [
      { id: 'j-s-1', user_id: id, subject: 'MECH301', ...sessionTime(3, 15, 2, base), goal: 'CAD practice', created_at: daysFromNow(-3, base) },
    ],
    goals: [
      { id: 'j-g-1', user_id: id, goal_name: 'Complete Co-op Application', target_date: '2026-06-18', progress: 50, created_at: daysFromNow(-20, base) },
    ],
    classes: [
      { id: 'j-c-1', user_id: id, class_name: 'Mechanical Design Studio', course: 'MECH301', day_of_week: (base.getDay() + 1) % 7, start_time: '10:00', end_time: '12:00' },
    ],
  }
}

function priyaSeed(): Omit<UserDataSeed, 'profile'> {
  const id = 'user-priya-001'
  const base = new Date()
  return {
    tasks: [
      { id: 'p-t-1', user_id: id, title: 'Machine Learning Assignment 3', description: 'Neural networks', course: 'CS450 Machine Learning', priority: 'high', deadline: daysFromNow(5, base), status: 'in_progress', created_at: daysFromNow(-7, base), updated_at: daysFromNow(-1, base) },
      { id: 'p-t-2', user_id: id, title: 'Research Paper Outline', description: null, course: 'CS450 Machine Learning', priority: 'medium', deadline: daysFromNow(12, base), status: 'todo', created_at: daysFromNow(-4, base), updated_at: daysFromNow(-4, base) },
      { id: 'p-t-3', user_id: id, title: 'Python Pandas Exercise', description: null, course: 'CS350 Data Structures', priority: 'low', deadline: daysFromNow(3, base), status: 'completed', created_at: daysFromNow(-10, base), updated_at: daysFromNow(-2, base) },
    ],
    assignments: [
      { id: 'p-a-1', user_id: id, course: 'CS450 Machine Learning', title: 'Classification Model Report', due_date: daysFromNow(15, base), status: 'in_progress', marks: null, created_at: daysFromNow(-20, base) },
      { id: 'p-a-2', user_id: id, course: 'CS350 Data Structures', title: 'Heap Implementation', due_date: daysFromNow(-5, base), status: 'graded', marks: 96, created_at: daysFromNow(-30, base) },
    ],
    notes: [
      { id: 'p-n-1', user_id: id, title: 'ML Algorithms Overview', content: '<ol><li>Linear Regression</li><li>Decision Trees</li><li>SVM</li><li>Neural Networks</li></ol>', tags: ['cs450', 'ml'], created_at: daysFromNow(-14, base), updated_at: daysFromNow(-3, base) },
    ],
    studySessions: [
      { id: 'p-s-1', user_id: id, subject: 'CS450', ...sessionTime(2, 18, 3, base), goal: 'TensorFlow tutorial', created_at: daysFromNow(-2, base) },
      { id: 'p-s-2', user_id: id, subject: 'CS350', ...sessionTime(5, 11, 2, base), goal: 'Heap problems', created_at: daysFromNow(-5, base) },
    ],
    goals: [
      { id: 'p-g-1', user_id: id, goal_name: 'Publish Research Poster', target_date: '2026-07-15', progress: 35, created_at: daysFromNow(-40, base) },
      { id: 'p-g-2', user_id: id, goal_name: 'Kaggle Competition Top 20%', target_date: '2026-08-01', progress: 20, created_at: daysFromNow(-15, base) },
    ],
    classes: [
      { id: 'p-c-1', user_id: id, class_name: 'Machine Learning Lecture', course: 'CS450', day_of_week: base.getDay(), start_time: '14:00', end_time: '15:30' },
    ],
  }
}

export function getSeedForUser(userId: string): UserDataSeed | null {
  const account = findDemoUserById(userId)
  if (!account) return null

  let data: Omit<UserDataSeed, 'profile'>
  switch (userId) {
    case 'user-tasnim-001':
      data = getTasnimSeed()
      break
    case 'user-alex-001':
      data = alexSeed()
      break
    case 'user-maria-001':
      data = mariaSeed()
      break
    case 'user-james-001':
      data = jamesSeed()
      break
    case 'user-priya-001':
      data = priyaSeed()
      break
    default:
      return null
  }

  return { profile: account.profile, ...data }
}
