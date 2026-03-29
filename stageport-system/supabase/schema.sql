-- Future upgrade path only; not required for the GitHub-only scaffold.

create table if not exists public.musings (
  id text primary key,
  title text not null,
  body text not null,
  classification text,
  created_at timestamptz default now()
);
