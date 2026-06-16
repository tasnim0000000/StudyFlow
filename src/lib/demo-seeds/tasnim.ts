import type { Assignment, ClassSchedule, Goal, Note, StudySession, Task } from '@/types'
import { COURSES, daysFromNow, sessionTime } from './helpers'

const USER_ID = 'user-tasnim-001'
const base = new Date()

function task(
  id: string,
  title: string,
  course: string,
  priority: Task['priority'],
  status: Task['status'],
  deadlineDays: number,
  createdDaysAgo: number,
  description?: string
): Task {
  return {
    id,
    user_id: USER_ID,
    title,
    description: description ?? null,
    course,
    priority,
    deadline: daysFromNow(deadlineDays, base),
    status,
    created_at: daysFromNow(-createdDaysAgo, base),
    updated_at: daysFromNow(-Math.floor(createdDaysAgo / 2), base),
  }
}

export function getTasnimSeed() {
  const tasks: Task[] = [
    // Fall 2025 – Semester 1
    task('t-t-01', 'Complete Full Stack Project Proposal', COURSES.cs301, 'high', 'completed', -30, 90, 'Submitted project scope and wireframes'),
    task('t-t-02', 'ER Diagram for Library System', COURSES.cs202, 'high', 'completed', -45, 100, '3NF normalization applied'),
    task('t-t-03', 'Midterm Exam Revision – Linear Algebra', COURSES.math205, 'high', 'completed', -60, 110),
    task('t-t-04', 'Physics Lab Report – Optics', COURSES.phys101, 'medium', 'completed', -50, 95, 'Include diagrams and error analysis'),
    task('t-t-05', 'Essay Draft – Modernism Themes', COURSES.eng202, 'medium', 'completed', -40, 85),
    task('t-t-06', 'Implement JWT Authentication', COURSES.cs301, 'high', 'completed', -20, 70),
    task('t-t-07', 'SQL Stored Procedures Practice', COURSES.cs202, 'medium', 'completed', -25, 75),
    task('t-t-08', 'BST Implementation Homework', COURSES.cs350, 'high', 'completed', -35, 80),
    // Spring 2026 – Current semester
    task('t-t-09', 'StudyFlow Dashboard UI Polish', COURSES.cs301, 'high', 'in_progress', 5, 14, 'Pastel theme, responsive layout'),
    task('t-t-10', 'Supabase RLS Policy Testing', COURSES.cs301, 'high', 'in_progress', 7, 12, 'Verify all tables have user_id policies'),
    task('t-t-11', 'Kanban Drag-and-Drop QA', COURSES.cs301, 'medium', 'in_progress', 4, 10),
    task('t-t-12', 'Chapter 9 – Eigenvalues Problem Set', COURSES.math205, 'high', 'todo', 3, 8),
    task('t-t-13', 'Wave Mechanics Problem Set 6', COURSES.phys101, 'medium', 'todo', 6, 7),
    task('t-t-14', 'Literature Presentation Slides', COURSES.eng202, 'medium', 'in_progress', 8, 9),
    task('t-t-15', 'UML Class Diagrams', COURSES.cs401, 'high', 'todo', 10, 6),
    task('t-t-16', 'Sprint Planning Document', COURSES.cs401, 'medium', 'todo', 12, 5),
    task('t-t-17', 'Index Optimization Lab', COURSES.cs202, 'low', 'todo', 14, 4),
    task('t-t-18', 'Read Design Patterns Ch. 3-4', COURSES.cs401, 'low', 'todo', 15, 3),
    task('t-t-19', 'Group Meeting Agenda', COURSES.cs401, 'medium', 'todo', 2, 2),
    task('t-t-20', 'Analytics Page Chart Review', COURSES.cs301, 'medium', 'completed', -2, 15),
    task('t-t-21', 'Notes Manager XSS Audit', COURSES.cs301, 'high', 'completed', -1, 11, 'DOMPurify sanitization verified'),
    task('t-t-22', 'Binary Tree Traversal Quiz Prep', COURSES.cs350, 'medium', 'in_progress', 9, 13),
    task('t-t-23', 'Business Case Study Summary', COURSES.bus210, 'low', 'todo', 18, 6),
    task('t-t-24', 'Weekly Study Schedule Update', COURSES.cs301, 'low', 'todo', 1, 1),
    task('t-t-25', 'Peer Code Review – API Layer', COURSES.cs301, 'high', 'todo', 4, 3),
    task('t-t-26', 'Database Backup Strategy Doc', COURSES.cs202, 'medium', 'in_progress', 11, 8),
    task('t-t-27', 'Final Project Milestone 1', COURSES.cs301, 'high', 'in_progress', 21, 20),
    task('t-t-28', 'Semester GPA Calculator Sheet', COURSES.bus210, 'low', 'completed', -5, 30),
    task('t-t-29', 'Mock Interview Practice', COURSES.cs401, 'medium', 'todo', 20, 4),
    task('t-t-30', 'Capstone Literature Review', COURSES.cs401, 'high', 'todo', 25, 10),
  ]

  const assignments: Assignment[] = [
    { id: 't-a-01', user_id: USER_ID, course: COURSES.cs301, title: 'Full Stack Web Application', due_date: daysFromNow(21, base), status: 'in_progress', marks: null, created_at: daysFromNow(-60, base) },
    { id: 't-a-02', user_id: USER_ID, course: COURSES.cs202, title: 'Database Design Project', due_date: daysFromNow(14, base), status: 'in_progress', marks: null, created_at: daysFromNow(-45, base) },
    { id: 't-a-03', user_id: USER_ID, course: COURSES.math205, title: 'Problem Set 7', due_date: daysFromNow(5, base), status: 'in_progress', marks: null, created_at: daysFromNow(-20, base) },
    { id: 't-a-04', user_id: USER_ID, course: COURSES.phys101, title: 'Lab Report 4 – Waves', due_date: daysFromNow(3, base), status: 'not_started', marks: null, created_at: daysFromNow(-15, base) },
    { id: 't-a-05', user_id: USER_ID, course: COURSES.eng202, title: 'Essay: Modernism in the 20th Century', due_date: daysFromNow(10, base), status: 'in_progress', marks: null, created_at: daysFromNow(-30, base) },
    { id: 't-a-06', user_id: USER_ID, course: COURSES.cs401, title: 'Software Requirements Specification', due_date: daysFromNow(18, base), status: 'not_started', marks: null, created_at: daysFromNow(-25, base) },
    { id: 't-a-07', user_id: USER_ID, course: COURSES.cs350, title: 'Graph Algorithms Assignment', due_date: daysFromNow(-10, base), status: 'graded', marks: 92, created_at: daysFromNow(-50, base) },
    { id: 't-a-08', user_id: USER_ID, course: COURSES.cs301, title: 'Midterm Project Demo', due_date: daysFromNow(-35, base), status: 'graded', marks: 88, created_at: daysFromNow(-70, base) },
    { id: 't-a-09', user_id: USER_ID, course: COURSES.cs202, title: 'SQL Query Optimization Lab', due_date: daysFromNow(-20, base), status: 'graded', marks: 95, created_at: daysFromNow(-40, base) },
    { id: 't-a-10', user_id: USER_ID, course: COURSES.math205, title: 'Midterm Examination', due_date: daysFromNow(-55, base), status: 'graded', marks: 84, created_at: daysFromNow(-80, base) },
    { id: 't-a-11', user_id: USER_ID, course: COURSES.bus210, title: 'Market Analysis Report', due_date: daysFromNow(16, base), status: 'not_started', marks: null, created_at: daysFromNow(-10, base) },
    { id: 't-a-12', user_id: USER_ID, course: COURSES.phys101, title: 'Final Exam Preparation Portfolio', due_date: daysFromNow(28, base), status: 'not_started', marks: null, created_at: daysFromNow(-5, base) },
  ]

  const notes: Note[] = [
    { id: 't-n-01', user_id: USER_ID, title: 'React Hooks Cheat Sheet', content: '<p><strong>useState</strong> – local state<br><strong>useEffect</strong> – side effects<br><strong>useContext</strong> – shared state<br><strong>useMemo</strong> – memoization</p>', tags: ['react', 'cs301', 'exam'], created_at: daysFromNow(-30, base), updated_at: daysFromNow(-5, base) },
    { id: 't-n-02', user_id: USER_ID, title: 'SQL Joins & Normalization', content: '<ul><li>INNER JOIN – matching rows</li><li>LEFT JOIN – all left rows</li><li>3NF – no transitive dependencies</li></ul>', tags: ['database', 'cs202'], created_at: daysFromNow(-45, base), updated_at: daysFromNow(-10, base) },
    { id: 't-n-03', user_id: USER_ID, title: 'Linear Algebra Formula Sheet', content: '<ol><li>det(A) for 2x2: ad - bc</li><li>Eigenvalue: Av = λv</li><li>Rank-nullity theorem</li></ol>', tags: ['math205', 'exam'], created_at: daysFromNow(-20, base), updated_at: daysFromNow(-3, base) },
    { id: 't-n-04', user_id: USER_ID, title: 'Physics Wave Equations', content: '<p>v = fλ<br>E = hf<br>Snell\'s law: n₁sinθ₁ = n₂sinθ₂</p>', tags: ['phys101'], created_at: daysFromNow(-25, base), updated_at: daysFromNow(-8, base) },
    { id: 't-n-05', user_id: USER_ID, title: 'StudyFlow Architecture Notes', content: '<ul><li>React + Vite frontend</li><li>Supabase auth + PostgreSQL</li><li>RLS per user_id</li><li>TanStack Query for data</li></ul>', tags: ['cs301', 'project'], created_at: daysFromNow(-14, base), updated_at: daysFromNow(-1, base) },
    { id: 't-n-06', user_id: USER_ID, title: 'UML Diagram Symbols', content: '<p>Class, Interface, Association, Aggregation, Composition</p>', tags: ['cs401'], created_at: daysFromNow(-12, base), updated_at: daysFromNow(-2, base) },
    { id: 't-n-07', user_id: USER_ID, title: 'Modernism Reading List', content: '<ol><li>Virginia Woolf – Mrs Dalloway</li><li>James Joyce – Ulysses (excerpts)</li><li>T.S. Eliot – The Waste Land</li></ol>', tags: ['eng202', 'literature'], created_at: daysFromNow(-35, base), updated_at: daysFromNow(-15, base) },
    { id: 't-n-08', user_id: USER_ID, title: 'BST & AVL Tree Summary', content: '<p>Insertion, deletion, rotations for AVL balance factor</p>', tags: ['cs350', 'exam'], created_at: daysFromNow(-18, base), updated_at: daysFromNow(-4, base) },
    { id: 't-n-09', user_id: USER_ID, title: 'Sprint Retrospective Template', content: '<ul><li>What went well</li><li>What to improve</li><li>Action items</li></ul>', tags: ['cs401', 'agile'], created_at: daysFromNow(-8, base), updated_at: daysFromNow(-1, base) },
    { id: 't-n-10', user_id: USER_ID, title: 'Business Analytics KPIs', content: '<p>ROI, CAC, LTV, Churn rate definitions and formulas</p>', tags: ['bus210'], created_at: daysFromNow(-6, base), updated_at: daysFromNow(-2, base) },
  ]

  const studySessions: StudySession[] = [
    { id: 't-s-01', user_id: USER_ID, subject: COURSES.cs301, ...sessionTime(1, 14, 3, base), goal: 'Dashboard components', created_at: daysFromNow(-1, base) },
    { id: 't-s-02', user_id: USER_ID, subject: COURSES.cs301, ...sessionTime(2, 10, 2, base), goal: 'Auth flow testing', created_at: daysFromNow(-2, base) },
    { id: 't-s-03', user_id: USER_ID, subject: COURSES.math205, ...sessionTime(3, 9, 2, base), goal: 'Eigenvalues practice', created_at: daysFromNow(-3, base) },
    { id: 't-s-04', user_id: USER_ID, subject: COURSES.cs202, ...sessionTime(4, 15, 2.5, base), goal: 'SQL optimization', created_at: daysFromNow(-4, base) },
    { id: 't-s-05', user_id: USER_ID, subject: COURSES.phys101, ...sessionTime(5, 11, 1.5, base), goal: 'Wave problems', created_at: daysFromNow(-5, base) },
    { id: 't-s-06', user_id: USER_ID, subject: COURSES.cs350, ...sessionTime(7, 16, 3, base), goal: 'Graph algorithms', created_at: daysFromNow(-7, base) },
    { id: 't-s-07', user_id: USER_ID, subject: COURSES.eng202, ...sessionTime(8, 13, 2, base), goal: 'Essay research', created_at: daysFromNow(-8, base) },
    { id: 't-s-08', user_id: USER_ID, subject: COURSES.cs401, ...sessionTime(10, 10, 2, base), goal: 'SRS document', created_at: daysFromNow(-10, base) },
    { id: 't-s-09', user_id: USER_ID, subject: COURSES.cs301, ...sessionTime(14, 14, 4, base), goal: 'Full stack integration', created_at: daysFromNow(-14, base) },
    { id: 't-s-10', user_id: USER_ID, subject: COURSES.math205, ...sessionTime(21, 9, 2, base), goal: 'Midterm revision', created_at: daysFromNow(-21, base) },
    { id: 't-s-11', user_id: USER_ID, subject: COURSES.cs202, ...sessionTime(30, 15, 2, base), goal: 'ER diagram design', created_at: daysFromNow(-30, base) },
    { id: 't-s-12', user_id: USER_ID, subject: COURSES.bus210, ...sessionTime(12, 11, 1.5, base), goal: 'Case study analysis', created_at: daysFromNow(-12, base) },
    { id: 't-s-13', user_id: USER_ID, subject: COURSES.cs301, ...sessionTime(0, 19, 2, base), goal: 'Search feature fix', created_at: daysFromNow(0, base) },
    { id: 't-s-14', user_id: USER_ID, subject: COURSES.phys101, ...sessionTime(35, 10, 2, base), goal: 'Fall semester review', created_at: daysFromNow(-35, base) },
    { id: 't-s-15', user_id: USER_ID, subject: COURSES.cs401, ...sessionTime(45, 14, 3, base), goal: 'Design patterns reading', created_at: daysFromNow(-45, base) },
  ]

  const goals: Goal[] = [
    { id: 't-g-01', user_id: USER_ID, goal_name: 'Complete StudyFlow Full Stack Project', target_date: '2026-06-30', progress: 72, created_at: daysFromNow(-60, base) },
    { id: 't-g-02', user_id: USER_ID, goal_name: 'Study 4 Hours Daily', target_date: '2026-06-15', progress: 55, created_at: daysFromNow(-30, base) },
    { id: 't-g-03', user_id: USER_ID, goal_name: 'Achieve 3.8+ GPA This Semester', target_date: '2026-07-01', progress: 40, created_at: daysFromNow(-90, base) },
    { id: 't-g-04', user_id: USER_ID, goal_name: 'Finish CS401 Capstone Proposal', target_date: '2026-06-20', progress: 30, created_at: daysFromNow(-20, base) },
    { id: 't-g-05', user_id: USER_ID, goal_name: 'Complete 50 LeetCode Problems', target_date: '2026-08-01', progress: 64, created_at: daysFromNow(-45, base) },
    { id: 't-g-06', user_id: USER_ID, goal_name: 'Read 6 Books for ENG202', target_date: '2026-05-30', progress: 83, created_at: daysFromNow(-80, base) },
    { id: 't-g-07', user_id: USER_ID, goal_name: 'Internship Application Sprint', target_date: '2026-06-10', progress: 25, created_at: daysFromNow(-15, base) },
    { id: 't-g-08', user_id: USER_ID, goal_name: 'Master Supabase & RLS', target_date: '2026-06-25', progress: 90, created_at: daysFromNow(-25, base) },
  ]

  const today = base.getDay()
  const classes: ClassSchedule[] = [
    { id: 't-c-01', user_id: USER_ID, class_name: 'Web Development Lecture', course: 'CS301', day_of_week: today, start_time: '09:00', end_time: '10:30' },
    { id: 't-c-02', user_id: USER_ID, class_name: 'Linear Algebra Tutorial', course: 'MATH205', day_of_week: today, start_time: '11:00', end_time: '12:00' },
    { id: 't-c-03', user_id: USER_ID, class_name: 'Software Engineering Lab', course: 'CS401', day_of_week: today, start_time: '14:00', end_time: '16:00' },
    { id: 't-c-04', user_id: USER_ID, class_name: 'Database Systems', course: 'CS202', day_of_week: (today + 1) % 7, start_time: '10:00', end_time: '11:30' },
    { id: 't-c-05', user_id: USER_ID, class_name: 'Physics Lab', course: 'PHYS101', day_of_week: (today + 2) % 7, start_time: '13:00', end_time: '15:00' },
    { id: 't-c-06', user_id: USER_ID, class_name: 'Data Structures', course: 'CS350', day_of_week: (today + 3) % 7, start_time: '09:30', end_time: '11:00' },
    { id: 't-c-07', user_id: USER_ID, class_name: 'Modern Literature Seminar', course: 'ENG202', day_of_week: (today + 4) % 7, start_time: '15:00', end_time: '16:30' },
    { id: 't-c-08', user_id: USER_ID, class_name: 'Business Analytics', course: 'BUS210', day_of_week: (today + 5) % 7, start_time: '11:00', end_time: '12:30' },
  ]

  return { tasks, assignments, notes, studySessions, goals, classes }
}
