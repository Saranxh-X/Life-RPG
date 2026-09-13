-- Life RPG Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (extends auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    username text unique,
    avatar_url text,
    level integer default 1 not null,
    current_xp integer default 0 not null,
    gold integer default 0 not null,
    strength integer default 1 not null,
    intellect integer default 1 not null,
    discipline integer default 1 not null,
    health integer default 1 not null,
    creativity integer default 1 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Quests (Tasks)
create table public.quests (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    description text,
    category text not null check (category in ('strength', 'intellect', 'discipline', 'health', 'creativity')),
    difficulty text not null check (difficulty in ('easy', 'medium', 'hard', 'legendary')),
    xp_reward integer not null default 0,
    gold_reward integer not null default 0,
    completed boolean default false not null,
    due_date timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone
);

-- 3. Streaks
create table public.streaks (
    user_id uuid references public.profiles(id) on delete cascade not null primary key,
    current_streak integer default 0 not null,
    longest_streak integer default 0 not null,
    last_activity_date date
);

-- 4. Rewards (Shop Items)
create table public.rewards (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    price integer not null,
    type text not null check (type in ('badge', 'theme', 'cosmetic')),
    image_url text
);

-- 5. Inventory (User purchased items)
create table public.inventory (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    reward_id uuid references public.rewards(id) on delete cascade not null,
    purchased_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, reward_id)
);

-- Setup Row Level Security (RLS)

-- Profiles
alter table public.profiles enable row level security;
create policy "Users can view their own profile." on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);

-- Quests
alter table public.quests enable row level security;
create policy "Users can view their own quests." on public.quests for select using (auth.uid() = user_id);
create policy "Users can insert their own quests." on public.quests for insert with check (auth.uid() = user_id);
create policy "Users can update their own quests." on public.quests for update using (auth.uid() = user_id);
create policy "Users can delete their own quests." on public.quests for delete using (auth.uid() = user_id);

-- Streaks
alter table public.streaks enable row level security;
create policy "Users can view their own streaks." on public.streaks for select using (auth.uid() = user_id);
create policy "Users can insert their own streaks." on public.streaks for insert with check (auth.uid() = user_id);
create policy "Users can update their own streaks." on public.streaks for update using (auth.uid() = user_id);

-- Rewards (Publicly readable, but only admin writable - we'll just make it read-only for all authenticated users here)
alter table public.rewards enable row level security;
create policy "Anyone can view rewards." on public.rewards for select to authenticated using (true);

-- Inventory
alter table public.inventory enable row level security;
create policy "Users can view their own inventory." on public.inventory for select using (auth.uid() = user_id);
create policy "Users can insert into their own inventory." on public.inventory for insert with check (auth.uid() = user_id);

-- Function to handle new user signup automatically (Trigger)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  
  insert into public.streaks (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert some dummy rewards
insert into public.rewards (name, description, price, type) values 
('Warrior Badge', 'Shows your dedication to strength.', 100, 'badge'),
('Scholar Badge', 'Shows your dedication to intellect.', 100, 'badge'),
('Golden Avatar Frame', 'A shiny frame for your avatar.', 500, 'cosmetic'),
('Dark Mage Theme', 'Unlock the dark magic theme.', 1000, 'theme');
