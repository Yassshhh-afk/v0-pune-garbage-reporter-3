-- Update RLS policies to allow authenticated users (admins) to update and delete reports

-- Drop existing update and delete policies
drop policy if exists "garbage_reports_update_admin" on public.garbage_reports;
drop policy if exists "garbage_reports_delete_admin" on public.garbage_reports;

-- Create new policies that allow authenticated users to update and delete
create policy "garbage_reports_update_authenticated"
  on public.garbage_reports for update
  using (auth.uid() is not null);

create policy "garbage_reports_delete_authenticated"
  on public.garbage_reports for delete
  using (auth.uid() is not null);
