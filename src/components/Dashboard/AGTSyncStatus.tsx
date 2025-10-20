import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const AGTSyncStatus = () => {
  const syncProgress = 85;
  const pendingDocs = 3;
  const syncedToday = 42;

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Sincronização AGT</h3>
            <p className="text-xs text-muted-foreground">Estado da conexão</p>
          </div>
        </div>
        <Button size="sm" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Sincronizar
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progresso de sincronização</span>
            <span className="text-sm font-semibold text-foreground">{syncProgress}%</span>
          </div>
          <Progress value={syncProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Sincronizados hoje</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{syncedToday}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Pendentes</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{pendingDocs}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Última sincronização</span>
            <span className="font-medium text-foreground">Há 5 minutos</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
