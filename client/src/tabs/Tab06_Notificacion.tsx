import { useFormContext } from 'react-hook-form';
import { CaseFormData } from '../schemas/caseSchema';
import { FieldGroup } from '../components/form/FieldGroup';
import { FormField } from '../components/form/FormField';
import { NOTIFICACION_MANDAMIENTO, YES_NO_OPTIONS } from '../lib/constants';

export function Tab06_Notificacion() {
  const { register, control, formState: { errors } } = useFormContext<CaseFormData>();
  return (
    <div className="space-y-4">
      <FieldGroup title="Notificación">
        <FormField type="select" name="notificacion_mandamiento" label="Notificación Mandamiento" control={control} options={NOTIFICACION_MANDAMIENTO} errors={errors} />
        <FormField type="select" name="excepciono" label="Excepcionó (SI/No)" control={control} options={YES_NO_OPTIONS.filter(Boolean)} errors={errors} />
        <FormField type="date" name="fecha_excepciones" label="Fecha de Excepciones" register={register} errors={errors} />
        <FormField type="date" name="fecha_traslado_excepciones" label="Fecha Traslado de Excepciones" register={register} errors={errors} />
      </FieldGroup>
    </div>
  );
}
