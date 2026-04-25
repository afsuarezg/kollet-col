import { useFormContext } from 'react-hook-form';
import { CaseFormData } from '../schemas/caseSchema';
import { FieldGroup } from '../components/form/FieldGroup';
import { FormField } from '../components/form/FormField';
import { CurrencyField } from '../components/form/CurrencyField';

export function Tab11_CruceTitulos() {
  const { register, control, formState: { errors } } = useFormContext<CaseFormData>();
  return (
    <div className="space-y-4">
      <FieldGroup title="Cruce de Títulos — General">
        <FormField type="text" name="cruce" label="CRUCE" register={register} errors={errors} />
        <FormField type="text" name="cruce_titulos_enero_2025" label="Cruce Títulos Enero 2025" register={register} errors={errors} />
        <FormField type="text" name="juzgado_cruce" label="Juzgado (Cruce)" register={register} errors={errors} />
        <CurrencyField name="saldo_titulos" label="Saldo de Títulos" control={control} errors={errors} />
        <FormField type="text" name="asignacion_temporal" label="Asignación Temporal" register={register} errors={errors} />
      </FieldGroup>
      <FieldGroup title="Cruce Títulos Septiembre 2025 — Pendientes">
        <FormField type="text" name="cruce_sep_2025_pendientes" label="Cruce Títulos Sep 2025 Pendientes" register={register} errors={errors} />
        <CurrencyField name="saldo_titulos_pendientes" label="Saldo de Títulos (Pendientes)" control={control} errors={errors} />
      </FieldGroup>
      <FieldGroup title="Cruce Títulos Septiembre 2025 — Pagados">
        <FormField type="text" name="cruce_sep_2025_pagados" label="Cruce Títulos Sep 2025 Pagados" register={register} errors={errors} />
        <FormField type="text" name="juzgado_pagados" label="Juzgado (Pagados)" register={register} errors={errors} />
        <CurrencyField name="saldo_titulos_pagados" label="Saldo de Títulos (Pagados)" control={control} errors={errors} />
      </FieldGroup>
    </div>
  );
}
