-- Initial schema for BuddyDoctor, reconstructed from the generated
-- src/integrations/supabase/types.ts of the previous (now-gone) Supabase
-- project. Column names/types/nullability match that file exactly; date vs
-- timestamptz choices were verified against how the frontend actually
-- constructs each value (see commit message / PR description for detail).

-- public.users mirrors auth.users (email/name only) so the app can query a
-- lightweight profile row without hitting the auth schema directly.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  age text,
  blood_type text,
  email text,
  -- Boolean flag, not a credential. Never read/written by the app today
  -- (kept for schema fidelity with the original project).
  password boolean,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index patients_caregiver_id_idx on public.patients (caregiver_id);

create table public.patient_allergies (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  allergy text not null
);
create index patient_allergies_patient_id_idx on public.patient_allergies (patient_id);

create table public.patient_chronic_diseases (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  disease text not null
);
create index patient_chronic_diseases_patient_id_idx on public.patient_chronic_diseases (patient_id);

create table public.patient_diagnoses (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  diagnosis text not null
);
create index patient_diagnoses_patient_id_idx on public.patient_diagnoses (patient_id);

create table public.patient_observations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  observations text
);
create index patient_observations_patient_id_idx on public.patient_observations (patient_id);

create table public.patient_contacts (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  name text not null,
  relation text not null,
  phone text,
  email text
);
create index patient_contacts_patient_id_idx on public.patient_contacts (patient_id);

create table public.patient_doctors (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  name text not null,
  specialty text,
  phone text
);
create index patient_doctors_patient_id_idx on public.patient_doctors (patient_id);

create table public.patient_appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  title text not null,
  appointment_date timestamptz not null,
  doctor text,
  location text,
  notes text,
  confirmed boolean,
  notification_sent boolean,
  created_at timestamptz default now()
);
create index patient_appointments_patient_id_idx on public.patient_appointments (patient_id);
create index patient_appointments_date_idx on public.patient_appointments (appointment_date);

create table public.patient_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  title text not null,
  event_date timestamptz not null,
  description text,
  location text,
  confirmed boolean,
  notification_sent boolean,
  created_at timestamptz default now()
);
create index patient_events_patient_id_idx on public.patient_events (patient_id);
create index patient_events_date_idx on public.patient_events (event_date);

create table public.patient_exams (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  title text not null,
  exam_date timestamptz not null,
  facility text,
  results text,
  confirmed boolean,
  notification_sent boolean,
  created_at timestamptz default now()
);
create index patient_exams_patient_id_idx on public.patient_exams (patient_id);
create index patient_exams_date_idx on public.patient_exams (exam_date);

create table public.patient_emergency_signals (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  message text,
  location text,
  resolved boolean,
  resolved_at timestamptz,
  created_at timestamptz default now()
);
create index patient_emergency_signals_patient_id_idx on public.patient_emergency_signals (patient_id);

create table public.patient_mood_entries (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  date date default current_date,
  mood text not null,
  notes text,
  created_at timestamptz default now()
);
create index patient_mood_entries_patient_id_idx on public.patient_mood_entries (patient_id);

create table public.patient_medications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  name text not null,
  dosage text not null,
  type text not null,
  unit text not null,
  frequency text not null,
  times text[] not null default '{}',
  quantity numeric not null default 0,
  dose_per_intake numeric,
  start_date date,
  end_date date,
  expiry_date date,
  last_taken timestamptz,
  is_recurring boolean,
  notes text,
  stock_alert_threshold numeric,
  alert_threshold numeric,
  auto_alert_contact_id uuid references public.patient_contacts (id),
  restock_history jsonb
);
create index patient_medications_patient_id_idx on public.patient_medications (patient_id);

create table public.medication_alerts (
  id uuid primary key default gen_random_uuid(),
  medication_id uuid not null references public.patient_medications (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  alert_contact_id uuid references public.patient_contacts (id),
  alert_time timestamptz not null,
  alert_sent boolean,
  confirmed boolean,
  created_at timestamptz default now()
);
create index medication_alerts_patient_id_idx on public.medication_alerts (patient_id);
create index medication_alerts_medication_id_idx on public.medication_alerts (medication_id);

create table public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  two_factor_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
