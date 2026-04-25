import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { caseSchema, CaseFormData, READONLY_FIELDS } from '../../schemas/caseSchema';
import { api } from '../../lib/api';
import { loadDraft, clearDraft, useAutoDraft } from '../../hooks/useDraft';
import { Tab01_Identificacion } from '../../tabs/Tab01_Identificacion';
import { Tab02_DatosProceso } from '../../tabs/Tab02_DatosProceso';
import { Tab03_Radicacion } from '../../tabs/Tab03_Radicacion';
import { Tab04_ConsultaBienes } from '../../tabs/Tab04_ConsultaBienes';
import { Tab05_MedidasEmbargo } from '../../tabs/Tab05_MedidasEmbargo';
import { Tab06_Notificacion } from '../../tabs/Tab06_Notificacion';
import { Tab07_Audiencias } from '../../tabs/Tab07_Audiencias';
import { Tab08_Liquidacion } from '../../tabs/Tab08_Liquidacion';
import { Tab09_Remate } from '../../tabs/Tab09_Remate';
import { Tab10_EtapaYSeguimiento } from '../../tabs/Tab10_EtapaYSeguimiento';
import { Tab11_CruceTitulos } from '../../tabs/Tab11_CruceTitulos';
import { Tab12_SoloLectura } from '../../tabs/Tab12_SoloLectura';
import { Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const TABS = [
  { id: 'identificacion', label: 'Identificación' },
  { id: 'proceso', label: 'Datos Proceso' },
  { id: 'radicacion', label: 'Radicación' },
  { id: 'bienes', label: 'Consulta Bienes' },
  { id: 'medidas', label: 'Medidas Embargo' },
  { id: 'notificacion', label: 'Notificación' },
  { id: 'audiencias', label: 'Audiencias' },
  { id: 'liquidacion', label: 'Liquidación' },
  { id: 'remate', label: 'Remate' },
  { id: 'etapa', label: 'Etapa y Seguimiento' },
  { id: 'cruce', label: 'Cruce de Títulos' },
  { id: 'readonly', label: 'Solo Lectura' },
];

interface CaseFormWrapperProps {
  caseId?: number;
}

export function CaseFormWrapper({ caseId }: CaseFormWrapperProps) {
  const navigate = useNavigate();
  const draftId = caseId ?? 'new';
  const [activeTab, setActiveTab] = useState('identificacion');
  const [loading, setLoading] = useState(!!caseId);
  const [recordData, setRecordData] = useState<Record<string, unknown>>({});
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [draftBanner, setDraftBanner] = useState<{ savedAt: number; data: Record<string, unknown> } | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema) as any,
    defaultValues: {} as CaseFormData,
    mode: 'onBlur',
  });

  useAutoDraft(form, draftId);

  // Load existing record
  useEffect(() => {
    if (!caseId) {
      const draft = loadDraft('new');
      if (draft) setDraftBanner({ savedAt: draft.savedAt, data: draft.data });
      return;
    }
    setLoading(true);
    api.cases.get(caseId).then((data: unknown) => {
      const record = data as Record<string, unknown>;
      setRecordData(record);
      const formData: Partial<CaseFormData> = {};
      for (const key of Object.keys(caseSchema.shape)) {
        if (record[key] != null) {
          (formData as Record<string, unknown>)[key] = record[key];
        }
      }
      form.reset(formData as CaseFormData);
      setLoading(false);
      const draft = loadDraft(caseId);
      if (draft) setDraftBanner({ savedAt: draft.savedAt, data: draft.data });
    }).catch(() => setLoading(false));
  }, [caseId]);

  function restoreDraft() {
    if (draftBanner) {
      form.reset(draftBanner.data as unknown as CaseFormData);
      setDraftBanner(null);
    }
  }

  function dismissDraft() {
    clearDraft(draftId);
    setDraftBanner(null);
  }

  async function onSubmit(data: CaseFormData) {
    const payload: Record<string, unknown> = { ...data };
    for (const f of READONLY_FIELDS) delete payload[f];

    try {
      let saved: unknown;
      if (caseId) {
        saved = await api.cases.update(caseId, payload);
      } else {
        saved = await api.cases.create(payload);
      }
      clearDraft(draftId);
      setToast({ type: 'success', msg: 'Caso guardado correctamente.' });
      setTimeout(() => setToast(null), 4000);
      if (!caseId) {
        const newId = (saved as Record<string, unknown>).id as number;
        navigate(`/casos/${newId}`, { replace: true });
      } else {
        setRecordData(saved as Record<string, unknown>);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar';
      setToast({ type: 'error', msg });
      setTimeout(() => setToast(null), 5000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Cargando caso...
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm"
            >
              <ArrowLeft size={16} />
              Volver
            </button>
            <h1 className="text-lg font-semibold text-slate-800">
              {caseId ? `Caso #${caseId} — ${String(recordData.demandado || '')}` : 'Nuevo Caso'}
            </h1>
          </div>
          <button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            <Save size={15} />
            Guardar
          </button>
        </div>

        {/* Draft banner */}
        {draftBanner && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center gap-3 text-sm text-amber-800">
            <AlertCircle size={15} />
            <span>
              Borrador guardado el {new Date(draftBanner.savedAt).toLocaleString('es-CO')}
            </span>
            <button
              type="button"
              onClick={restoreDraft}
              className="font-medium underline hover:no-underline"
            >
              Restaurar
            </button>
            <button
              type="button"
              onClick={dismissDraft}
              className="text-amber-600 hover:text-amber-800"
            >
              Descartar
            </button>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.msg}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Tab nav - scrollable on mobile */}
          <div className="overflow-x-auto mb-6">
            <div className="flex gap-1 min-w-max bg-white rounded-lg border border-slate-200 p-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            {activeTab === 'identificacion' && <Tab01_Identificacion />}
            {activeTab === 'proceso' && <Tab02_DatosProceso />}
            {activeTab === 'radicacion' && <Tab03_Radicacion />}
            {activeTab === 'bienes' && <Tab04_ConsultaBienes />}
            {activeTab === 'medidas' && <Tab05_MedidasEmbargo />}
            {activeTab === 'notificacion' && <Tab06_Notificacion />}
            {activeTab === 'audiencias' && <Tab07_Audiencias />}
            {activeTab === 'liquidacion' && <Tab08_Liquidacion />}
            {activeTab === 'remate' && <Tab09_Remate />}
            {activeTab === 'etapa' && <Tab10_EtapaYSeguimiento />}
            {activeTab === 'cruce' && <Tab11_CruceTitulos />}
            {activeTab === 'readonly' && <Tab12_SoloLectura recordData={recordData} />}
          </div>

          {/* Bottom save button */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-md transition-colors"
            >
              <Save size={15} />
              Guardar Caso
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
