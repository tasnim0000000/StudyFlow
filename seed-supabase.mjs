/**
 * StudyFlow — Supabase Seed Script (fixed UUID generation)
 *
 * USAGE
 * -----
 * 1. npm install @supabase/supabase-js   (in your studyflow folder)
 * 2. Fill in SUPABASE_URL and SERVICE_ROLE_KEY below
 * 3. node seed-supabase.mjs
 *
 * Safe to re-run — uses upsert so nothing duplicates.
 */

import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

// ─── CONFIGURE THESE ──────────────────────────────────────────────────────────
const SUPABASE_URL     = 'https://btrfqttaalsmjqxwwsvi.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cmZxdHRhYWxzbWpxeHd3c3ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk0MjMwMywiZXhwIjoyMDk2NTE4MzAzfQ.d0FTLgC8WPbjsSA5sEXtGlfUccs5cuuUrf7kPdLu1m0'
// ─────────────────────────────────────────────────────────────────────────────

if (SUPABASE_URL.includes('YOUR_PROJECT') || SERVICE_ROLE_KEY.includes('YOUR_SERVICE')) {
  console.error('\n❌  Fill in SUPABASE_URL and SERVICE_ROLE_KEY at the top of this file.\n')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Returns an ISO string offset by `days` from today */
function d(days) {
  const dt = new Date()
  dt.setDate(dt.getDate() + days)
  return dt.toISOString()
}

/** Returns start_time / end_time for a study session */
function session(daysAgo, startHour, durationHrs) {
  const start = new Date()
  start.setDate(start.getDate() - daysAgo)
  start.setHours(startHour, 0, 0, 0)
  const end = new Date(start.getTime() + durationHrs * 3_600_000)
  return { start_time: start.toISOString(), end_time: end.toISOString() }
}

/** Create (or find) an auth user; returns the user's UUID */
async function createUser(email, password, name) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  })
  if (error) {
    if (!error.message.includes('already been registered')) throw error
    // User exists — look them up
    const { data: list } = await supabase.auth.admin.listUsers({ perPage: 200 })
    const found = list.users.find(u => u.email === email)
    if (!found) throw new Error(`Could not find existing user ${email}`)
    return found.id
  }
  return data.user.id
}

/** Upsert rows into a table (conflict on id) */
async function upsert(table, rows) {
  if (!rows.length) return
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' })
  if (error) throw new Error(`${table}: ${error.message}`)
  console.log(`    ✓ ${table.padEnd(18)} ${rows.length} rows`)
}

// ─── PER-USER SEED DATA ───────────────────────────────────────────────────────

