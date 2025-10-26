import { Button } from "@/components/ui/button";
import { Bell, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useOrganization } from "@/contexts/OrganizationContext";

export const Header = () => {
  const [isOnline] = useState(true);
  const { currentOrganization } = useOrganization();

  return (
    <header className="h-16 border-b border-border bg-card px-4 lg:px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        {currentOrganization && (
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">
              {currentOrganization.name}
            </p>
            {currentOrganization.nif && (
              <p className="text-xs text-muted-foreground">
                NIF: {currentOrganization.nif}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-secondary-foreground">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-warning" />
              <span className="text-xs font-medium text-secondary-foreground">Offline</span>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};
