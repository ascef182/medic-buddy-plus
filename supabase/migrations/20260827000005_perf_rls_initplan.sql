-- Performance optimization flagged by Supabase's performance advisor
-- (auth_rls_initplan): every policy below called auth.uid() directly, which
-- Postgres re-evaluates per row. Wrapping it as (select auth.uid()) lets the
-- planner cache it once per statement instead. This does NOT change any
-- authorization logic — every USING/WITH CHECK expression is unchanged
-- except for that wrapping, so the access rules are identical before/after.

alter policy "users_select_own" on public.users
  using (id = (select auth.uid()));

alter policy "users_update_own" on public.users
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

alter policy "patients_owner_all" on public.patients
  using (caregiver_id = (select auth.uid()))
  with check (caregiver_id = (select auth.uid()));

alter policy "user_settings_owner_all" on public.user_settings
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter policy "patient_allergies_owner_all" on public.patient_allergies
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));

alter policy "patient_chronic_diseases_owner_all" on public.patient_chronic_diseases
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));

alter policy "patient_diagnoses_owner_all" on public.patient_diagnoses
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));

alter policy "patient_observations_owner_all" on public.patient_observations
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));

alter policy "patient_contacts_owner_all" on public.patient_contacts
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));

alter policy "patient_doctors_owner_all" on public.patient_doctors
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));

alter policy "patient_appointments_owner_all" on public.patient_appointments
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));

alter policy "patient_events_owner_all" on public.patient_events
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));

alter policy "patient_exams_owner_all" on public.patient_exams
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));

alter policy "patient_emergency_signals_owner_all" on public.patient_emergency_signals
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));

alter policy "patient_mood_entries_owner_all" on public.patient_mood_entries
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));

alter policy "patient_medications_owner_all" on public.patient_medications
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));

alter policy "medication_alerts_owner_all" on public.medication_alerts
  using (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())))
  with check (exists (select 1 from public.patients p where p.id = patient_id and p.caregiver_id = (select auth.uid())));