function tasnimData(uid) {
  const today = new Date().getDay()
  return {
    tasks: [
      // Completed — Fall 2025
      { id: randomUUID(), user_id: uid, title: 'Full Stack Project Proposal',         course: 'CS301 Web Development',       priority: 'high',   status: 'completed',   deadline: d(-30), description: 'Submitted scope and wireframes',       created_at: d(-90),  updated_at: d(-30) },
      { id: randomUUID(), user_id: uid, title: 'ER Diagram for Library System',       course: 'CS202 Database Systems',      priority: 'high',   status: 'completed',   deadline: d(-45), description: '3NF normalization applied',             created_at: d(-100), updated_at: d(-45) },
      { id: randomUUID(), user_id: uid, title: 'Midterm Revision – Linear Algebra',   course: 'MATH205 Linear Algebra',      priority: 'high',   status: 'completed',   deadline: d(-60), description: null,                                   created_at: d(-110), updated_at: d(-60) },
      { id: randomUUID(), user_id: uid, title: 'Physics Lab Report – Optics',         course: 'PHYS101 Physics',             priority: 'medium', status: 'completed',   deadline: d(-50), description: 'Diagrams and error analysis included',  created_at: d(-95),  updated_at: d(-50) },
      { id: randomUUID(), user_id: uid, title: 'Essay Draft – Modernism Themes',      course: 'ENG202 Modern Literature',    priority: 'medium', status: 'completed',   deadline: d(-40), description: null,                                   created_at: d(-85),  updated_at: d(-40) },
      { id: randomUUID(), user_id: uid, title: 'Implement JWT Authentication',        course: 'CS301 Web Development',       priority: 'high',   status: 'completed',   deadline: d(-20), description: null,                                   created_at: d(-70),  updated_at: d(-20) },
      { id: randomUUID(), user_id: uid, title: 'SQL Stored Procedures Practice',      course: 'CS202 Database Systems',      priority: 'medium', status: 'completed',   deadline: d(-25), description: null,                                   created_at: d(-75),  updated_at: d(-25) },
      { id: randomUUID(), user_id: uid, title: 'BST Implementation Homework',         course: 'CS350 Data Structures',       priority: 'high',   status: 'completed',   deadline: d(-35), description: null,                                   created_at: d(-80),  updated_at: d(-35) },
      { id: randomUUID(), user_id: uid, title: 'Analytics Page Chart Review',         course: 'CS301 Web Development',       priority: 'medium', status: 'completed',   deadline: d(-2),  description: null,                                   created_at: d(-15),  updated_at: d(-2)  },
      { id: randomUUID(), user_id: uid, title: 'Notes Manager XSS Audit',             course: 'CS301 Web Development',       priority: 'high',   status: 'completed',   deadline: d(-1),  description: 'DOMPurify sanitization verified',       created_at: d(-11),  updated_at: d(-1)  },
      { id: randomUUID(), user_id: uid, title: 'Semester GPA Calculator Sheet',       course: 'BUS210 Business Analytics',   priority: 'low',    status: 'completed',   deadline: d(-5),  description: null,                                   created_at: d(-30),  updated_at: d(-5)  },
      // In Progress — Spring 2026
      { id: randomUUID(), user_id: uid, title: 'StudyFlow Dashboard UI Polish',       course: 'CS301 Web Development',       priority: 'high',   status: 'in_progress', deadline: d(5),   description: 'Pastel theme, responsive layout',       created_at: d(-14),  updated_at: d(-1)  },
      { id: randomUUID(), user_id: uid, title: 'Supabase RLS Policy Testing',         course: 'CS301 Web Development',       priority: 'high',   status: 'in_progress', deadline: d(7),   description: 'Verify all tables have user_id policies', created_at: d(-12), updated_at: d(-1)  },
      { id: randomUUID(), user_id: uid, title: 'Kanban Drag-and-Drop QA',             course: 'CS301 Web Development',       priority: 'medium', status: 'in_progress', deadline: d(4),   description: null,                                   created_at: d(-10),  updated_at: d(-2)  },
      { id: randomUUID(), user_id: uid, title: 'Literature Presentation Slides',      course: 'ENG202 Modern Literature',    priority: 'medium', status: 'in_progress', deadline: d(8),   description: null,                                   created_at: d(-9),   updated_at: d(-2)  },
      { id: randomUUID(), user_id: uid, title: 'Binary Tree Traversal Quiz Prep',     course: 'CS350 Data Structures',       priority: 'medium', status: 'in_progress', deadline: d(9),   description: null,                                   created_at: d(-13),  updated_at: d(-3)  },
      { id: randomUUID(), user_id: uid, title: 'Database Backup Strategy Doc',        course: 'CS202 Database Systems',      priority: 'medium', status: 'in_progress', deadline: d(11),  description: null,                                   created_at: d(-8),   updated_at: d(-2)  },
      { id: randomUUID(), user_id: uid, title: 'Final Project Milestone 1',           course: 'CS301 Web Development',       priority: 'high',   status: 'in_progress', deadline: d(21),  description: null,                                   created_at: d(-20),  updated_at: d(-3)  },
      // Todo
      { id: randomUUID(), user_id: uid, title: 'Chapter 9 – Eigenvalues Problem Set', course: 'MATH205 Linear Algebra',     priority: 'high',   status: 'todo',        deadline: d(3),   description: null,                                   created_at: d(-8),   updated_at: d(-8)  },
      { id: randomUUID(), user_id: uid, title: 'Wave Mechanics Problem Set 6',        course: 'PHYS101 Physics',             priority: 'medium', status: 'todo',        deadline: d(6),   description: null,                                   created_at: d(-7),   updated_at: d(-7)  },
      { id: randomUUID(), user_id: uid, title: 'UML Class Diagrams',                  course: 'CS401 Software Engineering',  priority: 'high',   status: 'todo',        deadline: d(10),  description: null,                                   created_at: d(-6),   updated_at: d(-6)  },
      { id: randomUUID(), user_id: uid, title: 'Sprint Planning Document',            course: 'CS401 Software Engineering',  priority: 'medium', status: 'todo',        deadline: d(12),  description: null,                                   created_at: d(-5),   updated_at: d(-5)  },
      { id: randomUUID(), user_id: uid, title: 'Index Optimization Lab',              course: 'CS202 Database Systems',      priority: 'low',    status: 'todo',        deadline: d(14),  description: null,                                   created_at: d(-4),   updated_at: d(-4)  },
      { id: randomUUID(), user_id: uid, title: 'Read Design Patterns Ch. 3–4',       course: 'CS401 Software Engineering',  priority: 'low',    status: 'todo',        deadline: d(15),  description: null,                                   created_at: d(-3),   updated_at: d(-3)  },
      { id: randomUUID(), user_id: uid, title: 'Group Meeting Agenda',                course: 'CS401 Software Engineering',  priority: 'medium', status: 'todo',        deadline: d(2),   description: null,                                   created_at: d(-2),   updated_at: d(-2)  },
      { id: randomUUID(), user_id: uid, title: 'Business Case Study Summary',         course: 'BUS210 Business Analytics',   priority: 'low',    status: 'todo',        deadline: d(18),  description: null,                                   created_at: d(-6),   updated_at: d(-6)  },
      { id: randomUUID(), user_id: uid, title: 'Weekly Study Schedule Update',        course: 'CS301 Web Development',       priority: 'low',    status: 'todo',        deadline: d(1),   description: null,                                   created_at: d(-1),   updated_at: d(-1)  },
      { id: randomUUID(), user_id: uid, title: 'Peer Code Review – API Layer',        course: 'CS301 Web Development',       priority: 'high',   status: 'todo',        deadline: d(4),   description: null,                                   created_at: d(-3),   updated_at: d(-3)  },
      { id: randomUUID(), user_id: uid, title: 'Mock Interview Practice',             course: 'CS401 Software Engineering',  priority: 'medium', status: 'todo',        deadline: d(20),  description: null,                                   created_at: d(-4),   updated_at: d(-4)  },
      { id: randomUUID(), user_id: uid, title: 'Capstone Literature Review',          course: 'CS401 Software Engineering',  priority: 'high',   status: 'todo',        deadline: d(25),  description: null,                                   created_at: d(-10),  updated_at: d(-10) },
    ],
    assignments: [
      { id: randomUUID(), user_id: uid, course: 'CS301 Web Development',      title: 'Full Stack Web Application',           due_date: d(21),  status: 'in_progress', marks: null, created_at: d(-60) },
      { id: randomUUID(), user_id: uid, course: 'CS202 Database Systems',     title: 'Database Design Project',              due_date: d(14),  status: 'in_progress', marks: null, created_at: d(-45) },
      { id: randomUUID(), user_id: uid, course: 'MATH205 Linear Algebra',     title: 'Problem Set 7',                        due_date: d(5),   status: 'in_progress', marks: null, created_at: d(-20) },
      { id: randomUUID(), user_id: uid, course: 'PHYS101 Physics',            title: 'Lab Report 4 – Waves',                due_date: d(3),   status: 'not_started', marks: null, created_at: d(-15) },
      { id: randomUUID(), user_id: uid, course: 'ENG202 Modern Literature',   title: 'Essay: Modernism in the 20th Century', due_date: d(10),  status: 'in_progress', marks: null, created_at: d(-30) },
      { id: randomUUID(), user_id: uid, course: 'CS401 Software Engineering', title: 'Software Requirements Specification',  due_date: d(18),  status: 'not_started', marks: null, created_at: d(-25) },
      { id: randomUUID(), user_id: uid, course: 'CS350 Data Structures',      title: 'Graph Algorithms Assignment',          due_date: d(-10), status: 'graded',      marks: 92,   created_at: d(-50) },
      { id: randomUUID(), user_id: uid, course: 'CS301 Web Development',      title: 'Midterm Project Demo',                 due_date: d(-35), status: 'graded',      marks: 88,   created_at: d(-70) },
      { id: randomUUID(), user_id: uid, course: 'CS202 Database Systems',     title: 'SQL Query Optimization Lab',           due_date: d(-20), status: 'graded',      marks: 95,   created_at: d(-40) },
      { id: randomUUID(), user_id: uid, course: 'MATH205 Linear Algebra',     title: 'Midterm Examination',                  due_date: d(-55), status: 'graded',      marks: 84,   created_at: d(-80) },
      { id: randomUUID(), user_id: uid, course: 'BUS210 Business Analytics',  title: 'Market Analysis Report',               due_date: d(16),  status: 'not_started', marks: null, created_at: d(-10) },
      { id: randomUUID(), user_id: uid, course: 'PHYS101 Physics',            title: 'Final Exam Preparation Portfolio',     due_date: d(28),  status: 'not_started', marks: null, created_at: d(-5)  },
    ],
    notes: [
      { id: randomUUID(), user_id: uid, title: 'React Hooks Cheat Sheet',        content: '<h3>Core Hooks</h3><ul><li><strong>useState</strong> – local component state</li><li><strong>useEffect</strong> – side effects &amp; subscriptions</li><li><strong>useContext</strong> – consume shared state</li><li><strong>useMemo</strong> – memoize expensive computations</li><li><strong>useCallback</strong> – stable function references</li></ul>', tags: ['react','cs301','exam'],        created_at: d(-30), updated_at: d(-5)  },
      { id: randomUUID(), user_id: uid, title: 'SQL Joins & Normalization',       content: '<h3>Joins</h3><ul><li>INNER JOIN – only matching rows</li><li>LEFT JOIN – all left + matching right</li><li>FULL OUTER – all rows from both sides</li></ul><h3>Normal Forms</h3><ul><li>1NF – atomic values</li><li>2NF – no partial dependency</li><li>3NF – no transitive dependency</li></ul>', tags: ['database','cs202'],            created_at: d(-45), updated_at: d(-10) },
      { id: randomUUID(), user_id: uid, title: 'Linear Algebra Formula Sheet',    content: '<p><strong>Determinant 2×2:</strong> ad − bc</p><p><strong>Eigenvalues:</strong> det(A − λI) = 0</p><p><strong>Rank-Nullity:</strong> rank(A) + nullity(A) = n</p>',                                                                                                                               tags: ['math205','exam'],              created_at: d(-20), updated_at: d(-3)  },
      { id: randomUUID(), user_id: uid, title: 'Physics Wave Equations',          content: '<p><strong>v = fλ</strong> (wave speed)<br><strong>E = hf</strong> (photon energy)<br><strong>Snell\'s Law:</strong> n₁sinθ₁ = n₂sinθ₂<br><strong>Standing waves:</strong> fₙ = nv/2L</p>',                                                                                                        tags: ['phys101'],                     created_at: d(-25), updated_at: d(-8)  },
      { id: randomUUID(), user_id: uid, title: 'StudyFlow Architecture Notes',    content: '<h3>Stack</h3><ul><li>React + Vite (frontend)</li><li>Supabase – auth + PostgreSQL</li><li>TanStack Query – server state</li><li>Tailwind CSS – styling</li><li>Framer Motion – animations</li></ul><h3>Key decision</h3><p>JWT in Supabase session → RLS policies enforce per-user isolation.</p>', tags: ['cs301','project','supabase'],  created_at: d(-14), updated_at: d(-1)  },
      { id: randomUUID(), user_id: uid, title: 'UML Diagram Symbols',             content: '<ul><li>Class – attributes + methods box</li><li>Interface – dashed stereotype box</li><li>Association – solid line</li><li>Aggregation – hollow diamond</li><li>Composition – filled diamond</li><li>Inheritance – hollow arrowhead</li></ul>',                                                    tags: ['cs401'],                       created_at: d(-12), updated_at: d(-2)  },
      { id: randomUUID(), user_id: uid, title: 'Modernism Reading List',          content: '<ol><li>Virginia Woolf – <em>Mrs Dalloway</em></li><li>James Joyce – <em>Ulysses</em> (excerpts)</li><li>T.S. Eliot – <em>The Waste Land</em></li><li>Franz Kafka – <em>The Metamorphosis</em></li><li>William Faulkner – <em>The Sound and the Fury</em></li></ol>',                             tags: ['eng202','literature'],         created_at: d(-35), updated_at: d(-15) },
      { id: randomUUID(), user_id: uid, title: 'BST & AVL Tree Summary',         content: '<h3>BST</h3><p>Left child &lt; root &lt; right child. O(log n) on balanced trees.</p><h3>AVL Rotations</h3><ul><li>LL – right rotation</li><li>RR – left rotation</li><li>LR – left then right</li><li>RL – right then left</li></ul><p>Balance factor = height(L) − height(R). Must be −1, 0, 1.</p>', tags: ['cs350','exam'],               created_at: d(-18), updated_at: d(-4)  },
      { id: randomUUID(), user_id: uid, title: 'Sprint Retrospective Template',   content: '<ol><li><strong>What went well</strong> – celebrate wins</li><li><strong>What to improve</strong> – bottlenecks and blockers</li><li><strong>Action items</strong> – concrete next steps with owners</li></ol>',                                                                                     tags: ['cs401','agile'],               created_at: d(-8),  updated_at: d(-1)  },
      { id: randomUUID(), user_id: uid, title: 'Business Analytics KPIs',         content: '<ul><li><strong>ROI</strong> = (Net Profit / Cost) × 100</li><li><strong>CAC</strong> = Marketing Spend / New Customers</li><li><strong>LTV</strong> = Avg Revenue × Avg Lifetime</li><li><strong>Churn Rate</strong> = Lost Customers / Total × 100</li></ul>',                                  tags: ['bus210'],                      created_at: d(-6),  updated_at: d(-2)  },
      { id: randomUUID(), user_id: uid, title: 'Graph Algorithms Cheat Sheet',    content: '<ul><li><strong>BFS</strong> – shortest path (unweighted), uses queue</li><li><strong>DFS</strong> – cycle detection, topological sort, uses stack</li><li><strong>Dijkstra</strong> – shortest path (weighted, non-negative)</li><li><strong>Bellman-Ford</strong> – handles negative weights</li></ul>', tags: ['cs350','algorithms'],         created_at: d(-22), updated_at: d(-7)  },
      { id: randomUUID(), user_id: uid, title: 'Supabase RLS Policy Notes',       content: '<h3>Row Level Security</h3><p>Enable: <code>alter table tasks enable row level security;</code></p><p>Policy: <code>using (auth.uid() = user_id)</code></p><p><strong>⚠ Service role bypasses RLS</strong> — never expose in frontend!</p>',                                                       tags: ['cs301','supabase','db'],       created_at: d(-3),  updated_at: d(-1)  },
    ],
    studySessions: [
      { id: randomUUID(), user_id: uid, subject: 'CS301 Web Development',      ...session(1,  14, 3),   goal: 'Dashboard components',      created_at: d(-1)  },
      { id: randomUUID(), user_id: uid, subject: 'CS301 Web Development',      ...session(2,  10, 2),   goal: 'Auth flow testing',         created_at: d(-2)  },
      { id: randomUUID(), user_id: uid, subject: 'MATH205 Linear Algebra',     ...session(3,  9,  2),   goal: 'Eigenvalues practice',      created_at: d(-3)  },
      { id: randomUUID(), user_id: uid, subject: 'CS202 Database Systems',     ...session(4,  15, 2.5), goal: 'SQL optimization',          created_at: d(-4)  },
      { id: randomUUID(), user_id: uid, subject: 'PHYS101 Physics',            ...session(5,  11, 1.5), goal: 'Wave problems',             created_at: d(-5)  },
      { id: randomUUID(), user_id: uid, subject: 'CS350 Data Structures',      ...session(7,  16, 3),   goal: 'Graph algorithms',          created_at: d(-7)  },
      { id: randomUUID(), user_id: uid, subject: 'ENG202 Modern Literature',   ...session(8,  13, 2),   goal: 'Essay research',            created_at: d(-8)  },
      { id: randomUUID(), user_id: uid, subject: 'CS401 Software Engineering', ...session(10, 10, 2),   goal: 'SRS document',              created_at: d(-10) },
      { id: randomUUID(), user_id: uid, subject: 'CS301 Web Development',      ...session(14, 14, 4),   goal: 'Full stack integration',    created_at: d(-14) },
      { id: randomUUID(), user_id: uid, subject: 'MATH205 Linear Algebra',     ...session(21, 9,  2),   goal: 'Midterm revision',          created_at: d(-21) },
      { id: randomUUID(), user_id: uid, subject: 'CS202 Database Systems',     ...session(30, 15, 2),   goal: 'ER diagram design',         created_at: d(-30) },
      { id: randomUUID(), user_id: uid, subject: 'BUS210 Business Analytics',  ...session(12, 11, 1.5), goal: 'Case study analysis',       created_at: d(-12) },
      { id: randomUUID(), user_id: uid, subject: 'CS301 Web Development',      ...session(0,  19, 2),   goal: 'Search feature fix',        created_at: d(0)   },
      { id: randomUUID(), user_id: uid, subject: 'PHYS101 Physics',            ...session(35, 10, 2),   goal: 'Fall semester review',      created_at: d(-35) },
      { id: randomUUID(), user_id: uid, subject: 'CS401 Software Engineering', ...session(45, 14, 3),   goal: 'Design patterns reading',   created_at: d(-45) },
    ],
    goals: [
      { id: randomUUID(), user_id: uid, goal_name: 'Complete StudyFlow Full Stack Project', target_date: d(21),  progress: 72, created_at: d(-60) },
      { id: randomUUID(), user_id: uid, goal_name: 'Study 4 Hours Daily',                  target_date: d(6),   progress: 55, created_at: d(-30) },
      { id: randomUUID(), user_id: uid, goal_name: 'Achieve 3.8+ GPA This Semester',       target_date: d(22),  progress: 40, created_at: d(-90) },
      { id: randomUUID(), user_id: uid, goal_name: 'Finish CS401 Capstone Proposal',        target_date: d(11),  progress: 30, created_at: d(-20) },
      { id: randomUUID(), user_id: uid, goal_name: 'Complete 50 LeetCode Problems',         target_date: d(53),  progress: 64, created_at: d(-45) },
      { id: randomUUID(), user_id: uid, goal_name: 'Read 6 Books for ENG202',               target_date: d(-9),  progress: 83, created_at: d(-80) },
      { id: randomUUID(), user_id: uid, goal_name: 'Internship Application Sprint',          target_date: d(1),   progress: 25, created_at: d(-15) },
      { id: randomUUID(), user_id: uid, goal_name: 'Master Supabase & RLS',                 target_date: d(16),  progress: 90, created_at: d(-25) },
    ],
    classes: [
      { id: randomUUID(), user_id: uid, class_name: 'Web Development Lecture',   course: 'CS301',   day_of_week: today,            start_time: '09:00', end_time: '10:30' },
      { id: randomUUID(), user_id: uid, class_name: 'Linear Algebra Tutorial',   course: 'MATH205', day_of_week: today,            start_time: '11:00', end_time: '12:00' },
      { id: randomUUID(), user_id: uid, class_name: 'Software Engineering Lab',  course: 'CS401',   day_of_week: today,            start_time: '14:00', end_time: '16:00' },
      { id: randomUUID(), user_id: uid, class_name: 'Database Systems',          course: 'CS202',   day_of_week: (today + 1) % 7,  start_time: '10:00', end_time: '11:30' },
      { id: randomUUID(), user_id: uid, class_name: 'Physics Lab',               course: 'PHYS101', day_of_week: (today + 2) % 7,  start_time: '13:00', end_time: '15:00' },
      { id: randomUUID(), user_id: uid, class_name: 'Data Structures',           course: 'CS350',   day_of_week: (today + 3) % 7,  start_time: '09:30', end_time: '11:00' },
      { id: randomUUID(), user_id: uid, class_name: 'Modern Literature Seminar', course: 'ENG202',  day_of_week: (today + 4) % 7,  start_time: '15:00', end_time: '16:30' },
      { id: randomUUID(), user_id: uid, class_name: 'Business Analytics',        course: 'BUS210',  day_of_week: (today + 5) % 7,  start_time: '11:00', end_time: '12:30' },
    ],
  }
}

