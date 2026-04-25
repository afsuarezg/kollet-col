import { useFormContext } from 'react-hook-form';
import { CaseFormData } from '../schemas/caseSchema';
import { FieldGroup } from '../components/form/FieldGroup';
import { FormField } from '../components/form/FormField';
import { CurrencyField } from '../components/form/CurrencyField';

export function Tab08_Liquidacion() {
  const { register, control, formState: { errors } } = useFormContext<CaseFormData>();
  return (
    <div className="space-y-4">
      <FieldGroup title="Liquidación del Crédito">
        <FormField type="date" name="fecha_presentacion_liquidacion" label="Fecha de Presentación Liquidación Crédito" register={register} errors={errors} />
        <FormField type="date" name="fecha_traslado_liquidacion" label="Fecha de Traslado de Liquidación del Crédito" register={register} errors={errors} />
        <FormField type="date" name="fecha_aprobacion_liquidacion" label="Fecha de Aprobación de Liquidación del Crédito" register={register} errors={errors} />
        <CurrencyField name="valor_aprobado_liquidacion" label="Valor Aprobado Liquidación del Crédito" control={control} errors={errors} />
      </FieldGroup>
      <FieldGroup title="Avalúo">
        <FormField type="date" name="fecha_presentacion_avaluo" label="Fecha Presentación del Avalúo" register={register} errors={errors} />
        <CurrencyField name="valor_avaluo" label="Valor Avalúo" control={control} errors={errors} />
        <FormField type="date" name="fecha_traslado_avaluo" label="Fecha de Traslado Avalúo" register={register} errors={errors} />
      </FieldGroup>
    </div>
  );
}
