import { useFormContext } from 'react-hook-form';
import { CaseFormData } from '../schemas/caseSchema';
import { FieldGroup } from '../components/form/FieldGroup';
import { FormField } from '../components/form/FormField';
import { ETAPAS_PROCESALES, TIEMPO_RECUPERABILIDAD, CALIFICACION_CARTERA } from '../lib/constants';

export function Tab10_EtapaYSeguimiento() {
  const { register, control, formState: { errors } } = useFormContext<CaseFormData>();
  return (
    <div className="space-y-4">
      <FieldGroup title="Etapa Procesal">
        <FormField type="select" name="etapa_procesal_actual" label="Etapa Procesal Actual" control={control} options={ETAPAS_PROCESALES} errors={errors} />
        <FormField type="select" name="tiempo_recuperabilidad" label="Tiempo de Recuperabilidad" control={control} options={TIEMPO_RECUPERABILIDAD} errors={errors} />
        <FormField type="select" name="calificacion_cartera" label="Calificación de Cartera" control={control} options={CALIFICACION_CARTERA} errors={errors} />
        <FormField type="textarea" name="etapa_procesal_detalle" label="Etapa Procesal Detalle" register={register} errors={errors} />
      </FieldGroup>
      <FieldGroup title="Actuaciones">
        <FormField type="date" name="fecha_ultima_actuacion" label="Fecha Última Actuación" register={register} errors={errors} />
        <FormField type="textarea" name="ultima_actuacion" label="Última Actuación" register={register} errors={errors} />
        <FormField type="textarea" name="actuaciones_pendientes" label="Actuaciones Pendientes" register={register} errors={errors} />
      </FieldGroup>
      <FieldGroup title="Observaciones">
        <FormField type="textarea" name="observaciones_abogado" label="Observaciones Abogado" register={register} errors={errors} />
        <FormField type="textarea" name="observaciones_cooperativa" label="Observaciones Cooperativa" register={register} errors={errors} />
      </FieldGroup>
    </div>
  );
}
