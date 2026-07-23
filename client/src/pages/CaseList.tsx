import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError, type Me } from '../lib/api';
import { formatCOP } from '../lib/formatters';
import { Search, Plus, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

interface CaseRow {
  id: number;
  demandado?: string;
  radicacion?: string;
  abogado?: string;
  etapa_procesal_actual?: string;
  saldo_capital?: number;
  fecha_ultima_actuacion?: string;
  updated_at?: string;
}

interface CasesResp {
  data: CaseRow[];
  total: number;
  page: number;
  pageSize: number;
}

const ETAPA_COLORS: Record<string, string> = {
  'TERMINADO': 'bg-green-100 text-green-700',
  'ARCHIVO': 'bg-slate-100 text-slate-500',
  'REMATE': 'bg-red-100 text-red-700',
  'SENTENCIA': 'bg-purple-100 text-purple-700',
  'MANDAMIENTO DE PAGO': 'bg-blue-100 text-blue-700',
};

function etapaColor(etapa?: string) {
  if (!etapa) return 'bg-slate-100 text-slate-500';
  return ETAPA_COLORS[etapa] || 'bg-amber-100 text-amber-700';
}

export function CaseList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<CasesResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Me | null>(null);
  const [authDenied, setAuthDenied] = useState(false);

  useEffect(() => {
    api.me()
      .then(setMe)
      // Only a genuine 403 means "signed in but outside the allowed domains."
      // Transient errors (500, network, session-expiry redirect) must NOT be
      // mislabeled as an authorization denial.
      .catch((e) => {
        if (e instanceof ApiError && e.status === 403) setAuthDenied(true);
      });
  }, []);

  const fetchData = useCallback(() => {
    setLoading(true);
    api.cases.list({ page, pageSize: 50, q: query || undefined })
      .then(d => { setResult(d as CasesResp); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page, query]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function search(e: React.FormEvent) {
    e.preventDefault();
    setQuery(inputVal);
    setPage(1);
  }

  const totalPages = result ? Math.ceil(result.total / 50) : 1;

  if (authDenied) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-slate-800 mb-2">Acceso no autorizado</h1>
          <p className="text-sm text-slate-500 mb-6">
            Tu cuenta no pertenece a un dominio autorizado para usar Kollect. Contacta al
            administrador si crees que esto es un error.
          </p>
          <a
            href="/.auth/logout"
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            <LogOut size={15} />
            Salir
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Kollect</h1>
          <p className="text-xs text-slate-500">Gestión de Procesos Judiciales</p>
        </div>
        <div className="flex items-center gap-4">
          {me && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-600 hidden sm:inline">{me.email}</span>
              <a
                href="/.auth/logout"
                title="Cerrar sesión"
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Salir</span>
              </a>
            </div>
          )}
          <button
            onClick={() => navigate('/casos/nuevo')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            <Plus size={15} />
            Nuevo Caso
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search bar */}
        <form onSubmit={search} className="mb-4 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por demandado, radicación o identificación..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            Buscar
          </button>
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setInputVal(''); setPage(1); }}
              className="px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100"
            >
              Limpiar
            </button>
          )}
        </form>

        {/* Stats */}
        {result && (
          <p className="text-xs text-slate-500 mb-3">
            {result.total} caso{result.total !== 1 ? 's' : ''} encontrado{result.total !== 1 ? 's' : ''}
            {query && ` para "${query}"`}
          </p>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
              Cargando...
            </div>
          ) : !result?.data.length ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-sm gap-2">
              <p>No se encontraron casos.</p>
              {!query && (
                <button
                  onClick={() => navigate('/casos/nuevo')}
                  className="text-blue-600 hover:underline text-xs"
                >
                  Crear el primer caso
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Demandado</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Radicación</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Abogado</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Etapa Procesal</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Saldo Capital</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Última Actuación</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((row, i) => (
                    <tr
                      key={row.id}
                      onClick={() => navigate(`/casos/${row.id}`)}
                      className={`cursor-pointer hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-0 ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}
                    >
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">{row.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{row.demandado || '—'}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-xs">{row.radicacion || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{row.abogado || '—'}</td>
                      <td className="px-4 py-3">
                        {row.etapa_procesal_actual ? (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${etapaColor(row.etapa_procesal_actual)}`}>
                            {row.etapa_procesal_actual}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.saldo_capital != null ? formatCOP(row.saldo_capital) : '—'}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{row.fecha_ultima_actuacion || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-sm text-slate-600">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
