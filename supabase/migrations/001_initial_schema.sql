-- StudyFlow Database Schema
-- Profiles table (extends auth.users)

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  avatar text,
  created_at timestamptz default now()
);

-- Tasks
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  course text,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  deadline timestamptz,
  status text check (status in ('todo', 'in_progress', 'completed')) default 'todo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Assignments
create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course text not null,
  title text not null,
  due_date timestamptz not null,
  status text check (status in ('not_started', 'in_progress', 'submitted', 'graded')) default 'not_started',
  marks numeric(5,2),
  created_at timestamptz default now()
);

-- Notes
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null default '',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Study Sessions
create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  goal text,
  created_at timestamptz default now()
);

-- Goals
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  goal_name text not null,
  target_date date,
  progress integer check (progress >= 0 and progress <= 100) default 0,
  created_at timestamptz default now()
);

-- Classes (for schedule widget)
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  class_name text not null,
  course text,
  day_of_week integer check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null
);

-- Indexes
create index tasks_user_status_idx on public.tasks(user_id, status);
create index tasks_user_deadline_idx on public.tasks(user_id, deadline);
create index assignments_user_due_date_idx on public.assignments(user_id, due_date);
create index notes_user_tags_idx on public.notes using gin(tags);
create index study_sessions_user_start_idx on public.study_sessions(user_id, start_time);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Student'),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger for tasks and notes
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tasks_updated_at before update on public.tasks
  for each row execute function public.update_updated_at();

create trigger notes_updated_at before update on public.notes
  for each row execute function public.update_updated_at();
