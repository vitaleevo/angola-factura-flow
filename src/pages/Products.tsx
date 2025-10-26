import { useState } from "react";
import { Package, Search, Plus, Edit, Trash2 } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockProducts = [
  {
    id: 1,
    code: "PROD001",
    name: "Serviço de Consultoria",
    price: "50.000,00 Kz",
    tax: "14%",
    unit: "Hora",
    stock: "-",
  },
  {
    id: 2,
    code: "PROD002",
    name: "Licença de Software",
    price: "250.000,00 Kz",
    tax: "14%",
    unit: "Unidade",
    stock: "Ilimitado",
  },
  {
    id: 3,
    code: "PROD003",
    name: "Produto Material",
    price: "15.000,00 Kz",
    tax: "14%",
    unit: "Unidade",
    stock: "150",
  },
];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" />
            Produtos e Serviços
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerir o catálogo de produtos e serviços
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Produto/Serviço</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo produto ou serviço
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Código</Label>
                <Input id="code" placeholder="PROD001" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="productName">Nome</Label>
                <Input id="productName" placeholder="Nome do produto/serviço" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Preço (Kz)</Label>
                  <Input id="price" type="number" placeholder="0.00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tax">Taxa IVA</Label>
                  <Select defaultValue="14">
                    <SelectTrigger id="tax">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Isento (0%)</SelectItem>
                      <SelectItem value="14">Normal (14%)</SelectItem>
                      <SelectItem value="7">Reduzida (7%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unidade</Label>
                <Select defaultValue="un">
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un">Unidade</SelectItem>
                    <SelectItem value="hora">Hora</SelectItem>
                    <SelectItem value="kg">Quilograma</SelectItem>
                    <SelectItem value="m">Metro</SelectItem>
                  </SelectContent>
                </Select>
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
          placeholder="Pesquisar por código ou nome..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>IVA</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Badge variant="outline">{product.code}</Badge>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.tax}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>{product.stock}</TableCell>
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
