<?php

namespace App\Http\Controllers;

use App\Jobs\SubmitInvoiceToAgt;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use App\Models\Series;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $this->validateInvoicePayload($request);

        $invoice = null;
        DB::transaction(function () use (&$invoice, $validated) {
            $series = Series::lockForUpdate()->findOrFail($validated['series_id']);
            $number = $series->next_number;

            $lines = collect($validated['lines']);
            $totals = $this->calculateTotals($lines);

            $invoice = Invoice::create([
                'company_id' => $series->company_id,
                'series_id' => $series->id,
                'doc_type' => $series->doc_type,
                'number' => $number,
                'status' => 'issued',
                'total_net' => $totals['net'],
                'total_tax' => $totals['tax'],
                'total_gross' => $totals['gross'],
                'payload' => $validated,
            ]);

            foreach ($lines as $line) {
                InvoiceLine::create([
                    'invoice_id' => $invoice->id,
                    'description' => $line['description'],
                    'qty' => $line['qty'],
                    'unit_price' => $line['unit_price'],
                    'tax_rate' => $line['tax_rate'] ?? 0,
                    'line_net' => $line['line_net'],
                    'line_tax' => $line['line_tax'],
                    'line_total' => $line['line_total'],
                ]);
            }

            $series->next_number = $number + 1;
            $series->save();
        });

        $idemKey = $request->header('X-Idempotency-Key') ?? sprintf('invoice-%s', Str::uuid());

        if ($request->boolean('submit_to_agt', false)) {
            SubmitInvoiceToAgt::dispatch($invoice->id, $idemKey);
        }

        return response()->json($invoice->fresh(['lines']), Response::HTTP_CREATED);
    }

    protected function validateInvoicePayload(Request $request): array
    {
        return $request->validate([
            'series_id' => ['required', 'integer'],
            'customer' => ['required', 'array'],
            'lines' => ['required', 'array', 'min:1'],
            'lines.*.description' => ['required', 'string', 'max:255'],
            'lines.*.qty' => ['required', 'numeric', 'min:0'],
            'lines.*.unit_price' => ['required', 'numeric', 'min:0'],
            'lines.*.tax_rate' => ['nullable', 'numeric', 'min:0'],
            'lines.*.line_net' => ['required', 'numeric', 'min:0'],
            'lines.*.line_tax' => ['required', 'numeric', 'min:0'],
            'lines.*.line_total' => ['required', 'numeric', 'min:0'],
        ]);
    }

    protected function calculateTotals($lines): array
    {
        $net = $lines->sum('line_net');
        $tax = $lines->sum('line_tax');
        $gross = $lines->sum('line_total');

        return [
            'net' => $net,
            'tax' => $tax,
            'gross' => $gross,
        ];
    }
}
