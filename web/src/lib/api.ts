'use client';

import { PendingSubmit, db } from '@/src/lib/offline/db';

export interface IssuePayload {
  seriesId: number;
  companyId: number;
  docType: string;
  customer: Record<string, unknown>;
  submit_to_agt?: boolean;
  lines: Array<Record<string, unknown>>;
}

function buildIdempotencyKey(payload: IssuePayload) {
  const firstLine = payload.lines[0] ?? {};
  const candidateNumber = firstLine['lineNumber'] ?? Date.now();
  return `${payload.seriesId}-${candidateNumber}-${payload.companyId}`;
}

export async function issueInvoice(payload: IssuePayload) {
  const idemKey = buildIdempotencyKey(payload);

  if (typeof navigator !== 'undefined' && navigator.onLine) {
    const response = await fetch('/api/invoices/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idemKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Erro ao emitir fatura');
    }
    return response.json();
  }

  const entry: PendingSubmit = {
    idemKey,
    payload,
    createdAt: Date.now(),
  };
  await db.pending.add(entry);

  if (typeof navigator !== 'undefined') {
    (navigator as any).serviceWorker?.ready.then((reg: ServiceWorkerRegistration) =>
      reg.sync.register('sync-invoices'),
    );
  }
}
