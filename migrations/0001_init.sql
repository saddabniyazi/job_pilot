create extension if not exists "pgcrypto";

-- Profiles table stores user profile data linked to InsForge auth
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  full_name text,
  email text,
  phone text,
  location text,
  current_title text,
  experience_level text,
  years_experience integer,
  skills jsonb,
  industries jsonb,
  work_experience jsonb,
  education jsonb,
  job_titles_seeking jsonb,
  remote_preference text,
  preferred_locations jsonb,
  salary_expectation text,
  cover_letter_tone text,
  linkedin_url text,
  portfolio_url text,
  work_authorization text,
  resume_pdf_url text,
  is_complete boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_user_id_unique unique (user_id)
);

-- Agent run records for job discovery/search operations
create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  run_type text,
  status text not null default 'running',
  params jsonb,
  jobs_found integer,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  metrics jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Jobs discovered or imported for the current user
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid,
  user_id uuid not null,
  source text not null,
  source_url text,
  external_apply_url text,
  title text,
  company text,
  location text,
  salary text,
  job_type text,
  about_role text,
  responsibilities jsonb,
  requirements jsonb,
  nice_to_have jsonb,
  benefits jsonb,
  about_company text,
  match_score integer,
  match_reason text,
  matched_skills jsonb,
  missing_skills jsonb,
  company_research jsonb,
  found_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jobs_run_id_fk foreign key (run_id) references agent_runs (id) on delete set null
);

-- Agent logs store structured messages and metadata for each run
create table if not exists agent_logs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null,
  level text not null,
  message text not null,
  meta jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agent_logs_run_id_fk foreign key (run_id) references agent_runs (id) on delete cascade
);

-- Resumes storage metadata for user-uploaded resumes
create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  file_key text not null,
  public_url text,
  uploaded_at timestamptz not null default now(),
  parsed_text text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for user-scoped access and common queries
create index if not exists profiles_user_id_idx on profiles (user_id);
create index if not exists agent_runs_user_id_idx on agent_runs (user_id);
create index if not exists agent_runs_status_started_at_idx on agent_runs (status, started_at);
create index if not exists jobs_user_id_idx on jobs (user_id);
create index if not exists jobs_found_at_idx on jobs (found_at);
create index if not exists agent_logs_run_id_idx on agent_logs (run_id);
create index if not exists resumes_user_id_idx on resumes (user_id);

-- Row level security policies
alter table profiles enable row level security;
create policy profiles_user_policy on profiles
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

alter table agent_runs enable row level security;
create policy agent_runs_user_policy on agent_runs
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

alter table jobs enable row level security;
create policy jobs_user_policy on jobs
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

alter table agent_logs enable row level security;
create policy agent_logs_user_policy on agent_logs
  for all
  using (
    exists (
      select 1
      from agent_runs
      where agent_runs.id = agent_logs.run_id
        and agent_runs.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from agent_runs
      where agent_runs.id = agent_logs.run_id
        and agent_runs.user_id = auth.uid()
    )
  );

alter table resumes enable row level security;
create policy resumes_user_policy on resumes
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
