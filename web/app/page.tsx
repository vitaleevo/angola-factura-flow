import { IssueInvoiceForm } from '@/src/components/issue-invoice-form';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">eFactura AO</h1>
        <p className="text-slate-600">
          Emita faturas mesmo offline. Quando a ligação regressar, o PWA sincroniza com o backend Laravel e garante a
          idempotência das operações junto da AGT.
        </p>
      </header>
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-800">Nova fatura</h2>
        <p className="mb-6 text-sm text-slate-500">
          Preencha os detalhes da fatura. Caso esteja offline, ela será guardada e enviada assim que a ligação for
          restabelecida.
        </p>
        <IssueInvoiceForm />
      </section>
    </main>
  );
}
