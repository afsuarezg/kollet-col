import { useFormContext } from 'react-hook-form';
import { CaseFormData } from '../schemas/caseSchema';
import { FieldGroup } from '../components/form/FieldGroup';
import { FormField } from '../components/form/FormField';
import { CurrencyField } from '../components/form/CurrencyField';
import { TIPOS_PROCESO, TIPOS_JUZGADO, DEPARTAMENTOS } from '../lib/constants';

export function Tab02_DatosProceso() {
  const { register, control, formState: { errors } } = useFormContext<CaseFormData>();
  return (
    <div className="space-y-4">
      <FieldGroup title="Datos del Proceso Judicial">
        <FormField type="date" name="fecha_presentacion_demanda" label="Fecha Presentación de Demanda" register={register} errors={errors} />
        <CurrencyField name="valor_pretension" label="Valor Pretensión" control={control} errors={errors} />
        <FormField type="select" name="tipo_proceso" label="Tipo de Proceso" control={control} options={TIPOS_PROCESO} errors={errors} />
        <FormField type="text" name="juzgado" label="Juzgado" register={register} errors={errors} />
        <FormField type="select" name="tipo_juzgado" label="Tipo de Juzgado" control={control} options={TIPOS_JUZGADO} errors={errors} />
        <FormField type="select" name="departamento" label="Departamento" control={control} options={DEPARTAMENTOS} errors={errors} />
        <FormField type="text" name="municipio" label="Municipio" register={register} errors={errors} />
        <FormField type="number" name="contar" label="Contar" register={register} errors={errors} />
        <FormField type="text" name="seguro_cumplimiento" label="Seguro de Cumplimiento" register={register} errors={errors} />
        <CurrencyField name="tarifa" label="Tarifa" control={control} errors={errors} />
      </FieldGroup>
    </div>
  );
}
