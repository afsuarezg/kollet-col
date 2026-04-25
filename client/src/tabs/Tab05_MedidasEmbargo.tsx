import { useFormContext } from 'react-hook-form';
import { CaseFormData } from '../schemas/caseSchema';
import { FieldGroup } from '../components/form/FieldGroup';
import { FormField } from '../components/form/FormField';
import { CurrencyField } from '../components/form/CurrencyField';
import { YES_NO_OPTIONS } from '../lib/constants';

export function Tab05_MedidasEmbargo() {
  const { register, control, formState: { errors } } = useFormContext<CaseFormData>();
  return (
    <div className="space-y-4">
      <FieldGroup title="Medidas de Embargo">
        <FormField type="date" name="fecha_decreto_medidas" label="Fecha Decreto Medidas" register={register} errors={errors} />
        <FormField type="number" name="porcentaje_embargo" label="% de Embargo" register={register} errors={errors} />
        <FormField type="date" name="fecha_radicacion_medidas_embargo" label="Fecha de Radicación de Medidas de Embargo" register={register} errors={errors} />
        <FormField type="select" name="medidas_efectivas" label="Medidas Efectivas" control={control} options={YES_NO_OPTIONS.filter(Boolean)} errors={errors} />
        <FormField type="select" name="embargo_remanentes" label="Embargo Remanentes" control={control} options={YES_NO_OPTIONS.filter(Boolean)} errors={errors} />
        <CurrencyField name="limite_embargo_remanentes" label="Límite Embargo Remanentes" control={control} errors={errors} />
        <FormField type="textarea" name="medidas_solicitadas" label="Medidas Solicitadas" register={register} errors={errors} />
        <FormField type="textarea" name="medidas_decretadas" label="Medidas Decretadas" register={register} errors={errors} />
        <FormField type="textarea" name="medidas_radicadas" label="Medidas Radicadas" register={register} errors={errors} />
      </FieldGroup>
    </div>
  );
}
