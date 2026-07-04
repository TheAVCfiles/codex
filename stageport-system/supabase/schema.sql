create extension if not exists pgcrypto;

create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  tier text not null default 'active',
  status text not null default 'good_standing',
  created_at timestamptz default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  email text unique not null,
  role text not null default 'director',
  credential text not null default 'active',
  status text not null default 'good_standing',
  created_at timestamptz default now()
);

create table tenant_config (
  tenant_id uuid primary key references tenants(id) on delete cascade,
  terms jsonb not null default '{}'::jsonb,
  authority_rules jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table ledger_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  entry_type text not null,
  payload jsonb not null default '{}'::jsonb,
  prev_hash text,
  hash text,
  signature text,
  created_at timestamptz default now()
);

create table codex_dumps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete set null,
  repo text not null,
  pr_number integer,
  title text not null,
  body text,
  branch text,
  labels jsonb not null default '[]'::jsonb,
  classification text not null default 'vision',
  raw_patch_url text,
  merged boolean not null default false,
  created_at timestamptz default now()
);

create table musings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete set null,
  source_dump_id uuid references codex_dumps(id) on delete set null,
  title text not null,
  content text not null,
  theme text,
  intensity_score numeric default 0,
  clarity_score numeric default 0,
  market_score numeric default 0,
  timeliness_score numeric default 0,
  leak_risk_score numeric default 0,
  release_score numeric default 0,
  release_state text not null default 'hold',
  created_at timestamptz default now(),
  unique(source_dump_id)
);

create table witness_windows (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  artifact_id text not null,
  mode text not null default 'rehearsal',
  open_time timestamptz not null,
  close_time timestamptz not null,
  silence_buffer_seconds integer not null default 30,
  token_hash text not null,
  salt_hash text not null,
  one_time_redeem boolean not null default true,
  redeemed_at timestamptz,
  status text not null default 'open',
  created_at timestamptz default now()
);

create table demos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete set null,
  dump_id uuid references codex_dumps(id) on delete set null,
  input_summary text,
  output_summary text,
  demo_html text,
  release_state text not null default 'private',
  created_at timestamptz default now()
);

create table deal_rooms (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  slug text unique not null,
  title text not null,
  status text not null default 'active',
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table deal_room_events (
  id uuid primary key default gen_random_uuid(),
  deal_room_id uuid not null references deal_rooms(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table tenants enable row level security;
alter table users enable row level security;
alter table tenant_config enable row level security;
alter table ledger_entries enable row level security;
alter table codex_dumps enable row level security;
alter table musings enable row level security;
alter table witness_windows enable row level security;
alter table demos enable row level security;
alter table deal_rooms enable row level security;
alter table deal_room_events enable row level security;
