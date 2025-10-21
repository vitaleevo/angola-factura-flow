import { MainLayout } from "@/components/Layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { db, AGTSubmission } from "@/lib/db";
import { attemptSync } from "@/lib/sync";
import { toast } from "@/hooks/use-toast";

export default function ErrorCenter() {
  const [submissions, setSubmissions] = useState<AGTSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);

  const loadSubmissions = async () => {
    try {
      const all = await db.getSubmissions();
      setSubmissions(all.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      toast({
        title: "Erro ao carregar submissões",
        description: "Não foi possível carregar as submissões",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleRetry = async (submission: AGTSubmission) => {
    setRetrying(submission.id);
    try {
      await attemptSync(submission);
      await loadSubmissions();
    } catch (error) {
      // Error is already handled in attemptSync
    } finally {
      setRetrying(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-success/10 text-success border-success/20">Sucesso</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-warning text-warning">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Centro de Erros</h1>
            <p className="text-muted-foreground mt-1">
              Gestão de submissões para AGT
            </p>
          </div>
          <Button onClick={loadSubmissions} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        <div className="grid gap-4">
          {submissions.length === 0 && !loading && (
            <Card className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma submissão registada
              </h3>
              <p className="text-muted-foreground">
                As submissões aparecerão aqui quando forem criadas
              </p>
            </Card>
          )}

          {submissions.map((submission) => (
            <Card key={submission.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    submission.status === 'success' ? 'bg-success/10' :
                    submission.status === 'error' ? 'bg-destructive/10' :
                    'bg-warning/10'
                  }`}>
                    {submission.status === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : submission.status === 'error' ? (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    ) : (
                      <Clock className="w-5 h-5 text-warning" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">
                        {submission.invoiceId}
                      </h3>
                      {getStatusBadge(submission.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Criado: {new Date(submission.createdAt).toLocaleString('pt-AO')}
                    </p>
                    {submission.lastAttempt && (
                      <p className="text-sm text-muted-foreground">
                        Última tentativa: {new Date(submission.lastAttempt).toLocaleString('pt-AO')}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Tentativas: {submission.attempts}
                    </p>
                  </div>
                </div>

                {submission.status === 'error' && submission.attempts < 3 && (
                  <Button
                    size="sm"
                    onClick={() => handleRetry(submission)}
                    disabled={retrying === submission.id}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${retrying === submission.id ? 'animate-spin' : ''}`} />
                    Reenviar
                  </Button>
                )}
              </div>

              {submission.error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive font-medium">Erro:</p>
                  <p className="text-sm text-destructive/80 mt-1">{submission.error}</p>
                </div>
              )}

              {submission.response && (
                <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm text-success font-medium">Resposta:</p>
                  <p className="text-sm text-success/80 mt-1">
                    {submission.response.message} (ID: {submission.response.documentId})
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
