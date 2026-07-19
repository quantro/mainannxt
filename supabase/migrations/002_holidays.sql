-- Run this in your Supabase SQL editor
-- Migration 002: Indonesian Holidays table

-- Drop the table if re-running (safe since data is reproducible)
drop table if exists indonesian_holidays;

create table indonesian_holidays (
  id bigint primary key generated always as identity,
  source_id integer,
  date date not null,
  name text not null,
  type text not null,
  year integer not null,
  is_holiday boolean not null default true,
  is_joint_holiday boolean not null default false,
  is_observance boolean not null default false,
  created_at timestamptz not null default now()
);

-- Indexes for common query patterns
create index if not exists idx_holidays_year on indonesian_holidays (year);
create index if not exists idx_holidays_type on indonesian_holidays (type);
create index if not exists idx_holidays_date on indonesian_holidays (date);

-- Enable Row Level Security
alter table indonesian_holidays enable row level security;

-- Allow public read access (holidays are public data)
create policy "Public read access"
  on indonesian_holidays
  for select
  to public
  using (true);
