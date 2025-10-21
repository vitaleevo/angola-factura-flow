# eFactura AO Monorepo

Este repositório contém um monorepo simples com dois projectos irmãos:

- `backend/` — stubs e instruções para um backend Laravel 11 responsável pela emissão, submissão e monitorização das
  faturas enviadas à AGT.
- `web/` — PWA construído com Next.js 14 que funciona offline através de IndexedDB/Dexie e sincronização em segundo plano.

> **Nota sobre dependências**
> O ambiente usado para preparar este commit não possui acesso à internet para descarregar pacotes PHP ou NPM. Execute os
> comandos listados abaixo no seu ambiente local para completar a configuração.

## Backend (Laravel 11)

1. Criar o projecto Laravel base dentro de `backend/`:
   ```bash
   cd backend
   composer create-project laravel/laravel .
   ```
2. Instalar pacotes adicionais:
   ```bash
   composer require spatie/laravel-permission spatie/browsershot laravel/telescope
   composer require web-token/jwt-framework:^3.2
   ```
3. Mesclar os ficheiros de `backend/custom/` com o projecto gerado (middleware, modelos, migrações, job, serviço, view e
   rotas).
4. Actualizar o `composer.json` com as dependências listadas em `backend/composer.stub.json` (se alguma estiver em falta).
5. Copiar `.env.example` para `.env`, ajustar credenciais e caminhos (MySQL, Chrome, certificado `.p12`).
6. Gerar chave e executar migrações:
   ```bash
   php artisan key:generate
   php artisan migrate
   php artisan queue:table
   php artisan migrate
   php artisan queue:work
   ```

O backend inclui:
- Migrações para séries, faturas, linhas, chaves de idempotência, submissões AGT e armazenamento de chaves.
- Modelos Eloquent para cada entidade.
- Middleware que valida o cabeçalho `X-Idempotency-Key` e evita duplicação de requisições POST.
- Serviço `JwsSigner` que lê o certificado `.p12`, constrói o cabeçalho `x5c` e assina payloads no algoritmo `PS256`.
- Job `SubmitInvoiceToAgt` com tentativas e backoff progressivo usando a fila de base de dados.
- Controladores para séries e emissão de faturas com transacção e bloqueio optimista da numeração.
- View Blade `pdf/invoice.blade.php` preparada para o Spatie Browsershot gerar o PDF.

## Frontend (Next.js 14 PWA)

1. Instalar dependências:
   ```bash
   cd web
   npm install
   ```
2. Criar um ficheiro `.env.local` com o endpoint da API, se necessário:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api
   ```
3. Executar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

Funcionalidades principais do PWA:
- Manifesto e service worker (`public/sw.js`) com sincronização em background para faturas emitidas offline.
- IndexedDB via Dexie (`src/lib/offline/db.ts`) para guardar submissões pendentes.
- Formulário React Hook Form + Zod para criar faturas e despachar para o backend ou para a fila offline.
- Provider do React Query para gerir chamadas e cache.
- API route `/api/invoices/issue` que serve de proxy para o Laravel, mantendo o cabeçalho de idempotência.

### Convenções de UI

Os estilos base usam Tailwind CSS. A classe utilitária `.input` foi criada em `app/globals.css` para inputs com bordas e
focus consistente.

## Fluxo recomendado

1. Criar séries e emitir faturas através do frontend (`npm run dev`) conectado à API (`php artisan serve`).
2. Deixar o PWA offline, emitir novas faturas — elas serão guardadas no IndexedDB.
3. Restaurar ligação para que o service worker reenvie as operações (evento `sync`).
4. Consultar a tabela `agt_submissions` no backend para ver respostas e reenviar via painel "Centro de Erros"
   (pendente para próximo passo).

## Próximos passos sugeridos

- Página no frontend para listar submissões rejeitadas e acionar `SubmitInvoiceToAgt` novamente.
- Configurar endpoint real da AGT e certificados definitivos.
- Adicionar validação SAF-T/XSD antes de submeter documentos em lote.
