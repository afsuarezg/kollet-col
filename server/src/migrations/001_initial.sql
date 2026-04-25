CREATE TABLE IF NOT EXISTS cases (
  -- System fields
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- Tab 1: Identificación del Caso
  pagare TEXT,
  identificacion TEXT,
  demandado TEXT,
  proceso_ejecutivo TEXT,
  saldo_capital INTEGER,
  credito TEXT,
  fondo_pagaduria TEXT,
  afianzadora TEXT,
  abogado TEXT,
  fecha_inicio_mora TEXT,
  fecha_activacion TEXT,
  fecha_entrega_abogado TEXT,
  fecha_vcto_mora_pagare TEXT,

  -- Tab 2: Datos del Proceso
  fecha_presentacion_demanda TEXT,
  valor_pretension INTEGER,
  tipo_proceso TEXT,
  juzgado TEXT,
  tipo_juzgado TEXT,
  departamento TEXT,
  municipio TEXT,
  contar INTEGER,
  seguro_cumplimiento TEXT,
  tarifa INTEGER,

  -- Tab 3: Radicación
  radicacion TEXT,
  radicados_18_marzo TEXT,
  cambios_radicado TEXT,
  fecha_mandamiento_pago TEXT,

  -- Tab 4: Consulta de Bienes
  consulta_bienes TEXT,
  ultima_fecha_consulta_bienes TEXT,
  consulta TEXT,
  resultado_consulta_detalle TEXT,
  resultado_inmueble TEXT,
  resultado_vehiculo TEXT,

  -- Tab 5: Medidas de Embargo
  fecha_decreto_medidas TEXT,
  medidas_solicitadas TEXT,
  medidas_decretadas TEXT,
  medidas_radicadas TEXT,
  porcentaje_embargo REAL,
  fecha_radicacion_medidas_embargo TEXT,
  medidas_efectivas TEXT,
  embargo_remanentes TEXT,
  limite_embargo_remanentes INTEGER,

  -- Tab 6: Notificación
  notificacion_mandamiento TEXT,
  excepciono TEXT,
  fecha_excepciones TEXT,
  fecha_traslado_excepciones TEXT,

  -- Tab 7: Audiencias y Sentencia
  primera_audiencia TEXT,
  audiencia_alegatos_fallo TEXT,
  fecha_sentencia TEXT,
  fecha_apelacion TEXT,
  fecha_envio_superior TEXT,
  fecha_sentencia_segunda_instancia TEXT,
  fecha_auto_obedezcase TEXT,

  -- Tab 8: Liquidación del Crédito
  fecha_presentacion_liquidacion TEXT,
  fecha_traslado_liquidacion TEXT,
  fecha_aprobacion_liquidacion TEXT,
  valor_aprobado_liquidacion INTEGER,
  fecha_presentacion_avaluo TEXT,
  valor_avaluo INTEGER,
  fecha_traslado_avaluo TEXT,

  -- Tab 9: Remate y Títulos
  remate TEXT,
  resultado_remate TEXT,
  orden_entrega_titulos TEXT,
  valor_titulos_a_favor INTEGER,
  valor_titulo_mes_a_mes INTEGER,

  -- Tab 10: Etapa y Seguimiento
  etapa_procesal_actual TEXT,
  etapa_procesal_detalle TEXT,
  tiempo_recuperabilidad TEXT,
  calificacion_cartera TEXT,
  fecha_ultima_actuacion TEXT,
  ultima_actuacion TEXT,
  actuaciones_pendientes TEXT,
  observaciones_abogado TEXT,
  observaciones_cooperativa TEXT,

  -- Tab 11: Cruce de Títulos
  cruce TEXT,
  cruce_titulos_enero_2025 TEXT,
  juzgado_cruce TEXT,
  saldo_titulos INTEGER,
  cruce_sep_2025_pendientes TEXT,
  saldo_titulos_pendientes INTEGER,
  cruce_sep_2025_pagados TEXT,
  juzgado_pagados TEXT,
  saldo_titulos_pagados INTEGER,
  asignacion_temporal TEXT,

  -- Tab 12: Solo Lectura (DO NOT TOUCH - auto-managed)
  ultima_edicion_fecha TEXT,
  etapa_procesal_snapshot TEXT,
  observaciones_abogado_snapshot TEXT,
  linea_tiempo_fecha_inicial TEXT,
  desviacion_linea_tiempo_fecha_inicial REAL,
  linea_tiempo_fecha_ultima_actuacion TEXT,
  desviacion_fecha_ultima_actuacion REAL,
  observacion_linea_tiempo TEXT
);

-- Auto-update trigger: fires on every UPDATE, snapshots read-only fields
CREATE TRIGGER IF NOT EXISTS trg_cases_update
AFTER UPDATE ON cases
FOR EACH ROW
BEGIN
  UPDATE cases
  SET
    updated_at = datetime('now'),
    ultima_edicion_fecha = datetime('now'),
    etapa_procesal_snapshot = NEW.etapa_procesal_actual,
    observaciones_abogado_snapshot = NEW.observaciones_abogado
  WHERE id = NEW.id;
END;