function alexData(uid) {
  const today = new Date().getDay()
  return {
    tasks: [
      { id: randomUUID(), user_id: uid, title: 'Implement REST API',            course: 'CS301 Web Development',    priority: 'high',   status: 'in_progress', deadline: d(3),  description: 'Build CRUD endpoints', created_at: d(-5),  updated_at: d(-1) },
      { id: randomUUID(), user_id: uid, title: 'Read Chapter 7',                course: 'MATH205 Linear Algebra',   priority: 'medium', status: 'todo',        deadline: d(5),  description: null,                   created_at: d(-3),  updated_at: d(-3) },
      { id: randomUUID(), user_id: uid, title: 'Lab Report Draft',              course: 'PHYS101 Physics',          priority: 'high',   status: 'todo',        deadline: d(1),  description: 'Wave interference',    created_at: d(-2),  updated_at: d(-2) },
      { id: randomUUID(), user_id: uid, title: 'Database Normalization Review', course: 'CS202 Database Systems',   priority: 'low',    status: 'completed',   deadline: d(7),  description: null,                   created_at: d(-10), updated_at: d(-1) },
      { id: randomUUID(), user_id: uid, title: 'Presentation Slides',           course: 'ENG202 Modern Literature', priority: 'medium', status: 'in_progress', deadline: d(4),  description: null,                   created_at: d(-4),  updated_at: d(-2) },
      { id: randomUUID(), user_id: uid, title: 'OS Process Scheduling Notes',   course: 'CS303 Operating Systems',  priority: 'medium', status: 'todo',        deadline: d(9),  description: null,                   created_at: d(-2),  updated_at: d(-2) },
      { id: randomUUID(), user_id: uid, title: 'Networking Assignment',         course: 'CS303 Operating Systems',  priority: 'high',   status: 'todo',        deadline: d(6),  description: null,                   created_at: d(-5),  updated_at: d(-5) },
    ],
    assignments: [
      { id: randomUUID(), user_id: uid, course: 'CS301 Web Development',    title: 'Full Stack Web Application', due_date: d(14), status: 'in_progress', marks: null, created_at: d(-20) },
      { id: randomUUID(), user_id: uid, course: 'ENG202 Modern Literature', title: 'Essay: Modernism',           due_date: d(7),  status: 'not_started', marks: null, created_at: d(-10) },
      { id: randomUUID(), user_id: uid, course: 'MATH205 Linear Algebra',   title: 'Problem Set 5',              due_date: d(2),  status: 'in_progress', marks: null, created_at: d(-7)  },
      { id: randomUUID(), user_id: uid, course: 'CS202 Database Systems',   title: 'Index Design Lab',           due_date: d(-5), status: 'graded',      marks: 87,   created_at: d(-25) },
    ],
    notes: [
      { id: randomUUID(), user_id: uid, title: 'React Hooks Cheat Sheet', content: '<ul><li>useState</li><li>useEffect</li><li>useContext</li></ul>', tags: ['react','cs301'], created_at: d(-6), updated_at: d(-2) },
      { id: randomUUID(), user_id: uid, title: 'SQL Joins Summary',       content: '<p>INNER, LEFT, RIGHT, FULL OUTER joins with examples</p>',      tags: ['cs202'],         created_at: d(-8), updated_at: d(-8) },
      { id: randomUUID(), user_id: uid, title: 'OS Process States',       content: '<ul><li>New → Ready → Running → Waiting → Terminated</li></ul>', tags: ['cs303'],         created_at: d(-4), updated_at: d(-1) },
    ],
    studySessions: [
      { id: randomUUID(), user_id: uid, subject: 'CS350 Data Structures', ...session(2, 9,  2),   goal: 'BST exercises',     created_at: d(-2) },
      { id: randomUUID(), user_id: uid, subject: 'CS301 Web Development', ...session(1, 14, 3),   goal: 'React components',  created_at: d(-1) },
      { id: randomUUID(), user_id: uid, subject: 'MATH205 Linear Algebra',...session(4, 10, 1.5), goal: 'Practice problems', created_at: d(-4) },
    ],
    goals: [
      { id: randomUUID(), user_id: uid, goal_name: 'Complete Java Project', target_date: d(21), progress: 65, created_at: d(-30) },
      { id: randomUUID(), user_id: uid, goal_name: 'Study 4 Hours Daily',   target_date: d(6),  progress: 40, created_at: d(-20) },
    ],
    classes: [
      { id: randomUUID(), user_id: uid, class_name: 'Web Dev Lecture', course: 'CS301',   day_of_week: today,          start_time: '09:00', end_time: '10:30' },
      { id: randomUUID(), user_id: uid, class_name: 'Linear Algebra',  course: 'MATH205', day_of_week: today,          start_time: '11:00', end_time: '12:00' },
      { id: randomUUID(), user_id: uid, class_name: 'OS Fundamentals', course: 'CS303',   day_of_week: (today+2) % 7,  start_time: '13:00', end_time: '14:30' },
    ],
  }
}

