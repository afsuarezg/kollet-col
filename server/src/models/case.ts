import { getDb } from '../db';

const READONLY_COLS = new Set([
  'id', 'created_at', 'updated_at',
  'ultima_edicion_fecha', 'etapa_procesal_snapshot',
  'observaciones_abogado_snapshot', 'linea_tiempo_fecha_inicial',
  'desviacion_linea_tiempo_fecha_inicial', 'linea_tiempo_fecha_ultima_actuacion',
  'desviacion_fecha_ultima_actuacion', 'observacion_linea_tiempo',
]);

const LIST_COLS = [
  'id', 'demandado', 'radicacion', 'abogado',
  'etapa_procesal_actual', 'saldo_capital',
  'fecha_ultima_actuacion', 'updated_at',
].join(', ');

export function listCases(page: number, pageSize: number, q?: string) {
  const db = getDb();
  const offset = (page - 1) * pageSize;

  if (q) {
    const like = `%${q}%`;
    const rows = db.prepare(
      `SELECT ${LIST_COLS} FROM cases
       WHERE demandado LIKE ? OR radicacion LIKE ? OR identificacion LIKE ?
       ORDER BY updated_at DESC LIMIT ? OFFSET ?`
    ).all(like, like, like, pageSize, offset);
    const total = (db.prepare(
      `SELECT COUNT(*) as cnt FROM cases
       WHERE demandado LIKE ? OR radicacion LIKE ? OR identificacion LIKE ?`
    ).get(like, like, like) as { cnt: number }).cnt;
    return { data: rows, total };
  }

  const rows = db.prepare(
    `SELECT ${LIST_COLS} FROM cases ORDER BY updated_at DESC LIMIT ? OFFSET ?`
  ).all(pageSize, offset);
  const total = (db.prepare('SELECT COUNT(*) as cnt FROM cases').get() as { cnt: number }).cnt;
  return { data: rows, total };
}

export function getCaseById(id: number) {
  const db = getDb();
  return db.prepare('SELECT * FROM cases WHERE id = ?').get(id);
}

export function createCase(data: Record<string, unknown>) {
  const db = getDb();
  const filtered = Object.fromEntries(
    Object.entries(data).filter(([k]) => !READONLY_COLS.has(k))
  );
  const cols = Object.keys(filtered);
  const placeholders = cols.map(() => '?').join(', ');
  const values = Object.values(filtered);
  const stmt = db.prepare(
    `INSERT INTO cases (${cols.join(', ')}) VALUES (${placeholders})`
  );
  const result = stmt.run(...values);
  return getCaseById(result.lastInsertRowid as number);
}

export function deleteCase(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM cases WHERE id = ?').run(id);
  return result.changes > 0;
}

export function updateCase(id: number, data: Record<string, unknown>) {
  const db = getDb();
  const filtered = Object.fromEntries(
    Object.entries(data).filter(([k]) => !READONLY_COLS.has(k))
  );
  const cols = Object.keys(filtered);
  if (cols.length === 0) return getCaseById(id);
  const sets = cols.map(c => `${c} = ?`).join(', ');
  const values = [...Object.values(filtered), id];
  db.prepare(`UPDATE cases SET ${sets} WHERE id = ?`).run(...values);
  return getCaseById(id);
}
