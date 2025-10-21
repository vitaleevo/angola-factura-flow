<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $invoice->number }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { margin-bottom: 24px; }
        .totals { margin-top: 24px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ config('app.name') }} — Fatura {{ $invoice->doc_type }} {{ $invoice->number }}</h1>
        <p>Emitido em {{ $invoice->created_at->format('d/m/Y H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Descrição</th>
                <th>Qtd.</th>
                <th>Preço Unit.</th>
                <th>Imposto</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->lines as $line)
                <tr>
                    <td>{{ $line->description }}</td>
                    <td>{{ number_format($line->qty, 3, ',', ' ') }}</td>
                    <td>{{ number_format($line->unit_price, 2, ',', ' ') }}</td>
                    <td>{{ number_format($line->line_tax, 2, ',', ' ') }}</td>
                    <td>{{ number_format($line->line_total, 2, ',', ' ') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <p>Total líquido: {{ number_format($invoice->total_net, 2, ',', ' ') }}</p>
        <p>Total imposto: {{ number_format($invoice->total_tax, 2, ',', ' ') }}</p>
        <p>Total bruto: {{ number_format($invoice->total_gross, 2, ',', ' ') }}</p>
    </div>
</body>
</html>
