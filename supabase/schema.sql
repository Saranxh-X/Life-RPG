-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table if not exists users (
  id uuid references auth.users(id) primary key,
  level integer default 1,
  current_xp integer default 0,
  gold integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_completed_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ATTRIBUTES TABLE
create table if not exists attributes (
  user_id uuid references users(id) primary key,
  strength integer default 1,
  intellect integer default 1,
  discipline integer default 1,
  health integer default 1,
  creativity integer default 1
);

-- QUESTS TABLE
create table if not exists quests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  name text not null,
  description text,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard', 'Legendary')),
  attribute text not null check (attribute in ('strength', 'intellect', 'discipline', 'health', 'creativity')),
  status text default 'active' check (status in ('active', 'completed', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- INVENTORY TABLE
create table if not exists inventory (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  item_id text not null,
  item_type text not null,
  purchased_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Triggers for new user signups
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id) values (new.id);
  insert into public.attributes (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Row Level Security (RLS)
alter table users enable row level security;
alter table attributes enable row level security;
alter table quests enable row level security;
alter table inventory enable row level security;

-- Policies
create policy "Users can view own data" on users for select using (auth.uid() = id);
create policy "Users can update own data" on users for update using (auth.uid() = id);

create policy "Users can view own attributes" on attributes for select using (auth.uid() = user_id);
create policy "Users can update own attributes" on attributes for update using (auth.uid() = user_id);

create policy "Users can view own quests" on quests for select using (auth.uid() = user_id);
create policy "Users can insert own quests" on quests for insert with check (auth.uid() = user_id);
create policy "Users can update own quests" on quests for update using (auth.uid() = user_id);
create policy "Users can delete own quests" on quests for delete using (auth.uid() = user_id);

create policy "Users can view own inventory" on inventory for select using (auth.uid() = user_id);
create policy "Users can insert own inventory" on inventory for insert with check (auth.uid() = user_id);
