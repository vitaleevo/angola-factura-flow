import { Cloud, RefreshCw, CheckCircle, XCircle, Clock, Key, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { MainLayout } from "@/components/Layout/MainLayout";

const syncHistory = [
  {
    id: 1,
    document: "FT 2025/001",
    date: "2025-03-15 14:30",
    status: "Sucesso",
    hash: "a3f5k9...",
    attempts: 1,
  },
  {
    id: 2,
    document: "FT 2025/002",
    date: "2025-03-14 16:45",
    status: "Sucesso",
    hash: "b7k2m1...",
    attempts: 1,
  },
  {
    id: 3,
    document: "FR 2025/001",
    date: "2025-03-14 10:20",
    status: "Pendente",
    hash: "-",
    attempts: 2,
  },
  {
    id: 4,
    document: "NC 2025/001",
    date: "2025-03-13 09:15",
    status: "Falhado",
    hash: "-",
    attempts: 3,
  },
];

export default function AGTSync() {
  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive"; icon: any }> = {
      Sucesso: { variant: "default", icon: CheckCircle },
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
            <Cloud className="w-8 h-8 text-primary" />
            Sincronização AGT
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerir submissões e registo de documentos na AGT
          </p>
        </div>
        <Button>
          <RefreshCw className="w-4 h-4 mr-2" />
          Sincronizar Agora
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estado da Conexão
            </CardTitle>
            <Server className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              Conectado
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Última sincronização há 5 minutos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Sucesso
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <Progress value={98} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Certificado Digital
            </CardTitle>
            <Key className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ativo</div>
            <p className="text-xs text-muted-foreground mt-1">
              Válido até 31/12/2025
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração de Chaves</CardTitle>
          <CardDescription>
            Gerir certificados digitais e chaves de assinatura JWS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">Certificado Software</p>
              <p className="text-sm text-muted-foreground">
                Assinatura de aplicação (JWS)
              </p>
            </div>
            <Badge>Configurado</Badge>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">Certificado Documento</p>
              <p className="text-sm text-muted-foreground">
                Assinatura de faturas
              </p>
            </div>
            <Badge>Configurado</Badge>
          </div>
          <Button variant="outline" className="w-full">
            <Key className="w-4 h-4 mr-2" />
            Gerir Certificados
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Submissões</CardTitle>
          <CardDescription>
            Documentos enviados para registo na AGT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Hash AGT</TableHead>
                <TableHead>Tentativas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {syncHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.document}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.hash}
                  </TableCell>
                  <TableCell>{item.attempts}x</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </MainLayout>
  );
}
