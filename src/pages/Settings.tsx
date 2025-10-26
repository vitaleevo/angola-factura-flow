import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Building2, FileText, DollarSign, Bell, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Settings() {
  const { currentOrganization, userRole } = useOrganization();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  
  // Organization form data
  const [orgData, setOrgData] = useState({
    name: "",
    nif: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (currentOrganization) {
      setOrgData({
        name: currentOrganization.name,
        nif: currentOrganization.nif || "",
        email: currentOrganization.email,
        phone: currentOrganization.phone || "",
        address: currentOrganization.address || "",
      });
      loadBranches();
      loadUsers();
    }
  }, [currentOrganization]);

  const loadBranches = async () => {
    if (!currentOrganization) return;

    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .eq("organization_id", currentOrganization.id)
      .order("is_headquarters", { ascending: false });

    if (error) {
      console.error("Error loading branches:", error);
    } else {
      setBranches(data || []);
    }
  };

  const loadUsers = async () => {
    if (!currentOrganization) return;

    const { data, error } = await supabase
      .from("user_roles")
      .select(`
        *,
        profiles (
          full_name,
          id
        )
      `)
      .eq("organization_id", currentOrganization.id);

    if (error) {
      console.error("Error loading users:", error);
    } else {
      setUserRoles(data || []);
    }
  };

  const handleSaveOrganization = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    const { error } = await supabase
      .from("organizations")
      .update({
        name: orgData.name,
        nif: orgData.nif,
        email: orgData.email,
        phone: orgData.phone,
        address: orgData.address,
      })
      .eq("id", currentOrganization.id);

    if (error) {
      toast.error("Erro ao guardar: " + error.message);
    } else {
      toast.success("Organização atualizada com sucesso!");
    }
    setLoading(false);
  };

  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

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
            {isAdmin && (
              <TabsTrigger value="users">
                <Users className="w-4 h-4 mr-2" />
                Utilizadores
              </TabsTrigger>
            )}
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
                    <Input
                      id="companyName"
                      value={orgData.name}
                      onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                      disabled={!isAdmin}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nif">NIF</Label>
                    <Input
                      id="nif"
                      value={orgData.nif}
                      onChange={(e) => setOrgData({ ...orgData, nif: e.target.value })}
                      disabled={!isAdmin}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={orgData.email}
                        onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={orgData.phone}
                        onChange={(e) => setOrgData({ ...orgData, phone: e.target.value })}
                        disabled={!isAdmin}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Morada</Label>
                    <Input
                      id="address"
                      value={orgData.address}
                      onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
                      disabled={!isAdmin}
                    />
                  </div>
                </div>
                {isAdmin && (
                  <>
                    <Separator />
                    <Button onClick={handleSaveOrganization} disabled={loading}>
                      {loading ? "A guardar..." : "Guardar Alterações"}
                    </Button>
                  </>
                )}
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
                {branches.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma filial cadastrada
                  </p>
                ) : (
                  <div className="space-y-2">
                    {branches.map((branch) => (
                      <div key={branch.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">{branch.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {branch.is_headquarters ? "Sede" : "Filial"} • {branch.address || "Sem endereço"}
                          </p>
                        </div>
                        {isAdmin && (
                          <Button variant="outline" size="sm">Editar</Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {isAdmin && (
                  <Button variant="outline" className="w-full mt-4" disabled>
                    Adicionar Filial
                  </Button>
                )}
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
                          Formato automático baseado no ano
                        </p>
                      </div>
                      {isAdmin && (
                        <Button variant="outline" size="sm" disabled>Configurar</Button>
                      )}
                    </div>
                  ))}
                </div>
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
                    <Switch defaultChecked disabled={!isAdmin} />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Taxa Reduzida</p>
                      <p className="text-sm text-muted-foreground">7%</p>
                    </div>
                    <Switch defaultChecked disabled={!isAdmin} />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Isento</p>
                      <p className="text-sm text-muted-foreground">0%</p>
                    </div>
                    <Switch defaultChecked disabled={!isAdmin} />
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

          {isAdmin && (
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Utilizadores</CardTitle>
                  <CardDescription>
                    Gerir acessos e permissões de utilizadores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userRoles.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum utilizador encontrado
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {userRoles.map((userRole) => (
                        <div key={userRole.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <p className="font-medium">
                              {userRole.profiles?.full_name || "Utilizador"}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {userRole.role.replace('_', ' ')}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" disabled>Editar</Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-4" disabled>
                    Convidar Utilizador
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

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
                  <Switch disabled />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Logs de Auditoria</Label>
                    <p className="text-sm text-muted-foreground">
                      Registar todas as ações no sistema
                    </p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Expiração de Sessão</Label>
                    <p className="text-sm text-muted-foreground">
                      Terminar sessão após 30 minutos de inatividade
                    </p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
