import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/contexts/OrganizationContext";

interface Invoice {
  id: number;
  invoice_number: string;
  total_amount: number;
  status: string;
  issue_date: string;
  clients: {
    name: string;
  };
}

const statusConfig = {
  draft: { label: "Rascunho", icon: Clock, color: "text-muted-foreground bg-muted" },
  sent: { label: "Enviado", icon: Clock, color: "text-warning bg-warning/10" },
  paid: { label: "Pago", icon: CheckCircle2, color: "text-success bg-success/10" },
  overdue: { label: "Atrasado", icon: XCircle, color: "text-destructive bg-destructive/10" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-muted-foreground bg-muted" },
};

export const RecentDocuments = () => {
  const { currentOrganization } = useOrganization();
  const [documents, setDocuments] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentOrganization) {
      loadRecentDocuments();
    }
  }, [currentOrganization]);

  const loadRecentDocuments = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        clients (
          name
        )
      `)
      .eq("organization_id", currentOrganization.id)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error loading recent documents:", error);
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(price);
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Documentos Recentes</h3>
        <Badge variant="secondary">Últimos 7 dias</Badge>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Carregando...</p>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-sm text-muted-foreground">Nenhum documento recente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => {
            const status = statusConfig[doc.status as keyof typeof statusConfig] || statusConfig.draft;
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
                    <p className="text-sm font-semibold text-foreground">{doc.invoice_number}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{doc.clients.name}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground mb-1">{formatPrice(doc.total_amount)}</p>
                  <div className={`flex items-center gap-1 text-xs font-medium ${status.color} rounded-full px-2 py-0.5`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
