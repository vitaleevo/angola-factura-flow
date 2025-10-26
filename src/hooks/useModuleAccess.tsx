import { useOrganization } from "@/contexts/OrganizationContext";

export const useModuleAccess = (moduleKey: string) => {
  const { enabledModules, loading } = useOrganization();

  return {
    hasAccess: enabledModules.has(moduleKey),
    loading,
  };
};
