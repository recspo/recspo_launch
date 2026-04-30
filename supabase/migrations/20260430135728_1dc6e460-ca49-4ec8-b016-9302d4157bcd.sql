
-- Single-row event config
create table public.launch_event (
  id int primary key default 1,
  target int not null default 10,
  launched boolean not null default false,
  launched_at timestamptz,
  created_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into public.launch_event (id, target, launched) values (1, 10, false);

alter table public.launch_event enable row level security;

create policy "anyone can read event" on public.launch_event for select using (true);
create policy "anyone can update event" on public.launch_event for update using (true) with check (true);

-- Participants
create table public.participants (
  id uuid primary key default gen_random_uuid(),
  client_id text not null unique,
  joined_at timestamptz not null default now(),
  launched boolean not null default false,
  launched_at timestamptz
);

alter table public.participants enable row level security;

create policy "anyone can read participants" on public.participants for select using (true);
create policy "anyone can join" on public.participants for insert with check (true);
create policy "anyone can update self launch" on public.participants for update using (true) with check (true);

-- Realtime
alter table public.launch_event replica identity full;
alter table public.participants replica identity full;
alter publication supabase_realtime add table public.launch_event;
alter publication supabase_realtime add table public.participants;

-- Auto-trigger launched flag when threshold reached
create or replace function public.check_launch_threshold()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  launch_count int;
  target_count int;
begin
  select target into target_count from public.launch_event where id = 1;
  select count(*) into launch_count from public.participants where launched = true;
  if launch_count >= target_count then
    update public.launch_event
      set launched = true, launched_at = now()
      where id = 1 and launched = false;
  end if;
  return new;
end;
$$;

create trigger trg_check_launch
after insert or update on public.participants
for each row execute function public.check_launch_threshold();
