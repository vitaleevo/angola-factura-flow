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
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Documentos", href: "/documentos", icon: FileText },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Produtos", href: "/produtos", icon: Package },
    { name: "Pagamentos", href: "/pagamentos", icon: CreditCard },
    { name: "Sincronização AGT", href: "/agt", icon: Cloud },
    { name: "Centro de Erros", href: "/centro-erros", icon: AlertCircle },
    { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

      <div className="px-6 py-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start p-0 h-auto hover:bg-transparent"
          onClick={() => navigate('/perfil')}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium text-foreground">AC</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin Conta</p>
              <p className="text-xs text-muted-foreground truncate">admin@empresa.ao</p>
            </div>
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
        </Button>
      </div>
    </aside>
  );
};
