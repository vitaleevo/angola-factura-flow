import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  Settings, 
  Cloud,
  CreditCard,
  AlertCircle,
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/contexts/OrganizationContext";

// Module configuration - maps routes to required modules
const navigationConfig = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, module: null },
  { name: "Documentos", href: "/documentos", icon: FileText, module: "documents" },
  { name: "Clientes", href: "/clientes", icon: Users, module: "crm" },
  { name: "Produtos", href: "/produtos", icon: Package, module: "products" },
  { name: "Pagamentos", href: "/pagamentos", icon: CreditCard, module: "payments" },
  { name: "Sincronização AGT", href: "/agt", icon: Cloud, module: "agt_sync" },
  { name: "Centro de Erros", href: "/centro-erros", icon: AlertCircle, module: "error_center" },
  { name: "Configurações", href: "/configuracoes", icon: Settings, module: null },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { currentOrganization, enabledModules } = useOrganization();

  // Filter navigation based on enabled modules
  const navigation = navigationConfig.filter((item) => {
    if (!item.module) return true; // Always show items without module requirement
    return enabledModules.has(item.module);
  });

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-card border-r border-border">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">eFactura AO</h1>
          <p className="text-xs text-muted-foreground">Sistema de Faturação</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => navigate('/perfil')}
        >
          <User className="w-4 h-4 mr-2" />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.email?.split('@')[0] || 'Usuário'}
            </p>
            {currentOrganization && (
              <p className="text-xs text-muted-foreground truncate">
                {currentOrganization.name}
              </p>
            )}
          </div>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </aside>
  );
};
