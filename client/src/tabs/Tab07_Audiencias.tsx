import { useFormContext } from 'react-hook-form';
import { CaseFormData } from '../schemas/caseSchema';
import { FieldGroup } from '../components/form/FieldGroup';
import { FormField } from '../components/form/FormField';

export function Tab07_Audiencias() {
  const { register, formState: { errors } } = useFormContext<CaseFormData>();
  return (
    <div className="space-y-4">
      <FieldGroup title="Audiencias">
        <FormField type="date" name="primera_audiencia" label="Primera Audiencia" register={register} errors={errors} />
        <FormField type="date" name="audiencia_alegatos_fallo" label="Audiencia de Alegatos y Fallo" register={register} errors={errors} />
      </FieldGroup>
      <FieldGroup title="Sentencia y Apelación">
        <FormField type="date" name="fecha_sentencia" label="Fecha de Sentencia" register={register} errors={errors} />
        <FormField type="date" name="fecha_apelacion" label="Fecha de Apelación" register={register} errors={errors} />
        <FormField type="date" name="fecha_envio_superior" label="Fecha de Envío al Superior" register={register} errors={errors} />
        <FormField type="date" name="fecha_sentencia_segunda_instancia" label="Fecha de Sentencia de Segunda Instancia" register={register} errors={errors} />
        <FormField type="date" name="fecha_auto_obedezcase" label="Fecha de Auto de Obedézcase" register={register} errors={errors} />
      </FieldGroup>
    </div>
  );
}
