import {
  UseFormRegister,
  FieldErrors,
  Control,
  Controller,
  Path,
} from 'react-hook-form';
import { CaseFormData } from '../../schemas/caseSchema';

interface BaseProps {
  label: string;
  name: Path<CaseFormData>;
  errors?: FieldErrors<CaseFormData>;
}

interface TextProps extends BaseProps {
  type: 'text' | 'textarea' | 'number';
  register: UseFormRegister<CaseFormData>;
  placeholder?: string;
}

interface SelectProps extends BaseProps {
  type: 'select';
  control: Control<CaseFormData>;
  options: string[];
  placeholder?: string;
}

interface DateProps extends BaseProps {
  type: 'date';
  register: UseFormRegister<CaseFormData>;
}

type FormFieldProps = TextProps | SelectProps | DateProps;

function Label({ label, name }: { label: string; name: string }) {
  return (
    <label htmlFor={name} className="block text-xs font-medium text-slate-600 mb-1">
      {label}
    </label>
  );
}

function ErrorMsg({ errors, name }: { errors?: FieldErrors<CaseFormData>; name: string }) {
  const err = errors?.[name as keyof CaseFormData];
  if (!err?.message) return null;
  return <p className="text-xs text-red-500 mt-1">{String(err.message)}</p>;
}

const inputCls =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

export function FormField(props: FormFieldProps) {
  const { label, name, errors, type } = props;

  if (type === 'textarea') {
    const { register } = props as TextProps;
    return (
      <div className="md:col-span-2 lg:col-span-3">
        <Label label={label} name={name} />
        <textarea
          id={name}
          rows={3}
          className={inputCls + ' resize-y'}
          {...register(name)}
        />
        <ErrorMsg errors={errors} name={name} />
      </div>
    );
  }

  if (type === 'select') {
    const { control, options, placeholder } = props as SelectProps;
    return (
      <div>
        <Label label={label} name={name} />
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <select
              id={name}
              className={inputCls}
              value={String(field.value ?? '')}
              onChange={e => field.onChange(e.target.value)}
            >
              <option value="">{placeholder || '— Seleccionar —'}</option>
              {options.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          )}
        />
        <ErrorMsg errors={errors} name={name} />
      </div>
    );
  }

  if (type === 'date') {
    const { register } = props as DateProps;
    return (
      <div>
        <Label label={label} name={name} />
        <input
          id={name}
          type="date"
          className={inputCls}
          {...register(name)}
        />
        <ErrorMsg errors={errors} name={name} />
      </div>
    );
  }

  // text or number
  const { register, placeholder } = props as TextProps;
  return (
    <div>
      <Label label={label} name={name} />
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={inputCls}
        {...register(name, type === 'number' ? { valueAsNumber: true } : {})}
      />
      <ErrorMsg errors={errors} name={name} />
    </div>
  );
}
