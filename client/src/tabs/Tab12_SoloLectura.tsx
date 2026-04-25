import { ReadOnlyField } from '../components/form/ReadOnlyField';
import { FieldGroup } from '../components/form/FieldGroup';

interface Tab12Props {
  recordData?: Record<string, unknown>;
}

export function Tab12_SoloLectura({ recordData }: Tab12Props) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-700">
        Estos campos son administrados automáticamente por el sistema. No pueden ser editados manualmente.
      </div>
      <FieldGroup title="Control de Edición (DO NOT TOUCH)">
        <ReadOnlyField
          label="Última Edición / Fecha Última Actuación Original"
          value={recordData?.ultima_edicion_fecha as string}
        />
        <ReadOnlyField
          label="Etapa Procesal Actual (Snapshot)"
          value={recordData?.etapa_procesal_snapshot as string}
        />
        <ReadOnlyField
          label="Observaciones Abogado (Snapshot)"
          value={recordData?.observaciones_abogado_snapshot as string}
          wide
        />
      </FieldGroup>
      <FieldGroup title="Línea de Tiempo">
        <ReadOnlyField
          label="Línea de Tiempo — Fecha Inicial"
          value={recordData?.linea_tiempo_fecha_inicial as string}
        />
        <ReadOnlyField
          label="Desviación — Fecha Inicial"
          value={recordData?.desviacion_linea_tiempo_fecha_inicial as number}
        />
        <ReadOnlyField
          label="Línea de Tiempo — Fecha de Última Actuación"
          value={recordData?.linea_tiempo_fecha_ultima_actuacion as string}
        />
        <ReadOnlyField
          label="Desviación — Fecha de Última Actuación"
          value={recordData?.desviacion_fecha_ultima_actuacion as number}
        />
        <ReadOnlyField
          label="Observación de la Línea de Tiempo"
          value={recordData?.observacion_linea_tiempo as string}
          wide
        />
      </FieldGroup>
    </div>
  );
}
