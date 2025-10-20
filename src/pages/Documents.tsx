import { useState } from "react";
import { FileText, Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";
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

const mockDocuments = [
  {
    id: "FT 2025/001",
    type: "FT",
    client: "Empresa ABC Lda",
    date: "2025-03-15",
    total: "150.000,00 Kz",
    status: "Registado",
  },
  {
    id: "FT 2025/002",
    type: "FT",
    client: "Comércio XYZ",
    date: "2025-03-14",
    total: "89.500,00 Kz",
    status: "Registado",
  },
  {
    id: "FR 2025/001",
    type: "FR",
    client: "Cliente Teste",
    date: "2025-03-14",
    total: "45.000,00 Kz",
    status: "Pendente",
  },
  {
    id: "NC 2025/001",
    type: "NC",
    client: "Empresa ABC Lda",
    date: "2025-03-13",
    total: "12.000,00 Kz",
    status: "Rejeitado",
  },
];

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      Registado: "default",
      Pendente: "secondary",
      Rejeitado: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            Documentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerir todos os documentos fiscais emitidos
          </p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Novo Documento
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Pesquisar por número, cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="FT">Fatura (FT)</SelectItem>
            <SelectItem value="FR">Fatura Recibo (FR)</SelectItem>
            <SelectItem value="NC">Nota de Crédito (NC)</SelectItem>
            <SelectItem value="ND">Nota de Débito (ND)</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.id}</TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.type}</Badge>
                </TableCell>
                <TableCell>{doc.client}</TableCell>
                <TableCell>{doc.date}</TableCell>
                <TableCell>{doc.total}</TableCell>
                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
