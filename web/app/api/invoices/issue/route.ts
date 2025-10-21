import { NextRequest } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000/api';

export async function POST(request: NextRequest) {
  const idemKey = request.headers.get('x-idempotency-key');
  const body = await request.json();

  const response = await fetch(`${BACKEND_URL}/invoices/issue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(idemKey ? { 'X-Idempotency-Key': idemKey } : {}),
    },
    body: JSON.stringify(body),
  });

  const payload = await response.text();
  const headers = new Headers(response.headers);

  return new Response(payload, {
    status: response.status,
    headers,
  });
}
