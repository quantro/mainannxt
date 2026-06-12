-- Run this in your Supabase SQL editor

-- Create the click stats table
create table if not exists tool_clicks (
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
  insert into tool_clicks (tool_slug, click_count)
  values (tool, 1)
  on conflict (tool_slug)
  do update set click_count = tool_clicks.click_count + 1;
end;
$$;
