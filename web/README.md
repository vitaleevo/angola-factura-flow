# eFactura AO PWA

PWA construído com Next.js 14 para emissão de faturas. Principais características:

- Funciona offline utilizando IndexedDB (Dexie) e background sync no service worker.
- Consome a API Laravel através de uma rota proxy (`/api/invoices/issue`).
- Usa React Hook Form + Zod para validação do formulário.

## Scripts

```bash
npm run dev    # arranca servidor de desenvolvimento
npm run build  # build de produção
npm run start  # arranca build de produção
npm run lint   # verifica lint
```

## Variáveis de ambiente

Crie um ficheiro `.env.local` se quiser apontar para outro backend:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api
```
