import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, Clock, XCircle } from "lucide-react";

const documents = [
  { id: "FT2025/001", type: "FT", client: "Cliente Exemplo Lda", amount: "125.000,00 Kz", status: "aceite", date: "2025-01-15" },
  { id: "FT2025/002", type: "FT", client: "Empresa ABC", amount: "89.500,00 Kz", status: "pendente", date: "2025-01-15" },
  { id: "FR2025/001", type: "FR", client: "Serviços XYZ", amount: "45.000,00 Kz", status: "aceite", date: "2025-01-14" },
  { id: "FT2025/003", type: "FT", client: "Comércio 123", amount: "210.000,00 Kz", status: "rejeitado", date: "2025-01-14" },
  { id: "NC2025/001", type: "NC", client: "Cliente Exemplo Lda", amount: "25.000,00 Kz", status: "aceite", date: "2025-01-13" },
];

const statusConfig = {
  aceite: { label: "Aceite", icon: CheckCircle2, color: "text-success bg-success/10" },
  pendente: { label: "Pendente", icon: Clock, color: "text-warning bg-warning/10" },
  rejeitado: { label: "Rejeitado", icon: XCircle, color: "text-destructive bg-destructive/10" },
};

export const RecentDocuments = () => {
  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Documentos Recentes</h3>
        <Badge variant="secondary">Últimos 7 dias</Badge>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => {
          const status = statusConfig[doc.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;
          
          return (
            <div
              key={doc.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-foreground">{doc.id}</p>
                  <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{doc.client}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-foreground mb-1">{doc.amount}</p>
                <div className={`flex items-center gap-1 text-xs font-medium ${status.color} rounded-full px-2 py-0.5`}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
