import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/contexts/OrganizationContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Client {
  id: number;
  name: string;
  tax_number: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  type: string;
}

export default function Clients() {
  const { currentOrganization } = useOrganization();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    tax_number: "",
    email: "",
    phone: "",
    address: "",
    type: "individual",
  });

  useEffect(() => {
    if (currentOrganization) {
      loadClients();
    }
  }, [currentOrganization]);

  const loadClients = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("organization_id", currentOrganization.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar clientes: " + error.message);
      console.error("Error loading clients:", error);
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!currentOrganization || !formData.name || !formData.email) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const clientData = {
      ...formData,
      organization_id: currentOrganization.id,
      user_id: 1, // TODO: Replace with actual user ID when auth is fully integrated
    };

    if (editingClient) {
      const { error } = await supabase
        .from("clients")
        .update(clientData)
        .eq("id", editingClient.id);

      if (error) {
        toast.error("Erro ao atualizar cliente: " + error.message);
      } else {
        toast.success("Cliente atualizado com sucesso!");
        setIsDialogOpen(false);
        resetForm();
        loadClients();
      }
    } else {
      const { error } = await supabase
        .from("clients")
        .insert(clientData);

      if (error) {
        toast.error("Erro ao criar cliente: " + error.message);
      } else {
        toast.success("Cliente criado com sucesso!");
        setIsDialogOpen(false);
        resetForm();
        loadClients();
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteClient) return;

    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", deleteClient.id);

    if (error) {
      toast.error("Erro ao excluir cliente: " + error.message);
    } else {
      toast.success("Cliente excluído com sucesso!");
      setDeleteClient(null);
      loadClients();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      tax_number: "",
      email: "",
      phone: "",
      address: "",
      type: "individual",
    });
    setEditingClient(null);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      tax_number: client.tax_number || "",
      email: client.email,
      phone: client.phone || "",
      address: client.address || "",
      type: client.type,
    });
    setIsDialogOpen(true);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.tax_number && client.tax_number.includes(searchQuery))
  );

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
              <Users className="w-8 h-8 text-primary" />
              Clientes
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerir a base de dados de clientes
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? "Editar Cliente" : "Adicionar Cliente"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do cliente
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    placeholder="Nome do cliente"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tax_number">NIF</Label>
                  <Input
                    id="tax_number"
                    placeholder="5000000000"
                    value={formData.tax_number}
                    onChange={(e) => setFormData({ ...formData, tax_number: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="cliente@email.ao"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="+244 900 000 000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Morada</Label>
                  <Input
                    id="address"
                    placeholder="Endereço completo"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
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
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Carregando...</p>
              </div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Nenhum cliente encontrado</p>
            </div>
          ) : (
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
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.tax_number || "-"}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{client.address || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(client)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteClient(client)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteClient} onOpenChange={(open) => !open && setDeleteClient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cliente "{deleteClient?.name}" será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
