-- Create garbage_reports table
create table if not exists public.garbage_reports (
  id uuid primary key default gen_random_uuid(),
  location_name text not null,
  latitude numeric(10, 8) not null,
  longitude numeric(11, 8) not null,
  description text not null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  status text not null default 'pending' check (status in ('pending', 'in-progress', 'resolved')),
  photo_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.garbage_reports enable row level security;

-- Public read access for all reports (anyone can view reports on the map)
create policy "garbage_reports_select_all"
  on public.garbage_reports for select
  using (true);

-- Public insert access (anyone can submit a report)
create policy "garbage_reports_insert_all"
  on public.garbage_reports for insert
  with check (true);

-- Only authenticated admin users can update reports (we'll add admin role later)
create policy "garbage_reports_update_admin"
  on public.garbage_reports for update
  using (false); -- Will be updated when we add admin authentication

-- Only authenticated admin users can delete reports
create policy "garbage_reports_delete_admin"
  on public.garbage_reports for delete
  using (false); -- Will be updated when we add admin authentication

-- Create index for geolocation queries
create index if not exists garbage_reports_location_idx 
  on public.garbage_reports (latitude, longitude);

-- Create index for status queries
create index if not exists garbage_reports_status_idx 
  on public.garbage_reports (status);
