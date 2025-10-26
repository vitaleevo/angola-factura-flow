-- =====================================================
-- FASE 1: SCHEMA COMPLETO - eFactura AO Multi-tenant
-- =====================================================

-- 1. CRIAR ENUM PARA ROLES
CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'admin',
  'manager',
  'accountant',
  'operator'
);

-- 2. TABELA: organizations
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  nif TEXT UNIQUE,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  subscription_plan_id UUID,
  trial_ends_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TABELA: subscription_plans
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_yearly NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_users INTEGER NOT NULL DEFAULT 1,
  max_branches INTEGER NOT NULL DEFAULT 1,
  max_invoices_per_month INTEGER NOT NULL DEFAULT 50,
  features JSONB NOT NULL DEFAULT '{"modules": {}, "limits": {}}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. TABELA: profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  default_organization_id UUID REFERENCES public.organizations(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. TABELA: user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, organization_id, role)
);

-- 6. TABELA: organization_modules
CREATE TABLE public.organization_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  module_key TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  enabled_at TIMESTAMPTZ,
  disabled_at TIMESTAMPTZ,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, module_key)
);

-- 7. TABELA: branches
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  is_headquarters BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. ADICIONAR organization_id às tabelas existentes
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- 9. TABELA: agt_submissions
CREATE TABLE public.agt_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  invoice_id BIGINT REFERENCES public.invoices(id),
  payload JSONB NOT NULL,
  signature TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  agt_response JSONB,
  error_message TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. TABELA: product_categories
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.product_categories(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. ADICIONAR FK à tabela products para categories
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.product_categories(id);

-- 12. ATUALIZAR audit_logs para multi-tenant
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- =====================================================
-- FUNÇÕES HELPER
-- =====================================================

-- Função para verificar se user tem role específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _org_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND organization_id = _org_id
      AND role = _role
  );
$$;

-- Função para verificar se user tem qualquer role na organização
CREATE OR REPLACE FUNCTION public.user_in_organization(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND organization_id = _org_id
  );
$$;

-- Função para verificar acesso a módulo
CREATE OR REPLACE FUNCTION public.has_module_access(_org_id UUID, _module_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_modules om
    JOIN public.organizations o ON o.id = om.organization_id
    WHERE om.organization_id = _org_id
      AND om.module_key = _module_key
      AND om.is_enabled = true
      AND o.is_active = true
  );
$$;

-- Função para obter organizations do user
CREATE OR REPLACE FUNCTION public.get_user_organizations(_user_id UUID)
RETURNS TABLE (organization_id UUID)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT organization_id
  FROM public.user_roles
  WHERE user_id = _user_id;
$$;

-- =====================================================
-- ENABLE RLS
-- =====================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agt_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS nas tabelas existentes
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- PROFILES: Users podem ver e editar próprio perfil
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- ORGANIZATIONS: Users veem apenas suas organizações
CREATE POLICY "Users view their organizations"
ON public.organizations FOR SELECT
TO authenticated
USING (
  id IN (SELECT get_user_organizations(auth.uid()))
);

-- SUBSCRIPTION_PLANS: Todos podem ver planos (público)
CREATE POLICY "Anyone can view active plans"
ON public.subscription_plans FOR SELECT
TO authenticated
USING (is_active = true);

-- USER_ROLES: Users veem roles da sua org, admins podem gerenciar
CREATE POLICY "Users view roles in their orgs"
ON public.user_roles FOR SELECT
TO authenticated
USING (
  organization_id IN (SELECT get_user_organizations(auth.uid()))
);

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND organization_id = user_roles.organization_id
      AND role IN ('admin', 'super_admin')
  )
);

-- ORGANIZATION_MODULES: Users veem módulos da sua org
CREATE POLICY "Users view modules in their orgs"
ON public.organization_modules FOR SELECT
TO authenticated
USING (
  organization_id IN (SELECT get_user_organizations(auth.uid()))
);

-- BRANCHES: Users acessam filiais da sua org
CREATE POLICY "Users access branches in their org"
ON public.branches FOR ALL
TO authenticated
USING (
  organization_id IN (SELECT get_user_organizations(auth.uid()))
);

-- CLIENTS: Apenas da org + módulo CRM habilitado
CREATE POLICY "Users access clients in their org with CRM"
ON public.clients FOR ALL
TO authenticated
USING (
  organization_id IN (SELECT get_user_organizations(auth.uid()))
  AND (
    has_module_access(organization_id, 'crm') 
    OR has_module_access(organization_id, 'documents')
  )
);

