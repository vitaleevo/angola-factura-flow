# eFactura AO Backend

Este directório contém instruções e stubs de código para configurar o backend Laravel 11. Como não é possível publicar o
skeleton completo do Laravel neste ambiente, siga os passos abaixo para reconstruir o projecto localmente e, em seguida,
mesclar os ficheiros de `custom/`.

## Passo a passo

1. **Criar o projecto Laravel base**
   ```bash
   cd backend
   composer create-project laravel/laravel .
   ```
2. **Instalar os pacotes necessários**
   ```bash
   composer require spatie/laravel-permission spatie/browsershot laravel/telescope
   composer require web-token/jwt-framework:^3.2
   ```
3. **Copiar os ficheiros personalizados**
   - Copie tudo de `custom/app` para `app` (mesclando directórios).
   - Copie `custom/database/migrations` para `database/migrations`.
   - Copie `custom/routes/api.php` para `routes/api.php` (ajustando conforme necessário).
   - Substitua `bootstrap/app.php` pelo ficheiro em `custom/bootstrap/app.php` ou adicione apenas o alias do middleware.
   - Adicione a view PDF em `resources/views/pdf`.

   Pode usar `rsync` para facilitar:
   ```bash
   rsync -a custom/app/ app/
   rsync -a custom/database/ database/
   rsync -a custom/routes/ routes/
   rsync -a custom/resources/ resources/
   cp custom/bootstrap/app.php bootstrap/app.php
   ```

4. **Actualizar `composer.json`**
   O ficheiro `composer.stub.json` lista as dependências esperadas. Compare com o seu `composer.json` gerado e confirme que
   as secções `require` e `require-dev` incluem os mesmos pacotes.

5. **Configurar o `.env`**
   Copie `.env.example` para `.env` e ajuste credenciais (MySQL, caminho do Chrome, certificado `.p12`, etc.).

6. **Migrar e preparar filas**
   ```bash
   php artisan key:generate
   php artisan migrate
   php artisan queue:table
   php artisan migrate
   php artisan queue:work
   ```

## O que está em `custom/`

- `app/Http/Middleware/IdempotencyKey.php` — middleware que garante idempotência em rotas POST.
- `app/Jobs/SubmitInvoiceToAgt.php` — job que assina o payload e chama o endpoint (mock) da AGT com retry/backoff.
- `app/Services/JwsSigner.php` — serviço que lê o `.p12`, extrai o `x5c` e gera o JWS PS256.
- `app/Models/*` — modelos Eloquent configurados com casts e fillables adequados.
- `database/migrations/*` — tabelas de séries, faturas, linhas, chaves de idempotência, submissões e armazenamento de chaves.
- `resources/views/pdf/invoice.blade.php` — template usado pelo Browsershot para gerar o PDF no momento da emissão.
- `routes/api.php` — rotas API com aplicação do middleware de idempotência.
- `bootstrap/app.php` — registo do alias `idempotency` para o middleware customizado.

## Fila e Browsershot

- Certifique-se de que o driver de fila (`QUEUE_CONNECTION`) está definido para `database` no `.env`.
- Execute `php artisan queue:work` num terminal dedicado.
- Garanta que o Chrome está acessível pelo caminho especificado em `BROWSERSHOT_CHROME_PATH`.

## Próximos passos sugeridos

- Construir painel de "Centro de Erros" consumindo `agt_submissions`.
- Implementar reenfileiramento manual (`SubmitInvoiceToAgt::dispatch`).
- Trocar o endpoint mock pela integração oficial da AGT assim que tiver credenciais.