function mariaData(uid) {
  const today = new Date().getDay()
  return {
    tasks: [
      { id: randomUUID(), user_id: uid, title: 'Organic Chemistry Lab Prep',   course: 'CHEM201 Organic Chemistry',         priority: 'high',   status: 'in_progress', deadline: d(2),  description: null, created_at: d(-4),  updated_at: d(-1) },
      { id: randomUUID(), user_id: uid, title: 'Statistics Problem Set 4',     course: 'STAT210 Statistics',                priority: 'medium', status: 'todo',        deadline: d(6),  description: null, created_at: d(-3),  updated_at: d(-3) },
      { id: randomUUID(), user_id: uid, title: 'Psychology Research Summary',  course: 'PSY101 Intro to Psychology',         priority: 'low',    status: 'todo',        deadline: d(10), description: null, created_at: d(-5),  updated_at: d(-5) },
      { id: randomUUID(), user_id: uid, title: 'Biochemistry Problem Set',     course: 'CHEM201 Organic Chemistry',         priority: 'high',   status: 'completed',   deadline: d(-3), description: null, created_at: d(-12), updated_at: d(-3) },
      { id: randomUUID(), user_id: uid, title: 'Statistical Inference Report', course: 'STAT210 Statistics',                priority: 'medium', status: 'in_progress', deadline: d(8),  description: null, created_at: d(-7),  updated_at: d(-2) },
    ],
    assignments: [
      { id: randomUUID(), user_id: uid, course: 'CHEM201 Organic Chemistry', title: 'Lab Report – Synthesis',     due_date: d(5),   status: 'in_progress', marks: null, created_at: d(-15) },
      { id: randomUUID(), user_id: uid, course: 'STAT210 Statistics',        title: 'Hypothesis Testing Project', due_date: d(12),  status: 'not_started', marks: null, created_at: d(-8)  },
      { id: randomUUID(), user_id: uid, course: 'CHEM201 Organic Chemistry', title: 'Midterm Exam',               due_date: d(-20), status: 'graded',      marks: 79,   created_at: d(-40) },
    ],
    notes: [
      { id: randomUUID(), user_id: uid, title: 'Organic Reactions List',     content: '<ol><li>SN1 / SN2 substitution</li><li>E1 / E2 elimination</li><li>Grignard reaction</li><li>Aldol condensation</li></ol>', tags: ['chem201','exam'],  created_at: d(-10), updated_at: d(-2) },
      { id: randomUUID(), user_id: uid, title: 'Statistics Formulas',        content: '<p>z = (x − μ) / σ<br>t = (x̄ − μ) / (s / √n)<br>p-value &lt; 0.05 → reject H₀</p>',                                     tags: ['stat210','exam'],  created_at: d(-6),  updated_at: d(-1) },
      { id: randomUUID(), user_id: uid, title: 'Cognitive Psychology Notes', content: '<ul><li>Working memory – 7 ± 2 items</li><li>Encoding → Storage → Retrieval</li><li>Schema theory</li></ul>',              tags: ['psy101'],          created_at: d(-8),  updated_at: d(-3) },
    ],
    studySessions: [
      { id: randomUUID(), user_id: uid, subject: 'CHEM201 Organic Chemistry', ...session(1, 10, 2), goal: 'Reaction mechanisms', created_at: d(-1) },
      { id: randomUUID(), user_id: uid, subject: 'STAT210 Statistics',        ...session(3, 15, 2), goal: 'ANOVA problems',      created_at: d(-3) },
    ],
    goals: [
      { id: randomUUID(), user_id: uid, goal_name: "Maintain Dean's List",           target_date: d(22), progress: 70, created_at: d(-60) },
      { id: randomUUID(), user_id: uid, goal_name: 'Finish Chemistry Lab Notebook',  target_date: d(10), progress: 55, created_at: d(-25) },
    ],
    classes: [
      { id: randomUUID(), user_id: uid, class_name: 'Organic Chemistry Lab', course: 'CHEM201', day_of_week: today,          start_time: '13:00', end_time: '16:00' },
      { id: randomUUID(), user_id: uid, class_name: 'Statistics Lecture',    course: 'STAT210', day_of_week: (today+1) % 7,  start_time: '09:00', end_time: '10:30' },
    ],
  }
}

