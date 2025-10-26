import { useState } from "react";
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

const mockPayments = [
  {
    id: 1,
    invoice: "FT 2025/001",
    client: "Empresa ABC Lda",
    amount: "150.000,00 Kz",
    method: "ProxyPay",
    reference: "999 888 777",
    date: "2025-03-15",
    status: "Confirmado",
  },
  {
    id: 2,
    invoice: "FT 2025/002",
    client: "Comércio XYZ",
    amount: "89.500,00 Kz",
    method: "Multicaixa Express",
    reference: "+244 923 456 789",
    date: "2025-03-14",
    status: "Pendente",
  },
  {
    id: 3,
    invoice: "FR 2025/001",
    client: "Cliente Teste",
    amount: "45.000,00 Kz",
    method: "Transferência",
    reference: "-",
    date: "2025-03-14",
    status: "Confirmado",
  },
];

const stats = [
  {
    title: "Pagamentos Hoje",
    value: "284.500,00 Kz",
    icon: CheckCircle,
    color: "text-primary",
  },
  {
    title: "Pendentes",
    value: "89.500,00 Kz",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    title: "Taxa de Confirmação",
    value: "94%",
    icon: CreditCard,
    color: "text-primary",
  },
];

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive"; icon: any }> = {
      Confirmado: { variant: "default", icon: CheckCircle },
      Pendente: { variant: "secondary", icon: Clock },
      Falhado: { variant: "destructive", icon: XCircle },
    };

    const { variant, icon: Icon } = config[status] || { variant: "default" as const, icon: CheckCircle };

    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

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
            <SelectItem value="confirmed">Confirmado</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="failed">Falhado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
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
            {mockPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.invoice}</TableCell>
                <TableCell>{payment.client}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  <Badge variant="outline">{payment.method}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {payment.reference}
                </TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </MainLayout>
  );
}
