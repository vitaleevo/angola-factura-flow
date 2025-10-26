import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface Organization {
  id: string;
  name: string;
  email: string;
  nif: string | null;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
}

interface UserRole {
  role: string;
  organization_id: string;
}

interface OrganizationModule {
  module_key: string;
  is_enabled: boolean;
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  userRole: string | null;
  enabledModules: Set<string>;
  loading: boolean;
  switchOrganization: (orgId: string) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [enabledModules, setEnabledModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCurrentOrganization(null);
      setOrganizations([]);
      setUserRole(null);
      setEnabledModules(new Set());
      setLoading(false);
      return;
    }

    loadOrganizationData();
  }, [user]);

  const loadOrganizationData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load user's profile to get default organization
      const { data: profile } = await supabase
        .from("profiles")
        .select("default_organization_id")
        .eq("id", user.id)
        .single();

      // Load user roles
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role, organization_id")
        .eq("user_id", user.id);

      if (!roles || roles.length === 0) {
        setLoading(false);
        return;
      }

      // Get organization IDs
      const orgIds = roles.map((r: UserRole) => r.organization_id);

      // Load organizations
      const { data: orgs } = await supabase
        .from("organizations")
        .select("*")
        .in("id", orgIds)
        .eq("is_active", true);

      setOrganizations(orgs || []);

      // Set current organization (default or first)
      const defaultOrgId = profile?.default_organization_id;
      const currentOrg = defaultOrgId
        ? orgs?.find((o: Organization) => o.id === defaultOrgId)
        : orgs?.[0];

      if (currentOrg) {
        await setCurrentOrganizationData(currentOrg, roles);
      }
    } catch (error) {
      console.error("Error loading organization data:", error);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentOrganizationData = async (org: Organization, roles: UserRole[]) => {
    setCurrentOrganization(org);

    // Set user role for this organization
    const role = roles.find((r: UserRole) => r.organization_id === org.id);
    setUserRole(role?.role || null);

    // Load enabled modules for this organization
    const { data: modules } = await supabase
      .from("organization_modules")
      .select("module_key, is_enabled")
      .eq("organization_id", org.id)
      .eq("is_enabled", true);

    const moduleKeys = new Set(modules?.map((m: OrganizationModule) => m.module_key) || []);
    setEnabledModules(moduleKeys);
  };

  const switchOrganization = async (orgId: string) => {
    const org = organizations.find((o) => o.id === orgId);
    if (!org || !user) return;

    // Update default organization in profile
    await supabase
      .from("profiles")
      .update({ default_organization_id: orgId })
      .eq("id", user.id);

    // Reload organization data
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role, organization_id")
      .eq("user_id", user.id);

    if (roles) {
      await setCurrentOrganizationData(org, roles);
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        organizations,
        userRole,
        enabledModules,
        loading,
        switchOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
};
