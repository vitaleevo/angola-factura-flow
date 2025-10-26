import { Settings as SettingsIcon, Building2, FileText, DollarSign, Bell, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout } from "@/components/Layout/MainLayout";

export default function Settings() {
  return (
    <MainLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerir configurações do sistema e empresa
        </p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">
            <Building2 className="w-4 h-4 mr-2" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="taxes">
            <DollarSign className="w-4 h-4 mr-2" />
            Impostos
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Utilizadores
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>
                Informações gerais da empresa para faturação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input id="companyName" defaultValue="eFactura AO" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nif">NIF</Label>
                  <Input id="nif" defaultValue="5000000000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="geral@efactura.ao" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" defaultValue="+244 900 000 000" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Morada</Label>
                  <Input id="address" defaultValue="Luanda, Angola" />
                </div>
              </div>
              <Separator />
              <Button>Guardar Alterações</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filiais</CardTitle>
              <CardDescription>
                Gerir filiais e locais de negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Sede - Luanda</p>
                    <p className="text-sm text-muted-foreground">Principal</p>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Adicionar Filial
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Séries de Documentos</CardTitle>
              <CardDescription>
                Configurar séries e numeração de documentos fiscais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["FT", "FR", "NC", "ND"].map((type) => (
                  <div key={type} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Série {type}/2025</p>
                      <p className="text-sm text-muted-foreground">
                        Último número: 00042
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Nova Série
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Taxas de IVA</CardTitle>
              <CardDescription>
                Configurar taxas de imposto disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Taxa Normal</p>
                    <p className="text-sm text-muted-foreground">14%</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Taxa Reduzida</p>
                    <p className="text-sm text-muted-foreground">7%</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Isento</p>
                    <p className="text-sm text-muted-foreground">0%</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Gerir quando e como receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Documentos Registados</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar quando documento for aceite pela AGT
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pagamentos Confirmados</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar quando pagamento for recebido
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Erros de Sincronização</Label>
                  <p className="text-sm text-muted-foreground">
                    Alertar sobre falhas de submissão AGT
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilizadores</CardTitle>
              <CardDescription>
                Gerir acessos e permissões de utilizadores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Admin Conta</p>
                    <p className="text-sm text-muted-foreground">admin@empresa.ao • Administrador</p>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Convidar Utilizador
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Configurações de segurança e auditoria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigir 2FA para todos os utilizadores
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Logs de Auditoria</Label>
                  <p className="text-sm text-muted-foreground">
                    Registar todas as ações no sistema
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Expiração de Sessão</Label>
                  <p className="text-sm text-muted-foreground">
                    Terminar sessão após 30 minutos de inatividade
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </MainLayout>
  );
}
