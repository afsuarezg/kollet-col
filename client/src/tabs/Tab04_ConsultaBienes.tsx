import { useFormContext } from 'react-hook-form';
import { CaseFormData } from '../schemas/caseSchema';
import { FieldGroup } from '../components/form/FieldGroup';
import { FormField } from '../components/form/FormField';
import { YES_NO_OPTIONS } from '../lib/constants';

export function Tab04_ConsultaBienes() {
  const { register, control, formState: { errors } } = useFormContext<CaseFormData>();
  return (
    <div className="space-y-4">
      <FieldGroup title="Consulta de Bienes">
        <FormField type="select" name="consulta_bienes" label="Consulta de Bienes" control={control} options={YES_NO_OPTIONS.filter(Boolean)} errors={errors} />
        <FormField type="date" name="ultima_fecha_consulta_bienes" label="Última Fecha Consulta de Bienes" register={register} errors={errors} />
        <FormField type="text" name="consulta" label="Consulta" register={register} errors={errors} />
        <FormField type="text" name="resultado_inmueble" label="Resultado de Inmueble" register={register} errors={errors} />
        <FormField type="text" name="resultado_vehiculo" label="Resultado de Vehículo" register={register} errors={errors} />
        <FormField type="textarea" name="resultado_consulta_detalle" label="Resultado Consulta Detalle" register={register} errors={errors} />
      </FieldGroup>
    </div>
  );
}
