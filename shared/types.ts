export interface CaseListItem {
  id: number;
  demandado?: string;
  radicacion?: string;
  abogado?: string;
  etapa_procesal_actual?: string;
  saldo_capital?: number;
  fecha_ultima_actuacion?: string;
  updated_at?: string;
}

export interface CasesResponse {
  data: CaseListItem[];
  total: number;
  page: number;
  pageSize: number;
}
