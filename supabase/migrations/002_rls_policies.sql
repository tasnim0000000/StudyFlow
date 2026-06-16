-- Row Level Security Policies

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.assignments enable row level security;
alter table public.notes enable row level security;
alter table public.study_sessions enable row level security;
alter table public.goals enable row level security;
alter table public.classes enable row level security;

-- Profiles
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Tasks
create policy "Users can view own tasks"
  on public.tasks for select using (auth.uid() = user_id);

create policy "Users can create own tasks"
  on public.tasks for insert with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on public.tasks for update using (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on public.tasks for delete using (auth.uid() = user_id);

-- Assignments
create policy "Users can view own assignments"
  on public.assignments for select using (auth.uid() = user_id);

create policy "Users can create own assignments"
  on public.assignments for insert with check (auth.uid() = user_id);

create policy "Users can update own assignments"
  on public.assignments for update using (auth.uid() = user_id);

create policy "Users can delete own assignments"
  on public.assignments for delete using (auth.uid() = user_id);

-- Notes
create policy "Users can view own notes"
  on public.notes for select using (auth.uid() = user_id);

create policy "Users can create own notes"
  on public.notes for insert with check (auth.uid() = user_id);

create policy "Users can update own notes"
  on public.notes for update using (auth.uid() = user_id);

create policy "Users can delete own notes"
  on public.notes for delete using (auth.uid() = user_id);

-- Study Sessions
create policy "Users can view own study sessions"
  on public.study_sessions for select using (auth.uid() = user_id);

create policy "Users can create own study sessions"
  on public.study_sessions for insert with check (auth.uid() = user_id);

create policy "Users can delete own study sessions"
  on public.study_sessions for delete using (auth.uid() = user_id);

-- Goals
create policy "Users can view own goals"
  on public.goals for select using (auth.uid() = user_id);

create policy "Users can create own goals"
  on public.goals for insert with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.goals for update using (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.goals for delete using (auth.uid() = user_id);

-- Classes
create policy "Users can view own classes"
  on public.classes for select using (auth.uid() = user_id);

create policy "Users can create own classes"
  on public.classes for insert with check (auth.uid() = user_id);

create policy "Users can update own classes"
  on public.classes for update using (auth.uid() = user_id);

create policy "Users can delete own classes"
  on public.classes for delete using (auth.uid() = user_id);