function jamesData(uid) {
  const today = new Date().getDay()
  return {
    tasks: [
      { id: randomUUID(), user_id: uid, title: 'Mechanics Problem Set 8', course: 'MECH301 Mechanical Design', priority: 'high',   status: 'in_progress', deadline: d(4),  description: null, created_at: d(-6),  updated_at: d(-2) },
      { id: randomUUID(), user_id: uid, title: 'CAD Model Submission',    course: 'MECH301 Mechanical Design', priority: 'high',   status: 'todo',        deadline: d(8),  description: null, created_at: d(-3),  updated_at: d(-3) },
      { id: randomUUID(), user_id: uid, title: 'Fluid Dynamics Reading',  course: 'MECH401 Thermodynamics',   priority: 'medium', status: 'todo',        deadline: d(12), description: null, created_at: d(-2),  updated_at: d(-2) },
      { id: randomUUID(), user_id: uid, title: 'Stress Analysis Lab',     course: 'MECH301 Mechanical Design', priority: 'medium', status: 'completed',   deadline: d(-4), description: null, created_at: d(-15), updated_at: d(-4) },
    ],
    assignments: [
      { id: randomUUID(), user_id: uid, course: 'MECH301 Mechanical Design', title: 'Thermodynamics Final Project', due_date: d(20), status: 'in_progress', marks: null, created_at: d(-25) },
      { id: randomUUID(), user_id: uid, course: 'MECH401 Thermodynamics',    title: 'Heat Transfer Report',        due_date: d(10), status: 'not_started', marks: null, created_at: d(-10) },
    ],
    notes: [
      { id: randomUUID(), user_id: uid, title: 'Thermodynamics Laws',      content: '<ul><li>Zeroth – thermal equilibrium</li><li>First – energy conservation</li><li>Second – entropy increases</li><li>Third – 0 K absolute zero</li></ul>', tags: ['mech401'],         created_at: d(-12), updated_at: d(-4) },
      { id: randomUUID(), user_id: uid, title: 'Stress & Strain Formulas', content: '<p>σ = F/A (normal stress)<br>τ = F/A (shear stress)<br>ε = ΔL/L (strain)<br>E = σ/ε (Young\'s modulus)</p>',                                           tags: ['mech301','exam'],  created_at: d(-9),  updated_at: d(-2) },
    ],
    studySessions: [
      { id: randomUUID(), user_id: uid, subject: 'MECH301 Mechanical Design', ...session(3, 15, 2),   goal: 'CAD practice',         created_at: d(-3) },
      { id: randomUUID(), user_id: uid, subject: 'MECH401 Thermodynamics',    ...session(6, 10, 1.5), goal: 'Carnot cycle problems', created_at: d(-6) },
    ],
    goals: [
      { id: randomUUID(), user_id: uid, goal_name: 'Complete Co-op Application', target_date: d(9),  progress: 50, created_at: d(-20) },
      { id: randomUUID(), user_id: uid, goal_name: 'Pass PE Exam Prelim',        target_date: d(30), progress: 20, created_at: d(-10) },
    ],
    classes: [
      { id: randomUUID(), user_id: uid, class_name: 'Mechanical Design Studio', course: 'MECH301', day_of_week: (today+1) % 7, start_time: '10:00', end_time: '12:00' },
      { id: randomUUID(), user_id: uid, class_name: 'Thermodynamics Lecture',   course: 'MECH401', day_of_week: today,          start_time: '14:00', end_time: '15:30' },
    ],
  }
}

