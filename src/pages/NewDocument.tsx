import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Send, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/contexts/OrganizationContext";
import { toast } from "sonner";

// Validation schema
const lineItemSchema = z.object({
  product_id: z.number().nullable(),
  description: z.string().min(1, "Descrição obrigatória"),
  quantity: z.number().min(0.01, "Quantidade mínima: 0.01"),
  unit_price: z.number().min(0, "Preço não pode ser negativo"),
  tax_rate: z.number().min(0).max(100),
  discount_rate: z.number().min(0).max(100).default(0),
});

const invoiceSchema = z.object({
  client_id: z.number({ required_error: "Selecione um cliente" }),
  issue_date: z.string().min(1, "Data obrigatória"),
  due_date: z.string().min(1, "Data de vencimento obrigatória"),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(lineItemSchema).min(1, "Adicione pelo menos um item"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function NewDocument() {
  const navigate = useNavigate();
  const { currentOrganization } = useOrganization();
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          product_id: null,
          description: "",
          quantity: 1,
          unit_price: 0,
          tax_rate: 14,
          discount_rate: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  useEffect(() => {
    if (currentOrganization) {
      loadClients();
      loadProducts();
    }
  }, [currentOrganization]);

  const loadClients = async () => {
    if (!currentOrganization) return;

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("organization_id", currentOrganization.id)
      .order("name");

    if (error) {
      console.error("Error loading clients:", error);
    } else {
      setClients(data || []);
    }
  };

  const loadProducts = async () => {
    if (!currentOrganization) return;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("organization_id", currentOrganization.id)
      .order("name");

    if (error) {
      console.error("Error loading products:", error);
    } else {
      setProducts(data || []);
    }
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find((p) => p.id === parseInt(productId));
    if (product) {
      setValue(`items.${index}.product_id`, product.id);
      setValue(`items.${index}.description`, product.name);
      setValue(`items.${index}.unit_price`, product.price);
      setValue(`items.${index}.tax_rate`, product.tax_rate);
    }
  };

  const calculateLineTotal = (item: any) => {
    const subtotal = item.quantity * item.unit_price;
    const discountAmount = subtotal * (item.discount_rate / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (item.tax_rate / 100);
    return subtotalAfterDiscount + taxAmount;
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    watchItems.forEach((item) => {
      const lineSubtotal = item.quantity * item.unit_price;
      const discountAmount = lineSubtotal * (item.discount_rate / 100);
      const subtotalAfterDiscount = lineSubtotal - discountAmount;
      const taxAmount = subtotalAfterDiscount * (item.tax_rate / 100);

      subtotal += lineSubtotal;
      totalDiscount += discountAmount;
      totalTax += taxAmount;
    });

    const total = subtotal - totalDiscount + totalTax;

    return { subtotal, totalDiscount, totalTax, total };
  };

  const totals = calculateTotals();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(price);
  };

  const onSubmit = async (data: InvoiceFormData) => {
    if (!currentOrganization) return;

    setLoading(true);

    try {
      // Generate invoice number
      const year = new Date().getFullYear();
      const { count } = await supabase
        .from("invoices")
        .select("*", { count: 'exact', head: true })
        .eq("organization_id", currentOrganization.id)
        .like("invoice_number", `FT ${year}/%`);

      const invoiceNumber = `FT ${year}/${String((count || 0) + 1).padStart(4, '0')}`;

      // Create invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: invoiceNumber,
          client_id: data.client_id,
          organization_id: currentOrganization.id,
          user_id: 1, // TODO: Use actual user ID
          issue_date: data.issue_date,
          due_date: data.due_date,
          payment_method: data.payment_method || null,
          notes: data.notes || null,
          currency: "AOA",
          subtotal: totals.subtotal,
          discount_amount: totals.totalDiscount,
          tax_amount: totals.totalTax,
          total_amount: totals.total,
          status: "draft",
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create invoice items
      const items = data.items.map((item) => {
        const lineSubtotal = item.quantity * item.unit_price;
        const discountAmount = lineSubtotal * (item.discount_rate / 100);
        const subtotalAfterDiscount = lineSubtotal - discountAmount;
        const taxAmount = subtotalAfterDiscount * (item.tax_rate / 100);

        return {
          invoice_id: invoice.id,
          product_id: item.product_id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate,
          tax_amount: taxAmount,
          discount_rate: item.discount_rate,
          discount_amount: discountAmount,
          total_price: subtotalAfterDiscount + taxAmount,
        };
      });

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(items);

      if (itemsError) throw itemsError;

      toast.success("Documento criado com sucesso!");
      navigate("/documentos");
    } catch (error: any) {
      toast.error("Erro ao criar documento: " + error.message);
      console.error("Error creating invoice:", error);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/documentos")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Novo Documento</h1>
            <p className="text-muted-foreground mt-1">Emissão de fatura eletrónica</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-6 shadow-card space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="client_id">Cliente *</Label>
                <Select
                  onValueChange={(value) => setValue("client_id", parseInt(value))}
                >
                  <SelectTrigger id="client_id">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.client_id && (
                  <p className="text-sm text-destructive">{errors.client_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Forma de Pagamento</Label>
                <Select
                  onValueChange={(value) => setValue("payment_method", value)}
                >
                  <SelectTrigger id="payment_method">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="transfer">Transferência</SelectItem>
                    <SelectItem value="multicaixa">Multicaixa Express</SelectItem>
                    <SelectItem value="proxypay">ProxyPay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="issue_date">Data de Emissão *</Label>
                <Input
                  id="issue_date"
                  type="date"
                  {...register("issue_date")}
                />
                {errors.issue_date && (
                  <p className="text-sm text-destructive">{errors.issue_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Data de Vencimento *</Label>
                <Input
                  id="due_date"
                  type="date"
                  {...register("due_date")}
                />
                {errors.due_date && (
                  <p className="text-sm text-destructive">{errors.due_date.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4 border border-border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Linhas do Documento</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      product_id: null,
                      description: "",
                      quantity: 1,
                      unit_price: 0,
                      tax_rate: 14,
                      discount_rate: 0,
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Linha
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid gap-4 p-4 border border-border rounded-lg bg-background"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Linha {index + 1}</span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label>Produto</Label>
                        <Select
                          onValueChange={(value) => handleProductSelect(index, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um produto (opcional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                {product.name} - {formatPrice(product.price)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Descrição *</Label>
                        <Input
                          {...register(`items.${index}.description`)}
                          placeholder="Descrição do item"
                        />
                        {errors.items?.[index]?.description && (
                          <p className="text-sm text-destructive">
                            {errors.items[index]?.description?.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Quantidade *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Preço Unitário *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.unit_price`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>IVA (%)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.tax_rate`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Desconto (%)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.discount_rate`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total da linha</p>
                          <p className="text-lg font-bold text-foreground">
                            {formatPrice(calculateLineTotal(watchItems[index]))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.items && !Array.isArray(errors.items) && (
                <p className="text-sm text-destructive">{errors.items.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Notas adicionais (opcional)"
                rows={3}
              />
            </div>

            <div className="border-t pt-6">
              <div className="space-y-2 max-w-sm ml-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto:</span>
                  <span className="font-medium text-destructive">
                    -{formatPrice(totals.totalDiscount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA:</span>
                  <span className="font-medium">{formatPrice(totals.totalTax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(totals.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/documentos")}>
                Cancelar
              </Button>
              <Button type="submit" variant="outline" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Rascunho
              </Button>
              <Button type="submit" disabled={loading}>
                <Send className="w-4 h-4 mr-2" />
                {loading ? "A criar..." : "Criar Documento"}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}
