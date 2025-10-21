<?php

namespace App\Jobs;

use App\Models\AgtSubmission;
use App\Models\Invoice;
use App\Services\JwsSigner;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class SubmitInvoiceToAgt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 5;

    /**
     * @var array<int, int>
     */
    public array $backoff = [10, 30, 60, 120, 300];

    public function __construct(public int $invoiceId, public string $idemKey)
    {
    }

    public function handle(JwsSigner $signer): void
    {
        $invoice = Invoice::findOrFail($this->invoiceId);
        $payload = json_decode((string) $invoice->payload, true) ?? [];

        $jws = $signer->sign($payload);

        $response = Http::timeout(15)
            ->withHeaders([
                'X-Idempotency-Key' => $this->idemKey,
                'Content-Type' => 'application/json',
            ])->post('http://localhost:9000/agt-mock/register', [
                'documentJws' => $jws,
            ]);

        AgtSubmission::create([
            'invoice_id' => $invoice->id,
            'request' => ['documentJws' => substr($jws, 0, 32) . '...'],
            'response' => json_decode($response->body(), true),
            'status' => $response->successful() ? 'accepted' : 'rejected',
        ]);

        if ($response->successful()) {
            $invoice->status = 'registered';
            $invoice->save();

            return;
        }

        $this->fail(new \RuntimeException('Rejeitado pela AGT (mock).'));
    }
}