-- PRODUCTS: Apenas da org + módulo habilitado
CREATE POLICY "Users access products in their org"
ON public.products FOR ALL
TO authenticated
USING (
  organization_id IN (SELECT get_user_organizations(auth.uid()))
  AND (
    has_module_access(organization_id, 'products')
    OR has_module_access(organization_id, 'documents')
  )
);

-- INVOICES: Apenas da org + módulo documents
CREATE POLICY "Users access invoices in their org"
ON public.invoices FOR ALL
TO authenticated
USING (
  organization_id IN (SELECT get_user_organizations(auth.uid()))
  AND has_module_access(organization_id, 'documents')
);

-- INVOICE_ITEMS: Através da invoice
CREATE POLICY "Users access invoice items via invoice"
ON public.invoice_items FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_items.invoice_id
      AND organization_id IN (SELECT get_user_organizations(auth.uid()))
      AND has_module_access(organization_id, 'documents')
  )
);

-- PAYMENTS: Apenas da org + módulo payments ou documents
CREATE POLICY "Users access payments in their org"
ON public.payments FOR ALL
TO authenticated
USING (
  organization_id IN (SELECT get_user_organizations(auth.uid()))
  AND (
    has_module_access(organization_id, 'payments')
    OR has_module_access(organization_id, 'documents')
  )
);

-- AGT_SUBMISSIONS: Apenas da org
CREATE POLICY "Users access agt_submissions in their org"
ON public.agt_submissions FOR ALL
TO authenticated
USING (
  organization_id IN (SELECT get_user_organizations(auth.uid()))
);

-- PRODUCT_CATEGORIES: Apenas da org
CREATE POLICY "Users access categories in their org"
ON public.product_categories FOR ALL
TO authenticated
USING (
  organization_id IN (SELECT get_user_organizations(auth.uid()))
);

-- =====================================================
-- TRIGGERS PARA updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_organizations
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_organization_modules
BEFORE UPDATE ON public.organization_modules
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_branches
BEFORE UPDATE ON public.branches
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_agt_submissions
BEFORE UPDATE ON public.agt_submissions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- SEED DATA: PLANOS DE SUBSCRIÇÃO
-- =====================================================

INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, max_users, max_branches, max_invoices_per_month, features) VALUES
(
  'Starter',
  'Ideal para pequenos negócios começando',
  0,
  0,
  1,
  1,
  50,
  '{
    "modules": {
      "documents": true,
      "crm": false,
      "products": false,
      "payments": false,
      "inventory": false,
      "reports": false,
      "api": false,
      "pos": false
    },
    "limits": {
      "storage_gb": 1
    }
  }'::jsonb
),
(
  'Business',
  'Para empresas em crescimento',
  15000,
  150000,
  3,
  2,
  500,
  '{
    "modules": {
      "documents": true,
      "crm": true,
      "products": true,
      "payments": false,
      "inventory": false,
      "reports": true,
      "api": false,
      "pos": false
    },
    "limits": {
      "storage_gb": 10
    }
  }'::jsonb
),
(
  'Pro',
  'Solução completa para empresas estabelecidas',
  35000,
  350000,
  10,
  5,
  2000,
  '{
    "modules": {
      "documents": true,
      "crm": true,
      "products": true,
      "payments": true,
      "inventory": true,
      "reports": true,
      "api": false,
      "pos": true
    },
    "limits": {
      "storage_gb": 50
    }
  }'::jsonb
),
(
  'Enterprise',
  'Solução customizada sem limites',
  0,
  0,
  999,
  999,
  999999,
  '{
    "modules": {
      "documents": true,
      "crm": true,
      "products": true,
      "payments": true,
      "inventory": true,
      "reports": true,
      "api": true,
      "pos": true
    },
    "limits": {
      "storage_gb": 500
    }
  }'::jsonb
);

-- =====================================================
-- FUNÇÃO PARA CRIAR PROFILE AUTOMATICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_org_id ON public.user_roles(organization_id);
CREATE INDEX idx_organization_modules_org_id ON public.organization_modules(organization_id);
CREATE INDEX idx_organization_modules_enabled ON public.organization_modules(organization_id, is_enabled);
CREATE INDEX idx_clients_org_id ON public.clients(organization_id);
CREATE INDEX idx_products_org_id ON public.products(organization_id);
CREATE INDEX idx_invoices_org_id ON public.invoices(organization_id);
CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX idx_payments_org_id ON public.payments(organization_id);
CREATE INDEX idx_agt_submissions_org_id ON public.agt_submissions(organization_id);
CREATE INDEX idx_agt_submissions_invoice_id ON public.agt_submissions(invoice_id);