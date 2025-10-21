'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { issueInvoice } from '@/src/lib/api';
import { useState } from 'react';

const lineSchema = z.object({
  description: z.string().min(1),
  qty: z.coerce.number().positive(),
  unit_price: z.coerce.number().nonnegative(),
  tax_rate: z.coerce.number().nonnegative().default(0),
});

const formSchema = z.object({
  seriesId: z.coerce.number().positive(),
  companyId: z.coerce.number().positive(),
  docType: z.string().length(2).default('FT'),
  customerName: z.string().min(1),
  lines: z.array(lineSchema).min(1),
  submitToAgt: z.boolean().default(false),
});

export type IssueInvoiceFormData = z.infer<typeof formSchema>;

export function IssueInvoiceForm() {
  const [status, setStatus] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<IssueInvoiceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lines: [
        { description: 'Serviço', qty: 1, unit_price: 0, tax_rate: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ name: 'lines', control });

  const onSubmit = async (data: IssueInvoiceFormData) => {
    setStatus('A enviar...');
    try {
      await issueInvoice({
        seriesId: data.seriesId,
        companyId: data.companyId,
        docType: data.docType,
        customer: { name: data.customerName },
        submit_to_agt: data.submitToAgt,
        lines: data.lines.map((line, index) => {
          const lineNet = line.qty * line.unit_price;
          const lineTax = lineNet * (line.tax_rate / 100);
          return {
            ...line,
            line_net: Number(lineNet.toFixed(2)),
            line_tax: Number(lineTax.toFixed(2)),
            line_total: Number((lineNet + lineTax).toFixed(2)),
            lineNumber: index + 1,
          };
        }),
      });
      setStatus('Fatura enviada ou agendada para sincronização.');
    } catch (error) {
      console.error(error);
      setStatus('Erro ao emitir fatura. Verifique a consola.');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col">
          <span className="text-sm font-medium">Empresa ID</span>
          <input className="input" type="number" {...register('companyId')} />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium">Série ID</span>
          <input className="input" type="number" {...register('seriesId')} />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium">Tipo Doc.</span>
          <input className="input" {...register('docType')} />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium">Cliente</span>
          <input className="input" {...register('customerName')} />
        </label>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Linhas</h3>
          <button
            type="button"
            className="rounded bg-indigo-600 px-3 py-1 text-sm font-medium text-white shadow"
            onClick={() =>
              append({ description: '', qty: 1, unit_price: 0, tax_rate: 0 })
            }
          >
            Adicionar linha
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-3 rounded border border-slate-200 p-3 sm:grid-cols-5"
            >
              <input
                className="input sm:col-span-2"
                placeholder="Descrição"
                {...register(`lines.${index}.description` as const)}
              />
              <input
                className="input"
                type="number"
                step="0.001"
                placeholder="Qtd"
                {...register(`lines.${index}.qty` as const)}
              />
              <input
                className="input"
                type="number"
                step="0.01"
                placeholder="Preço"
                {...register(`lines.${index}.unit_price` as const)}
              />
              <div className="flex items-center gap-2">
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  placeholder="Imposto %"
                  {...register(`lines.${index}.tax_rate` as const)}
                />
                <button
                  type="button"
                  className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                  onClick={() => remove(index)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('submitToAgt')} />
        <span>Submeter para AGT após emissão</span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-emerald-600 px-4 py-2 font-semibold text-white shadow disabled:opacity-60"
      >
        {isSubmitting ? 'A processar...' : 'Emitir fatura'}
      </button>

      {status && <p className="text-sm text-slate-600">{status}</p>}
    </form>
  );
}
