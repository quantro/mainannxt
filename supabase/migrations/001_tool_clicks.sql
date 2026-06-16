-- Run this in your Supabase SQL editor

-- Create the click stats table
create table if not exists tools_tool_clicks (
  id bigint primary key generated always as identity,
  tool_slug text unique not null,
  click_count bigint not null default 1
);

-- Function to increment or insert
create or replace function increment_click(tool text)
returns void
language plpgsql
as $$
begin
  insert into tools_tool_clicks (tool_slug, click_count)
  values (tool, 1)
  on conflict (tool_slug)
  do update set click_count = tools_tool_clicks.click_count + 1;
end;
$$;

-- Create click log table
create table if not exists tools_click_log (
  id bigint primary key generated always as identity,
  tool_slug text not null,
  ip_address text not null,
  clicked_at timestamptz not null default now()
);

-- Create suggestions table
create table if not exists tools_suggestions (
  id bigint primary key generated always as identity,
  name text,
  message text not null,
  ip text,
  created_at timestamptz not null default now()
);
