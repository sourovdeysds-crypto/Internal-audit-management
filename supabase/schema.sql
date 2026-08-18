create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text default '',
  email text,
  role text default 'staff',
  created_at timestamptz default now()
);

create table if not exists audits (
  id uuid primary key default uuid_generate_v4(),
  audit_no text unique not null,
  title text not null,
  company text,
  department text,
  audit_type text,
  auditor text,
  start_date date,
  end_date date,
  audit_period text,
  objective text,
  scope text,
  risk_level text,
  status text default 'Planned',
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists findings (
  id uuid primary key default uuid_generate_v4(),
  audit_id uuid references audits(id) on delete cascade,
  finding_no text not null,
  title text not null,
  criteria text,
  condition_text text,
  root_cause text,
  risk_impact text,
  financial_impact numeric(15,2) default 0,
  risk_rating text,
  recommendation text,
  management_response text,
  responsible_person text,
  target_date date,
  status text default 'Open',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
alter table audits enable row level security;
alter table findings enable row level security;

create policy "Authenticated users can view profiles"
on profiles for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
to authenticated
using (auth.uid() = id);

create policy "Authenticated users can view audits"
on audits for select
to authenticated
using (true);

create policy "Users can create audits"
on audits for insert
to authenticated
with check (auth.uid() = created_by);

create policy "Users can update audits"
on audits for update
to authenticated
using (auth.uid() = created_by);

create policy "Users can delete audits"
on audits for delete
to authenticated
using (auth.uid() = created_by);

create policy "Authenticated users can view findings"
on findings for select
to authenticated
using (true);

create policy "Authenticated users can create findings"
on findings for insert
to authenticated
with check (true);

create policy "Authenticated users can update findings"
on findings for update
to authenticated
using (true);

create policy "Authenticated users can delete findings"
on findings for delete
to authenticated
using (true);

create index if not exists idx_audits_status on audits(status);
create index if not exists idx_audits_created_by on audits(created_by);
create index if not exists idx_findings_audit_id on findings(audit_id);
create index if not exists idx_findings_status on findings(status);
create index if not exists idx_findings_risk on findings(risk_rating);
create index if not exists idx_findings_target_date on findings(target_date);
