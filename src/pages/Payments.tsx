import { useState, useEffect } from "react";
import { CreditCard, Search, Filter, CheckCircle, Clock, XCircle } from "lucide-react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/contexts/OrganizationContext";
import { toast } from "sonner";

interface Payment {
  id: number;
  payment_number: string;
  invoice_id: number;
  client_id: number;
  amount: number;
  payment_method: string;
  transaction_id: string | null;
  payment_date: string;
  status: string;
  clients: {
    name: string;
  };
  invoices: {
    invoice_number: string;
  };
}

export default function Payments() {
  const { currentOrganization } = useOrganization();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (currentOrganization) {
      loadPayments();
    }
  }, [currentOrganization]);

  const loadPayments = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        clients (
          name
        ),
        invoices (
          invoice_number
        )
      `)
      .eq("organization_id", currentOrganization.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar pagamentos: " + error.message);
      console.error("Error loading payments:", error);
    } else {
      setPayments(data || []);
    }
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-AO');
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive"; icon: any }> = {
      completed: { label: "Confirmado", variant: "default", icon: CheckCircle },
      pending: { label: "Pendente", variant: "secondary", icon: Clock },
      failed: { label: "Falhado", variant: "destructive", icon: XCircle },
    };

    const { label, variant, icon: Icon } = config[status] || { label: status, variant: "default" as const, icon: CheckCircle };

    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.payment_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.clients.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoices.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.transaction_id && payment.transaction_id.includes(searchQuery));
    
    const matchesFilter = filterStatus === "all" || payment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const todayPayments = payments.filter(p => {
    const today = new Date().toDateString();
    return new Date(p.payment_date).toDateString() === today;
  }).reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  const confirmationRate = payments.length > 0
    ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100)
    : 0;

  const stats = [
    {
      title: "Pagamentos Hoje",
      value: formatPrice(todayPayments),
      icon: CheckCircle,
      color: "text-primary",
    },
    {
      title: "Pendentes",
      value: formatPrice(pendingPayments),
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Taxa de Confirmação",
      value: `${confirmationRate}%`,
      icon: CreditCard,
      color: "text-primary",
    },
  ];

  if (!currentOrganization) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Selecione uma organização</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-primary" />
              Pagamentos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerir e conciliar pagamentos de faturas
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Pesquisar por fatura, cliente ou referência..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Confirmado</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="failed">Falhado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border bg-card">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Carregando...</p>
              </div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Nenhum pagamento encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fatura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Referência</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.payment_number}</TableCell>
                    <TableCell>{payment.invoices.invoice_number}</TableCell>
                    <TableCell>{payment.clients.name}</TableCell>
                    <TableCell>{formatPrice(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.payment_method}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {payment.transaction_id || "-"}
                    </TableCell>
                    <TableCell>{formatDate(payment.payment_date)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
