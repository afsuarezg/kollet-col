import { z } from 'zod';

const optStr = z.string().optional().catch('');
const optNum = z.number().optional().catch(undefined);
const optDate = z.string().optional().catch('');

export const caseSchema = z.object({
  // Tab 1
  pagare: optStr,
  identificacion: optStr,
  demandado: optStr,
  proceso_ejecutivo: optStr,
  saldo_capital: optNum,
  credito: optStr,
  fondo_pagaduria: optStr,
  afianzadora: optStr,
  abogado: optStr,
  fecha_inicio_mora: optDate,
  fecha_activacion: optDate,
  fecha_entrega_abogado: optDate,
  fecha_vcto_mora_pagare: optDate,

  // Tab 2
  fecha_presentacion_demanda: optDate,
  valor_pretension: optNum,
  tipo_proceso: optStr,
  juzgado: optStr,
  tipo_juzgado: optStr,
  departamento: optStr,
  municipio: optStr,
  contar: optNum,
  seguro_cumplimiento: optStr,
  tarifa: optNum,

  // Tab 3
  radicacion: optStr,
  radicados_18_marzo: optStr,
  cambios_radicado: optStr,
  fecha_mandamiento_pago: optDate,

  // Tab 4
  consulta_bienes: optStr,
  ultima_fecha_consulta_bienes: optDate,
  consulta: optStr,
  resultado_consulta_detalle: optStr,
  resultado_inmueble: optStr,
  resultado_vehiculo: optStr,

  // Tab 5
  fecha_decreto_medidas: optDate,
  medidas_solicitadas: optStr,
  medidas_decretadas: optStr,
  medidas_radicadas: optStr,
  porcentaje_embargo: optNum,
  fecha_radicacion_medidas_embargo: optDate,
  medidas_efectivas: optStr,
  embargo_remanentes: optStr,
  limite_embargo_remanentes: optNum,

  // Tab 6
  notificacion_mandamiento: optStr,
  excepciono: optStr,
  fecha_excepciones: optDate,
  fecha_traslado_excepciones: optDate,

  // Tab 7
  primera_audiencia: optDate,
  audiencia_alegatos_fallo: optDate,
  fecha_sentencia: optDate,
  fecha_apelacion: optDate,
  fecha_envio_superior: optDate,
  fecha_sentencia_segunda_instancia: optDate,
  fecha_auto_obedezcase: optDate,

  // Tab 8
  fecha_presentacion_liquidacion: optDate,
  fecha_traslado_liquidacion: optDate,
  fecha_aprobacion_liquidacion: optDate,
  valor_aprobado_liquidacion: optNum,
  fecha_presentacion_avaluo: optDate,
  valor_avaluo: optNum,
  fecha_traslado_avaluo: optDate,

  // Tab 9
  remate: optStr,
  resultado_remate: optStr,
  orden_entrega_titulos: optStr,
  valor_titulos_a_favor: optNum,
  valor_titulo_mes_a_mes: optNum,

  // Tab 10
  etapa_procesal_actual: optStr,
  etapa_procesal_detalle: optStr,
  tiempo_recuperabilidad: optStr,
  calificacion_cartera: optStr,
  fecha_ultima_actuacion: optDate,
  ultima_actuacion: optStr,
  actuaciones_pendientes: optStr,
  observaciones_abogado: optStr,
  observaciones_cooperativa: optStr,

  // Tab 11
  cruce: optStr,
  cruce_titulos_enero_2025: optStr,
  juzgado_cruce: optStr,
  saldo_titulos: optNum,
  cruce_sep_2025_pendientes: optStr,
  saldo_titulos_pendientes: optNum,
  cruce_sep_2025_pagados: optStr,
  juzgado_pagados: optStr,
  saldo_titulos_pagados: optNum,
  asignacion_temporal: optStr,
});

export type CaseFormData = z.infer<typeof caseSchema>;

export const READONLY_FIELDS = [
  'id', 'created_at', 'updated_at',
  'ultima_edicion_fecha', 'etapa_procesal_snapshot',
  'observaciones_abogado_snapshot', 'linea_tiempo_fecha_inicial',
  'desviacion_linea_tiempo_fecha_inicial', 'linea_tiempo_fecha_ultima_actuacion',
  'desviacion_fecha_ultima_actuacion', 'observacion_linea_tiempo',
] as const;
