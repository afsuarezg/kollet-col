import { useState, useEffect } from 'react';
import { Control, Controller, FieldErrors, Path } from 'react-hook-form';
import { CaseFormData } from '../../schemas/caseSchema';

interface CurrencyFieldProps {
  label: string;
  name: Path<CaseFormData>;
  control: Control<CaseFormData>;
  errors?: FieldErrors<CaseFormData>;
}

function formatDisplay(cents: number | undefined): string {
  if (cents == null || isNaN(cents)) return '';
  const pesos = cents / 100;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pesos);
}

function parseInput(raw: string): number | undefined {
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return undefined;
  return parseInt(digits, 10) * 100;
}

export function CurrencyField({ label, name, control, errors }: CurrencyFieldProps) {
  const err = errors?.[name as keyof CaseFormData];

  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const [display, setDisplay] = useState(formatDisplay(field.value as number));

          useEffect(() => {
            setDisplay(formatDisplay(field.value as number));
          }, [field.value]);

          return (
            <input
              id={name}
              type="text"
              inputMode="numeric"
              value={display}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={e => setDisplay(e.target.value)}
              onBlur={e => {
                const parsed = parseInput(e.target.value);
                field.onChange(parsed);
                setDisplay(formatDisplay(parsed));
              }}
              placeholder="$ 0"
            />
          );
        }}
      />
      {err?.message && <p className="text-xs text-red-500 mt-1">{String(err.message)}</p>}
    </div>
  );
}
