import { Button } from "@/components/ui/button";
import { Bell, Menu, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isOnline] = useState(true);

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex-1" />

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
