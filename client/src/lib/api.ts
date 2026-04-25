const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status}`);
  }
  return res.json();
}

export const api = {
  cases: {
    list: (params: { page?: number; pageSize?: number; q?: string } = {}) => {
      const qs = new URLSearchParams();
      if (params.page) qs.set('page', String(params.page));
      if (params.pageSize) qs.set('pageSize', String(params.pageSize));
      if (params.q) qs.set('q', params.q);
      return request(`/cases?${qs}`);
    },
    get: (id: number) => request(`/cases/${id}`),
    create: (data: Record<string, unknown>) =>
      request('/cases', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Record<string, unknown>) =>
      request(`/cases/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) =>
      request(`/cases/${id}`, { method: 'DELETE' }),
  },
};
