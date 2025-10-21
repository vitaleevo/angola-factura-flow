import { db, AGTSubmission } from './db';
import { toast } from '@/hooks/use-toast';

// Mock AGT API submission (replace with real endpoint)
async function submitToAGT(payload: any): Promise<any> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response - 80% success rate
  if (Math.random() > 0.2) {
    return {
      status: 'success',
      code: '200',
      message: 'Documento registado com sucesso',
      documentId: `AGT-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  } else {
    throw new Error('Erro de validação: Campo NIF inválido');
  }
}

export async function syncInvoice(invoiceId: string, payload: any): Promise<void> {
  const submission: AGTSubmission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    invoiceId,
    payload,
    status: 'pending',
    attempts: 0,
    createdAt: new Date().toISOString()
  };

  await db.addSubmission(submission);
  await attemptSync(submission);
}

export async function attemptSync(submission: AGTSubmission): Promise<void> {
  try {
    submission.attempts += 1;
    submission.lastAttempt = new Date().toISOString();

    const response = await submitToAGT(submission.payload);
    
    submission.status = 'success';
    submission.response = response;
    await db.updateSubmission(submission);

    // Update invoice status
    const invoices = await db.getInvoices();
    const invoice = invoices.find(inv => inv.id === submission.invoiceId);
    if (invoice) {
      invoice.status = 'submitted';
      invoice.syncedAt = new Date().toISOString();
      await db.updateInvoice(invoice);
    }

    toast({
      title: "Sincronização concluída",
      description: "Documento enviado para AGT com sucesso",
    });
  } catch (error) {
    submission.status = 'error';
    submission.error = error instanceof Error ? error.message : 'Erro desconhecido';
    await db.updateSubmission(submission);

    toast({
      title: "Erro na sincronização",
      description: submission.error,
      variant: "destructive",
    });

    throw error;
  }
}

export async function syncPendingSubmissions(): Promise<void> {
  const pending = await db.getPendingSubmissions();
  
  for (const submission of pending) {
    if (submission.attempts < 3) {
      try {
        await attemptSync(submission);
      } catch (error) {
        console.error(`Failed to sync submission ${submission.id}:`, error);
      }
    }
  }
}

export function setupBackgroundSync(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      // @ts-ignore - Background Sync API
      if ('sync' in registration) {
        // @ts-ignore
        return registration.sync.register('sync-invoices');
      }
    }).catch(console.error);
  }
}

// Monitor online/offline status
export function setupOnlineListener(): void {
  window.addEventListener('online', async () => {
    toast({
      title: "Conexão restaurada",
      description: "Sincronizando documentos pendentes...",
    });
    await syncPendingSubmissions();
  });

  window.addEventListener('offline', () => {
    toast({
      title: "Modo offline",
      description: "Documentos serão sincronizados quando a conexão for restaurada",
    });
  });
}
