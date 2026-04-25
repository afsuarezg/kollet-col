import { Lock } from 'lucide-react';

interface ReadOnlyFieldProps {
  label: string;
  value?: string | number | null;
  wide?: boolean;
}

export function ReadOnlyField({ label, value, wide }: ReadOnlyFieldProps) {
  return (
    <div className={wide ? 'md:col-span-2 lg:col-span-3' : ''}>
      <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
        <Lock size={10} className="text-slate-400" />
        {label}
      </label>
      <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 min-h-[38px]">
        {value != null && value !== '' ? String(value) : <span className="text-slate-400 italic">Auto-calculado</span>}
      </div>
    </div>
  );
}