function priyaData(uid) {
  const today = new Date().getDay()
  return {
    tasks: [
      { id: randomUUID(), user_id: uid, title: 'Machine Learning Assignment 3',    course: 'CS450 Machine Learning', priority: 'high',   status: 'in_progress', deadline: d(5),  description: 'Neural networks', created_at: d(-7),  updated_at: d(-1) },
      { id: randomUUID(), user_id: uid, title: 'Research Paper Outline',            course: 'CS450 Machine Learning', priority: 'medium', status: 'todo',        deadline: d(12), description: null,              created_at: d(-4),  updated_at: d(-4) },
      { id: randomUUID(), user_id: uid, title: 'Python Pandas Exercise',            course: 'CS350 Data Structures',  priority: 'low',    status: 'completed',   deadline: d(3),  description: null,              created_at: d(-10), updated_at: d(-2) },
      { id: randomUUID(), user_id: uid, title: 'Data Visualisation Dashboard',     course: 'CS450 Machine Learning', priority: 'medium', status: 'in_progress', deadline: d(9),  description: null,              created_at: d(-6),  updated_at: d(-1) },
      { id: randomUUID(), user_id: uid, title: 'Literature Review – Deep Learning', course: 'CS450 Machine Learning', priority: 'high',   status: 'todo',        deadline: d(15), description: null,              created_at: d(-3),  updated_at: d(-3) },
    ],
    assignments: [
      { id: randomUUID(), user_id: uid, course: 'CS450 Machine Learning', title: 'Classification Model Report', due_date: d(15), status: 'in_progress', marks: null, created_at: d(-20) },
      { id: randomUUID(), user_id: uid, course: 'CS350 Data Structures',  title: 'Heap Implementation',         due_date: d(-5), status: 'graded',      marks: 96,   created_at: d(-30) },
      { id: randomUUID(), user_id: uid, course: 'CS450 Machine Learning', title: 'Kaggle Mini-Competition',     due_date: d(25), status: 'not_started', marks: null, created_at: d(-5)  },
    ],
    notes: [
      { id: randomUUID(), user_id: uid, title: 'ML Algorithms Overview',    content: '<ol><li>Linear Regression</li><li>Logistic Regression</li><li>Decision Trees</li><li>SVM</li><li>Neural Networks</li></ol>', tags: ['cs450','ml'],    created_at: d(-14), updated_at: d(-3) },
      { id: randomUUID(), user_id: uid, title: 'NumPy / Pandas Quick Ref',  content: '<ul><li>np.array, np.zeros, np.ones</li><li>df.describe(), df.groupby(), df.merge()</li><li>Broadcasting rules</li></ul>',   tags: ['python','cs450'],created_at: d(-9),  updated_at: d(-2) },
      { id: randomUUID(), user_id: uid, title: 'Evaluation Metrics',        content: '<ul><li>Accuracy = (TP+TN)/Total</li><li>Precision = TP/(TP+FP)</li><li>Recall = TP/(TP+FN)</li><li>F1 = 2·P·R/(P+R)</li></ul>', tags: ['cs450','exam'],created_at: d(-5),  updated_at: d(-1) },
    ],
    studySessions: [
      { id: randomUUID(), user_id: uid, subject: 'CS450 Machine Learning', ...session(2, 18, 3), goal: 'TensorFlow tutorial', created_at: d(-2) },
      { id: randomUUID(), user_id: uid, subject: 'CS350 Data Structures',  ...session(5, 11, 2), goal: 'Heap problems',       created_at: d(-5) },
      { id: randomUUID(), user_id: uid, subject: 'CS450 Machine Learning', ...session(8, 9,  3), goal: 'CNN architecture',   created_at: d(-8) },
    ],
    goals: [
      { id: randomUUID(), user_id: uid, goal_name: 'Publish Research Poster',    target_date: d(36), progress: 35, created_at: d(-40) },
      { id: randomUUID(), user_id: uid, goal_name: 'Kaggle Competition Top 20%', target_date: d(53), progress: 20, created_at: d(-15) },
      { id: randomUUID(), user_id: uid, goal_name: 'Learn PyTorch Fundamentals', target_date: d(14), progress: 60, created_at: d(-30) },
    ],
    classes: [
      { id: randomUUID(), user_id: uid, class_name: 'Machine Learning Lecture', course: 'CS450', day_of_week: today,          start_time: '14:00', end_time: '15:30' },
      { id: randomUUID(), user_id: uid, class_name: 'Data Structures Lab',      course: 'CS350', day_of_week: (today+2) % 7,  start_time: '10:00', end_time: '11:30' },
    ],
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const USERS = [
  { email: 'tasnim@studyflow.app', password: 'Tasnim2026!', name: 'Tasnim Ahmed', fn: tasnimData },
  { email: 'alex@studyflow.app',   password: 'Alex2026!',   name: 'Alex Rahman',  fn: alexData   },
  { email: 'maria@studyflow.app',  password: 'Maria2026!',  name: 'Maria Santos', fn: mariaData  },
  { email: 'james@studyflow.app',  password: 'James2026!',  name: 'James Okoro',  fn: jamesData  },
  { email: 'priya@studyflow.app',  password: 'Priya2026!',  name: 'Priya Nair',   fn: priyaData  },
]

async function main() {
  console.log('\n🚀  StudyFlow Supabase Seed Script\n')

  // 1 — Create / resolve auth users
  console.log('👤  Creating users...')
  const ids = {}
  for (const u of USERS) {
    try {
      const uid = await createUser(u.email, u.password, u.name)
      ids[u.name] = uid
      console.log(`  ✓ ${u.name.padEnd(18)} ${uid}`)
    } catch (err) {
      console.error(`  ✗ ${u.name}: ${err.message}`)
      process.exit(1)
    }
  }

  // 2 — Upsert profiles (trigger may already have created rows)
  console.log('\n📋  Upserting profiles...')
  await upsert('profiles', USERS.map(u => ({
    id: ids[u.name], name: u.name, email: u.email, avatar: null, created_at: d(-90),
  })))

  // 3 — Seed data per user
  for (const u of USERS) {
    const uid = ids[u.name]
    if (!uid) continue
    const data = u.fn(uid)
    console.log(`\n📦  Seeding ${u.name}...`)
    await upsert('tasks',          data.tasks)
    await upsert('assignments',    data.assignments)
    await upsert('notes',          data.notes)
    await upsert('study_sessions', data.studySessions)
    await upsert('goals',          data.goals)
    await upsert('classes',        data.classes)
  }

  // 4 — Done
  console.log('\n✅  Seeding complete!\n')
  console.log('Login credentials:')
  console.log('─'.repeat(54))
  for (const u of USERS)
    console.log(`  ${u.name.padEnd(18)} ${u.email.padEnd(28)} ${u.password}`)
  console.log('─'.repeat(54))
  console.log('\nTasnim Ahmed → 30 tasks · 12 assignments · 12 notes · 15 sessions · 8 goals · 8 classes')
  console.log('Open your app and sign in with any account above.\n')
}

main().catch(err => { console.error('\n❌  Seed failed:', err.message); process.exit(1) })
