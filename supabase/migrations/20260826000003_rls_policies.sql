-- Row Level Security. The previous project's policies were never committed
-- anywhere (git history confirms they were applied live, never captured as
-- SQL) — these are rewritten from scratch, following the one ownership
-- pattern the schema makes obvious: every row traces back to a patient
-- owned by a caregiver (auth.uid()), or to the user themself.

alter table public.users enable row level security;
alter table public.patients enable row level security;
alter table public.patient_allergies enable row level security;
alter table public.patient_chronic_diseases enable row level security;
alter table public.patient_diagnoses enable row level security;
alter table public.patient_observations enable row level security;
alter table public.patient_contacts enable row level security;
alter table public.patient_doctors enable row level security;
alter table public.patient_appointments enable row level security;
alter table public.patient_events enable row level security;
alter table public.patient_exams enable row level security;
alter table public.patient_emergency_signals enable row level security;
alter table public.patient_mood_entries enable row level security;
alter table public.patient_medications enable row level security;
alter table public.medication_alerts enable row level security;
alter table public.user_settings enable row level security;

-- users: a user can only see/update their own profile row. Insert is done
-- exclusively by the SECURITY DEFINER handle_new_user() trigger.
create policy "users_select_own" on public.users
  for select using (id = auth.uid());
create policy "users_update_own" on public.users
  for update using (id = auth.uid()) with check (id = auth.uid());

-- patients: full ownership by caregiver_id.
create policy "patients_owner_all" on public.patients
  for all using (caregiver_id = auth.uid()) with check (caregiver_id = auth.uid());

-- user_settings: a user only touches their own settings row.
create policy "user_settings_owner_all" on public.user_settings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Every patient_* child table: access follows from owning the parent
-- patient. Same shape repeated per table (no cross-table generic policy
-- support in Postgres RLS).
create policy "patient_allergies_owner_all" on public.patient_allergies
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));

create policy "patient_chronic_diseases_owner_all" on public.patient_chronic_diseases
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));

create policy "patient_diagnoses_owner_all" on public.patient_diagnoses
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));

create policy "patient_observations_owner_all" on public.patient_observations
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));

create policy "patient_contacts_owner_all" on public.patient_contacts
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));

create policy "patient_doctors_owner_all" on public.patient_doctors
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));

create policy "patient_appointments_owner_all" on public.patient_appointments
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));

create policy "patient_events_owner_all" on public.patient_events
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));

create policy "patient_exams_owner_all" on public.patient_exams
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));

create policy "patient_emergency_signals_owner_all" on public.patient_emergency_signals
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));

create policy "patient_mood_entries_owner_all" on public.patient_mood_entries
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));

create policy "patient_medications_owner_all" on public.patient_medications
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));

create policy "medication_alerts_owner_all" on public.medication_alerts
  for all
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = auth.uid()));
