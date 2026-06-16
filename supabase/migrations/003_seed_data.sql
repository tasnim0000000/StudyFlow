-- Sample seed data for StudyFlow
-- Replace USER_UUID with your test user's auth.users id after registration

-- Example (uncomment and replace USER_UUID):
/*
insert into public.tasks (user_id, title, description, course, priority, deadline, status) values
  ('USER_UUID', 'Implement REST API', 'Build CRUD endpoints', 'CS301 Web Development', 'high', now() + interval '3 days', 'in_progress'),
  ('USER_UUID', 'Read Chapter 7', 'Linear transformations', 'MATH205 Linear Algebra', 'medium', now() + interval '5 days', 'todo'),
  ('USER_UUID', 'Lab Report Draft', 'Wave interference experiment', 'PHYS101 Physics', 'high', now() + interval '1 day', 'todo');

insert into public.assignments (user_id, course, title, due_date, status, marks) values
  ('USER_UUID', 'CS301 Web Development', 'Full Stack Project', now() + interval '14 days', 'in_progress', null),
  ('USER_UUID', 'ENG202 Literature', 'Essay: Modernism', now() + interval '7 days', 'not_started', null);

insert into public.notes (user_id, title, content, tags) values
  ('USER_UUID', 'React Hooks Cheat Sheet', '<p>useState, useEffect, useContext</p>', array['react', 'exam']),
  ('USER_UUID', 'SQL Joins Summary', '<p>INNER, LEFT, RIGHT joins</p>', array['database', 'sql']);

insert into public.study_sessions (user_id, subject, start_time, end_time, goal) values
  ('USER_UUID', 'Data Structures', now() - interval '2 days', now() - interval '2 days' + interval '2 hours', 'BST exercises'),
  ('USER_UUID', 'Web Development', now() - interval '1 day', now() - interval '1 day' + interval '3 hours', 'Dashboard components');

insert into public.goals (user_id, goal_name, target_date, progress) values
  ('USER_UUID', 'Complete Java Project', '2026-06-30', 65),
  ('USER_UUID', 'Study 4 Hours Daily', '2026-06-15', 40),
  ('USER_UUID', 'Finish Semester Preparation', '2026-07-01', 20);

insert into public.classes (user_id, class_name, course, day_of_week, start_time, end_time) values
  ('USER_UUID', 'Web Development Lecture', 'CS301', extract(dow from now())::int, '09:00', '10:30'),
  ('USER_UUID', 'Linear Algebra Tutorial', 'MATH205', extract(dow from now())::int, '11:00', '12:00'),
  ('USER_UUID', 'Physics Lab', 'PHYS101', extract(dow from now())::int, '14:00', '16:00');
*/
