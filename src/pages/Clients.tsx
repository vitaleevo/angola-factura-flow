import { useState } from "react";
import { Users, Search, Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const mockClients = [
  {
    id: 1,
    name: "Empresa ABC Lda",
    nif: "5000123456",
    email: "contato@empresaabc.ao",
    phone: "+244 923 456 789",
    address: "Luanda, Talatona",
  },
  {
    id: 2,
    name: "Comércio XYZ",
    nif: "5000789012",
    email: "geral@comercioxyz.ao",
    phone: "+244 924 567 890",
    address: "Luanda, Maianga",
  },
  {
    id: 3,
    name: "Cliente Teste",
    nif: "5000345678",
    email: "teste@cliente.ao",
    phone: "+244 925 678 901",
    address: "Luanda, Ingombota",
  },
];

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerir a base de dados de clientes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Cliente</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo cliente
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Nome do cliente" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nif">NIF</Label>
                <Input id="nif" placeholder="5000000000" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="cliente@email.ao" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="+244 900 000 000" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Morada</Label>
                <Input id="address" placeholder="Endereço completo" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Pesquisar por nome, NIF ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>NIF</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Morada</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.nif}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      {client.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
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
    </MainLayout>
  );
}
