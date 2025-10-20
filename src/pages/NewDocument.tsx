import { MainLayout } from "@/components/Layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewDocument = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Novo Documento</h1>
            <p className="text-muted-foreground mt-1">Emissão de fatura eletrónica</p>
          </div>
        </div>

        <Card className="p-6 shadow-card">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="docType">Tipo de Documento</Label>
                <Select>
                  <SelectTrigger id="docType">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FT">Fatura (FT)</SelectItem>
                    <SelectItem value="FR">Fatura-Recibo (FR)</SelectItem>
                    <SelectItem value="ND">Nota de Débito (ND)</SelectItem>
                    <SelectItem value="NC">Nota de Crédito (NC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="series">Série</Label>
                <Select>
                  <SelectTrigger id="series">
                    <SelectValue placeholder="Selecione a série" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025/FT</SelectItem>
                    <SelectItem value="2025-FR">2025/FR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Cliente Exemplo Lda</SelectItem>
                  <SelectItem value="2">Empresa ABC</SelectItem>
                  <SelectItem value="3">Serviços XYZ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 border border-border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Linhas do Documento</h3>
                <Button type="button" variant="outline" size="sm">
                  Adicionar Linha
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-5 space-y-2">
                    <Label>Produto/Serviço</Label>
                    <Input placeholder="Nome do produto" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Quantidade</Label>
                    <Input type="number" placeholder="1" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Preço Unit.</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>IVA %</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="14%" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Isento</SelectItem>
                        <SelectItem value="14">14%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button type="button" variant="ghost" size="icon">
                      ×
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea 
                id="notes" 
                placeholder="Notas adicionais (opcional)"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="text-2xl font-bold text-foreground">0,00 Kz</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">IVA</p>
                <p className="text-2xl font-bold text-foreground">0,00 Kz</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold text-primary">0,00 Kz</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Guardar Rascunho
              </Button>
              <Button type="submit" className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Emitir e Enviar AGT
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NewDocument;
