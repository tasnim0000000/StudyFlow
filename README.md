# StudyFlow – Student Productivity Platform

**Organize. Focus. Achieve.**

A modern full-stack web application for university students to manage their academic life in one place.

![StudyFlow](public/favicon.svg)

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

When Supabase is not configured, use pre-seeded accounts. See **[DEMO_CREDENTIALS.md](./DEMO_CREDENTIALS.md)** for all emails and passwords.

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
