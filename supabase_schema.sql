create table if not exists products (
  id text primary key,
  title text,
  short_desc text,
  price_cents int,
  currency text,
  stripe_product_id text,
  stripe_price_id text,
  slug text,
  created_at timestamptz default now()
);

create table if not exists transactions (
  id text primary key,
  product_id text references products(id),
  stripe_session_id text,
  amount int,
  currency text,
  customer_email text,
  status text,
  created_at timestamptz default now()
);

create index if not exists transactions_created_at_idx on transactions(created_at);
