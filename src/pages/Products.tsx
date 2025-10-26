import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  tax_rate: number;
  unit: string;
  stock_quantity: number;
  type: string;
  sku: string | null;
}

export default function Products() {
  const { currentOrganization } = useOrganization();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    tax_rate: "14",
    unit: "un",
    type: "product",
    sku: "",
  });

  useEffect(() => {
    if (currentOrganization) {
      loadProducts();
    }
  }, [currentOrganization]);

  const loadProducts = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("organization_id", currentOrganization.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar produtos: " + error.message);
      console.error("Error loading products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!currentOrganization || !formData.name || !formData.price) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      tax_rate: parseFloat(formData.tax_rate),
      unit: formData.unit,
      type: formData.type,
      sku: formData.sku || null,
      organization_id: currentOrganization.id,
      user_id: 1, // TODO: Replace with actual user ID
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("Erro ao atualizar produto: " + error.message);
      } else {
        toast.success("Produto atualizado com sucesso!");
        setIsDialogOpen(false);
        resetForm();
        loadProducts();
      }
    } else {
      const { error } = await supabase
        .from("products")
        .insert(productData);

      if (error) {
        toast.error("Erro ao criar produto: " + error.message);
      } else {
        toast.success("Produto criado com sucesso!");
        setIsDialogOpen(false);
        resetForm();
        loadProducts();
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", deleteProduct.id);

    if (error) {
      toast.error("Erro ao excluir produto: " + error.message);
    } else {
      toast.success("Produto excluído com sucesso!");
      setDeleteProduct(null);
      loadProducts();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      tax_rate: "14",
      unit: "un",
      type: "product",
      sku: "",
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      tax_rate: product.tax_rate.toString(),
      unit: product.unit,
      type: product.type,
      sku: product.sku || "",
    });
    setIsDialogOpen(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(price);
  };

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
              <Package className="w-8 h-8 text-primary" />
              Produtos e Serviços
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerir o catálogo de produtos e serviços
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Editar Produto/Serviço" : "Adicionar Produto/Serviço"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do produto ou serviço
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Produto</SelectItem>
                      <SelectItem value="service">Serviço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sku">Código/SKU</Label>
                  <Input
                    id="sku"
                    placeholder="PROD001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="productName">Nome *</Label>
                  <Input
                    id="productName"
                    placeholder="Nome do produto/serviço"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descrição detalhada"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Preço (Kz) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tax">Taxa IVA</Label>
                    <Select value={formData.tax_rate} onValueChange={(value) => setFormData({ ...formData, tax_rate: value })}>
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
                  <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                    <SelectTrigger id="unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="un">Unidade</SelectItem>
                      <SelectItem value="hora">Hora</SelectItem>
                      <SelectItem value="kg">Quilograma</SelectItem>
                      <SelectItem value="m">Metro</SelectItem>
                      <SelectItem value="m2">Metro Quadrado</SelectItem>
                      <SelectItem value="l">Litro</SelectItem>
                    </SelectContent>
                  </Select>
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
            placeholder="Pesquisar por código ou nome..."
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
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>IVA</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Badge variant="outline">{product.sku || "-"}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant={product.type === 'service' ? 'secondary' : 'default'}>
                        {product.type === 'service' ? 'Serviço' : 'Produto'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{product.tax_rate}%</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteProduct(product)}
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

      <AlertDialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto "{deleteProduct?.name}" será permanentemente excluído.
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
