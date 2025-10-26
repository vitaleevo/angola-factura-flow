import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { useAuth } from "@/contexts/AuthContext";

interface ModuleGuardProps {
  moduleKey: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const ModuleGuard = ({ moduleKey, children, fallback }: ModuleGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { hasAccess, loading: moduleLoading } = useModuleAccess(moduleKey);

  if (authLoading || moduleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground mb-4">
            Você não tem permissão para acessar este módulo. Entre em contato com o administrador da sua organização.
          </p>
          <a href="/" className="text-primary hover:underline">
            Voltar ao Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
