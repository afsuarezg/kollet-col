import { useFormContext } from 'react-hook-form';
import { CaseFormData } from '../schemas/caseSchema';
import { FieldGroup } from '../components/form/FieldGroup';
import { FormField } from '../components/form/FormField';
import { CurrencyField } from '../components/form/CurrencyField';
import { YES_NO_OPTIONS, RESULTADO_REMATE } from '../lib/constants';

export function Tab09_Remate() {
  const { register, control, formState: { errors } } = useFormContext<CaseFormData>();
  return (
    <div className="space-y-4">
      <FieldGroup title="Remate">
        <FormField type="select" name="remate" label="Remate" control={control} options={YES_NO_OPTIONS.filter(Boolean)} errors={errors} />
        <FormField type="select" name="resultado_remate" label="Resultado Remate" control={control} options={RESULTADO_REMATE} errors={errors} />
        <FormField type="text" name="orden_entrega_titulos" label="Orden Entrega Títulos" register={register} errors={errors} />
        <CurrencyField name="valor_titulos_a_favor" label="Valor Títulos a Favor" control={control} errors={errors} />
        <CurrencyField name="valor_titulo_mes_a_mes" label="Valor Título Mes a Mes" control={control} errors={errors} />
      </FieldGroup>
    </div>
  );
}
