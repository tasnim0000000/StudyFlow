# StudyFlow – Student Productivity Platform

**Organize. Focus. Achieve.**

A modern full-stack web application for university students to manage their academic life in one place.

![StudyFlow](image/logo-black.jpeg)

## Features

- **Authentication** – Login, Register, Forgot Password (Supabase Auth)
- **Dashboard** – Welcome section, stats, productivity score, deadlines, schedule
- **Task Manager** – Full CRUD with Kanban, List, and Calendar views
- **Study Planner** – Weekly, monthly, and session history
- **Notes Manager** – Rich text editor, search, and tag filtering
- **Assignment Tracker** – Timeline view with deadline alerts
- **Goal Tracker** – Progress bars with animated updates
- **Calendar** – Integrated view of classes, tasks, assignments, and study sessions
- **Global Search** – Search across tasks, notes, assignments, and goals
- **Analytics** – Study time and productivity charts (Recharts)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Animation | Framer Motion |
| Backend | Supabase |
| Database | PostgreSQL (via Supabase) |
| Auth | Supabase Auth |
| Charts | Recharts |
| Deployment | Vercel |

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- [Supabase](https://supabase.com/) account (optional – demo mode works without it)

## Getting Started

### 1. Install dependencies

```bash
cd ~/Projects/studyflow
npm install
```

### 2. Environment variables (optional)

Copy `.env.example` to `.env` and add your Supabase credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Without these variables, the app runs in **demo mode** with local storage and sample data.

### 3. Set up Supabase (production)

1. Create a new Supabase project
2. Run migrations in order from `supabase/migrations/`:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_seed_data.sql` (replace `USER_UUID` with your test user id)
3. Enable Email auth in Supabase Dashboard → Authentication
4. Add your site URL to Auth redirect URLs

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Demo Mode Login

When Supabase is not configured, use pre-seeded accounts. See **[DEMO_CREDENTIALS](#studyflow-demo-credentials)** for all emails and passwords.

**Your profile:** `tasnimahmed123@gmail.com` / `Tasnim@123` (30 tasks, multi-semester data)

## Project Structure

```
studyflow/
├── src/
│   ├── components/     # UI, layout, feature components
│   ├── hooks/          # Data fetching hooks
│   ├── lib/            # Supabase, validations, utils
│   ├── pages/          # Route pages
│   ├── providers/      # Auth & React Query providers
│   ├── types/          # TypeScript types
│   └── styles/         # Global CSS
├── supabase/
│   └── migrations/     # Database schema & RLS
└── public/
```

## Security

- Protected routes for authenticated pages
- Row Level Security (RLS) on all Supabase tables
- Zod input validation on all forms
- DOMPurify XSS sanitization for rich text notes
- Supabase handles password hashing

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

Add your Vercel URL to Supabase Auth redirect URLs.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Color Palette

| Color | Hex |
|-------|-----|
| Lavender (Primary) | `#CDB4DB` |
| Soft Purple | `#B8A0C8` |
| Baby Pink | `#FFC8DD` |
| Warm Cream (BG) | `#FAF7F2` |
| Soft Blue | `#BDE0FE` |
| Mint Green | `#D8F3DC` |

## License

MIT

# StudyFlow Demo Credentials

Use these accounts when running in **demo mode** (no Supabase `.env` configured).

Each account has **isolated data** stored in your browser's local storage. Sign out and sign in as a different user to see their separate workspace.

---

## Login Credentials

| Name | Email | Password | Data profile |
|------|-------|----------|--------------|
| **Tasnim Ahmed** | `tasnimahmed123@gmail.com` | `Tasnim@123` | Full profile — 30 tasks, 12 assignments, 10 notes, 15 study sessions, 8 goals, 8 classes across multiple semesters |
| Alex Johnson | `alex.johnson@university.edu` | `Alex@123` | Medium — 5 tasks, 3 assignments |
| Maria Garcia | `maria.garcia@university.edu` | `Maria@123` | Light — Chemistry & Statistics focus |
| James Wilson | `james.wilson@university.edu` | `James@123` | Light — Mechanical Engineering focus |
| Priya Sharma | `priya.sharma@university.edu` | `Priya@123` | Light — Machine Learning focus |

---

## Tasnim Ahmed — Full Profile Summary

**Courses (multi-semester):**
- CS301 Web Development
- CS202 Database Systems
- CS401 Software Engineering
- CS350 Data Structures
- MATH205 Linear Algebra
- PHYS101 Physics I
- ENG202 Modern Literature
- BUS210 Business Analytics

**Includes:**
- 30 tasks (Fall 2025 completed + Spring 2026 active)
- 12 assignments (graded + in progress)
- 10 notes with rich text and tags
- 15 study sessions spanning ~45 days
- 8 goals with varied progress
- 8 weekly class schedule entries

**Try searching:** `CS301`, `Web Development`, `Linear Algebra`, `MATH205`

---

## Resetting Data

- **Settings → Demo Data → Reset** restores the **current user's** data to factory defaults.
- To clear **all** users' stored data, open browser DevTools → Application → Local Storage → delete keys starting with `studyflow-user-data-`.

---

## Phase 2: Production Auth with Supabase

Demo mode is for local development and demos. For **real authentication** (course submission / production):

### Step 1 — Create Supabase project
1. Go to [supabase.com](https://supabase.com) and create a project.
2. Copy **Project URL** and **anon key** into `.env`:
   ```env
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### Step 2 — Run database migrations
In Supabase SQL Editor, run in order:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`

### Step 3 — Create real users
In Supabase Dashboard → **Authentication → Users → Add user**:

| Email | Password | Name (user metadata) |
|-------|----------|----------------------|
| tasnim@studyflow.app | Tasnim2026! | Tasnim Ahmed |
| alex@studyflow.app | Alex2026! | Alex Rahman |
| maria@studyflow.app | Maria2026! | Maria Santos |
| james@studyflow.app | James2026! | James Okoro |
| priya@studyflow.app | Priya2026! | Priya Nair |
| (etc.) | | |

The `handle_new_user` trigger auto-creates a `profiles` row.

### Step 4 — Seed data per user
1. After creating each user, copy their UUID from Authentication → Users.
2. Replace `USER_UUID` in `supabase/migrations/003_seed_data.sql` and run for each user.
3. For Tasnim's full dataset, use the SQL generator or export from demo seeds (contact maintainer / run seed script).

### Step 5 — Security checklist
- [x] Row Level Security on all tables (`auth.uid() = user_id`)
- [x] Password hashing via Supabase Auth (bcrypt)
- [x] Protected routes in React
- [x] Zod validation on all forms
- [x] DOMPurify on note HTML output
- [ ] Email confirmation (enable in Supabase Auth settings)
- [ ] Rate limiting (Supabase built-in)
- [ ] Deploy with HTTPS on Vercel

### Step 6 — Deploy
1. Push to GitHub.
2. Import to Vercel, add env vars.
3. Add Vercel URL to Supabase **Auth → URL Configuration → Redirect URLs**.

---

## Notes for Course Evaluators

- **Demo mode** proves UI/UX, CRUD, search, analytics without a live database.
- **Supabase mode** proves full-stack security, RLS, and real multi-user isolation.
- Sign in as **Tasnim Ahmed** for the richest dataset demonstration.
