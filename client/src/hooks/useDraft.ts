import { useEffect, useRef } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface DraftEntry {
  data: Record<string, unknown>;
  savedAt: number;
}

export function draftKey(id: number | 'new') {
  return `kollect_draft_${id}`;
}

export function loadDraft(id: number | 'new'): DraftEntry | null {
  try {
    const raw = localStorage.getItem(draftKey(id));
    if (!raw) return null;
    const entry: DraftEntry = JSON.parse(raw);
    if (Date.now() - entry.savedAt > DRAFT_TTL_MS) {
      localStorage.removeItem(draftKey(id));
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

export function saveDraft(id: number | 'new', data: Record<string, unknown>) {
  const entry: DraftEntry = { data, savedAt: Date.now() };
  localStorage.setItem(draftKey(id), JSON.stringify(entry));
}

export function clearDraft(id: number | 'new') {
  localStorage.removeItem(draftKey(id));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAutoDraft(form: UseFormReturn<FieldValues, any, any>, id: number | 'new') {
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      saveDraft(id, form.getValues() as Record<string, unknown>);
    }, 30_000);
    return () => clearInterval(timerRef.current);
  }, [form, id]);
}
