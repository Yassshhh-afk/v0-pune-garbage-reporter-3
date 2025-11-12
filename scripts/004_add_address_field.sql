-- Add address column to garbage_reports table
ALTER TABLE public.garbage_reports 
ADD COLUMN IF NOT EXISTS address text;
