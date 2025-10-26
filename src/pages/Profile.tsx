import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Lock, Bell, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <User className="w-8 h-8 text-primary" />
            Perfil
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerir informações da conta e preferências
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize os seus dados pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    AC
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Alterar Foto
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG ou GIF. Máximo 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue="Admin Conta" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue="admin@empresa.ao"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="+244 900 000 000" />
                </div>
              </div>

              <Separator />

              <Button>Guardar Alterações</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Gerir palavra-passe e autenticação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <Label>Palavra-passe</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Última alteração há 3 meses
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Alterar
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <Label>Autenticação de Dois Fatores</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Adicionar uma camada extra de segurança
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configurar preferências de notificação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber atualizações por email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Alertas no navegador
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Resumo Semanal</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber relatório semanal de atividade
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
