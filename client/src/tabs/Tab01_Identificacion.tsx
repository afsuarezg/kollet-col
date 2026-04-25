import { useFormContext } from 'react-hook-form';
import { CaseFormData } from '../schemas/caseSchema';
import { FieldGroup } from '../components/form/FieldGroup';
import { FormField } from '../components/form/FormField';
import { CurrencyField } from '../components/form/CurrencyField';
import { ABOGADOS } from '../lib/constants';

export function Tab01_Identificacion() {
  const { register, control, formState: { errors } } = useFormContext<CaseFormData>();
  return (
    <div className="space-y-4">
      <FieldGroup title="Identificación del Caso">
        <FormField type="text" name="pagare" label="Pagaré" register={register} errors={errors} />
        <FormField type="text" name="identificacion" label="Identificación (NIT / Cédula)" register={register} errors={errors} />
        <FormField type="text" name="demandado" label="Demandado" register={register} errors={errors} />
        <FormField type="text" name="proceso_ejecutivo" label="Proceso Ejecutivo" register={register} errors={errors} />
        <CurrencyField name="saldo_capital" label="Saldo Capital" control={control} errors={errors} />
        <FormField type="text" name="credito" label="Crédito" register={register} errors={errors} />
        <FormField type="text" name="fondo_pagaduria" label="Fondo / Pagaduría" register={register} errors={errors} />
        <FormField type="text" name="afianzadora" label="Afianzadora" register={register} errors={errors} />
        <FormField type="select" name="abogado" label="Abogado Asignado" control={control} options={ABOGADOS} errors={errors} />
      </FieldGroup>
      <FieldGroup title="Fechas Clave">
        <FormField type="date" name="fecha_inicio_mora" label="Fecha Inicio Mora" register={register} errors={errors} />
        <FormField type="date" name="fecha_activacion" label="Fecha de Activación" register={register} errors={errors} />
        <FormField type="date" name="fecha_entrega_abogado" label="Fecha Entrega Abogado" register={register} errors={errors} />
        <FormField type="date" name="fecha_vcto_mora_pagare" label="Fecha de Vcto / Mora (Pagaré)" register={register} errors={errors} />
      </FieldGroup>
    </div>
  );
}
