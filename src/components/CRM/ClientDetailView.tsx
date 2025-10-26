import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  TrendingUp,
  Calendar,
  Edit,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/contexts/OrganizationContext";

interface ClientDetailViewProps {
  clientId: number;
  onEdit: () => void;
  onClose: () => void;
}

export const ClientDetailView = ({ clientId, onEdit, onClose }: ClientDetailViewProps) => {
  const { currentOrganization } = useOrganization();
  const [client, setClient] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId && currentOrganization) {
      loadClientDetails();
    }
  }, [clientId, currentOrganization]);

  const loadClientDetails = async () => {
    setLoading(true);

    // Load client data
    const { data: clientData } = await supabase
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single();

    // Load invoices
    const { data: invoicesData } = await supabase
      .from("invoices")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(10);

    // Load payments
    const { data: paymentsData } = await supabase
      .from("payments")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(10);

    setClient(clientData);
    setInvoices(invoicesData || []);
    setPayments(paymentsData || []);
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(price);
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
  const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
  const pending = totalInvoiced - totalPaid;

  if (loading || !client) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{client.name}</h2>
          <p className="text-sm text-muted-foreground">Cliente desde {new Date(client.created_at).toLocaleDateString('pt-AO')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Total Faturado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatPrice(totalInvoiced)}</p>
            <p className="text-xs text-muted-foreground">{invoices.length} faturas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-success" />
              Total Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">{formatPrice(totalPaid)}</p>
            <p className="text-xs text-muted-foreground">{payments.length} pagamentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-warning" />
              Pendente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">{formatPrice(pending)}</p>
            <p className="text-xs text-muted-foreground">A receber</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {client.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            </div>
          )}

          {client.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground">{client.phone}</p>
              </div>
            </div>
          )}

          {client.address && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Morada</p>
                <p className="text-sm text-muted-foreground">{client.address}</p>
              </div>
            </div>
          )}

          {client.tax_number && (
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">NIF</p>
                <p className="text-sm text-muted-foreground">{client.tax_number}</p>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tipo de Cliente</span>
            <Badge variant="outline" className="capitalize">
              {client.type === 'individual' ? 'Particular' : 'Empresa'}
            </Badge>
          </div>

          {client.credit_limit > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Limite de Crédito</span>
              <span className="text-sm text-muted-foreground">
                {formatPrice(client.credit_limit)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Prazo de Pagamento</span>
            <span className="text-sm text-muted-foreground">
              {client.payment_terms} dias
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="invoices" className="flex-1">
            Faturas ({invoices.length})
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex-1">
            Pagamentos ({payments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Faturas</CardTitle>
              <CardDescription>
                Últimas faturas emitidas para este cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma fatura encontrada
                </p>
              ) : (
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{invoice.invoice_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(invoice.issue_date).toLocaleDateString('pt-AO')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatPrice(invoice.total_amount)}
                        </p>
                        <Badge
                          variant={
                            invoice.status === 'paid' ? 'default' :
                            invoice.status === 'overdue' ? 'destructive' :
                            'secondary'
                          }
                          className="text-xs"
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>
                Últimos pagamentos recebidos deste cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum pagamento encontrado
                </p>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{payment.payment_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payment.payment_date).toLocaleDateString('pt-AO')} • {payment.payment_method}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-success">
                          {formatPrice(payment.amount)}
                        </p>
                        <Badge
                          variant={payment.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
