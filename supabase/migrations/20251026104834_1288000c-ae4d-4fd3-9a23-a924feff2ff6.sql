-- Fix infinite recursion in user_roles policies and add role-checking functions

-- 1) Create SECURE helper functions to avoid RLS recursion
create or replace function public.has_role(
  _user_id uuid,
  _role public.app_role
) returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

create or replace function public.has_role_in_org(
  _user_id uuid,
  _org_id uuid,
  _role public.app_role
) returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id
      and organization_id = _org_id
      and role = _role
  );
$$;

-- 2) Replace recursive policies on user_roles
-- Drop old policies if they exist
drop policy if exists "Users view roles in their orgs" on public.user_roles;
drop policy if exists "Admins can manage roles" on public.user_roles;

-- Ensure RLS is enabled (should already be)
alter table public.user_roles enable row level security;

-- Allow users to view only their own role rows
create policy "Users can view own roles"
  on public.user_roles
  for select
  to authenticated
  using (user_id = auth.uid());

-- Allow admins to view all roles in their organizations
create policy "Admins can view roles in their orgs"
  on public.user_roles
  for select
  to authenticated
  using (
    public.has_role_in_org(auth.uid(), organization_id, 'admin')
    or public.has_role_in_org(auth.uid(), organization_id, 'super_admin')
  );

-- Allow admins to manage (insert/update/delete) roles within their organizations
create policy "Admins can manage roles in their orgs"
  on public.user_roles
  for all
  to authenticated
  using (
    public.has_role_in_org(auth.uid(), organization_id, 'admin')
    or public.has_role_in_org(auth.uid(), organization_id, 'super_admin')
  )
  with check (
    public.has_role_in_org(auth.uid(), organization_id, 'admin')
    or public.has_role_in_org(auth.uid(), organization_id, 'super_admin')
  );