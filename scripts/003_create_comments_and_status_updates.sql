-- Create comments/reviews table for users to comment on garbage reports
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.garbage_reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  comment_text text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create status updates table for users to report area status (clean/dirty)
create table if not exists public.status_updates (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.garbage_reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status_type text not null check (status_type in ('clean', 'dirty', 'partially_clean')),
  photo_url text not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.comments enable row level security;
alter table public.status_updates enable row level security;

-- Comments: Public read access, authenticated users can insert/update own comments
create policy "comments_select_all"
  on public.comments for select
  using (true);

create policy "comments_insert_auth"
  on public.comments for insert
  with check (auth.role() = 'authenticated');

create policy "comments_update_own"
  on public.comments for update
  using (auth.uid() = user_id);

create policy "comments_delete_own"
  on public.comments for delete
  using (auth.uid() = user_id);

-- Status updates: Public read access, authenticated users can insert own updates
create policy "status_updates_select_all"
  on public.status_updates for select
  using (true);

create policy "status_updates_insert_auth"
  on public.status_updates for insert
  with check (auth.role() = 'authenticated');

create policy "status_updates_delete_own"
  on public.status_updates for delete
  using (auth.uid() = user_id);

-- Create indexes for faster queries
create index if not exists comments_report_id_idx 
  on public.comments (report_id);

create index if not exists comments_user_id_idx 
  on public.comments (user_id);

create index if not exists status_updates_report_id_idx 
  on public.status_updates (report_id);

create index if not exists status_updates_user_id_idx 
  on public.status_updates (user_id);
