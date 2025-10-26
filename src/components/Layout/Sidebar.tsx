import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
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

export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { currentOrganization, enabledModules } = useOrganization();
  const { state } = useSidebar();

  // Filter navigation based on enabled modules
  const navigation = navigationConfig.filter((item) => {
    if (!item.module) return true;
    return enabledModules.has(item.module);
  });

  const isCollapsed = state === "collapsed";
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;

  const getNavClass = (active: boolean) =>
    active ? "bg-primary text-primary-foreground" : "hover:bg-secondary";

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 px-2 py-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-sm font-bold text-foreground">eFactura AO</h1>
                <p className="text-xs text-muted-foreground">Sistema de Faturação</p>
              </div>
            )}
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.href}
                      end
                      className={({ isActive }) => getNavClass(isActive)}
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate('/perfil')}>
              <User className="w-4 h-4" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate">
                    {user?.email?.split('@')[0] || 'Usuário'}
                  </p>
                  {currentOrganization && (
                    <p className="text-xs text-muted-foreground truncate">
                      {currentOrganization.name}
                    </p>
                  )}
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  );
};
