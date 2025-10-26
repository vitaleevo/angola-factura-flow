
-- Adicionar unique constraint em user_roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_org_unique'
  ) THEN
    ALTER TABLE public.user_roles 
    ADD CONSTRAINT user_roles_user_org_unique 
    UNIQUE (user_id, organization_id);
  END IF;
END $$;

-- Configurar usuário VITALEEVO como super_admin
DO $$
DECLARE
  v_org_id uuid;
  v_user_id uuid := '2b10ac46-18aa-402f-a81c-9e5045a7e25a';
BEGIN
  -- Criar organização se não existir
  IF NOT EXISTS (SELECT 1 FROM public.organizations WHERE email = 'negociosvitaleevo@gmail.com') THEN
    INSERT INTO public.organizations (name, email, is_active)
    VALUES ('VITALEEVO', 'negociosvitaleevo@gmail.com', true)
    RETURNING id INTO v_org_id;
  ELSE
    SELECT id INTO v_org_id FROM public.organizations WHERE email = 'negociosvitaleevo@gmail.com';
  END IF;
  
  -- Atualizar perfil
  UPDATE public.profiles 
  SET default_organization_id = v_org_id
  WHERE id = v_user_id;
  
  -- Remover role existente se houver
  DELETE FROM public.user_roles WHERE user_id = v_user_id AND organization_id = v_org_id;
  
  -- Atribuir super_admin
  INSERT INTO public.user_roles (user_id, organization_id, role)
  VALUES (v_user_id, v_org_id, 'super_admin');
  
  -- Habilitar todos os módulos
  DELETE FROM public.organization_modules WHERE organization_id = v_org_id;
  
  INSERT INTO public.organization_modules (organization_id, module_key, is_enabled, enabled_at)
  VALUES 
    (v_org_id, 'documents', true, now()),
    (v_org_id, 'crm', true, now()),
    (v_org_id, 'products', true, now()),
    (v_org_id, 'payments', true, now()),
    (v_org_id, 'inventory', true, now()),
    (v_org_id, 'pos', true, now()),
    (v_org_id, 'reports', true, now()),
    (v_org_id, 'api', true, now());
END $$;
