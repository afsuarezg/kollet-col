import { useFormContext } from 'react-hook-form';
import { CaseFormData } from '../schemas/caseSchema';
import { FieldGroup } from '../components/form/FieldGroup';
import { FormField } from '../components/form/FormField';

export function Tab03_Radicacion() {
  const { register, formState: { errors } } = useFormContext<CaseFormData>();
  return (
    <div className="space-y-4">
      <FieldGroup title="Radicación">
        <FormField type="text" name="radicacion" label="Radicación" register={register} errors={errors} />
        <FormField type="text" name="radicados_18_marzo" label="Radicados 18 Marzo" register={register} errors={errors} />
        <FormField type="text" name="cambios_radicado" label="Cambios Radicado" register={register} errors={errors} />
        <FormField type="date" name="fecha_mandamiento_pago" label="Fecha Mandamiento de Pago" register={register} errors={errors} />
      </FieldGroup>
    </div>
  );
}
