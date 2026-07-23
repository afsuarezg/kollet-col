const BASE = '/api';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 401) {
    // Not signed in / session expired. Bounce to Google login and return here.
    // (A 403 means signed in but not allowed — that's thrown below, not redirected.)
    const back = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/.auth/login/google?post_login_redirect_uri=${back}`;
    // Navigation is underway; never resolve so callers don't act on a non-response.
    return new Promise<T>(() => {});
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // Carry the status so callers can distinguish, e.g., a genuine 403
    // (domain denied) from a transient 500 / network error.
    throw new ApiError(res.status, body.error || `Error ${res.status}`);
  }
  return res.json();
}

export interface Me {
  email: string;
  role: 'admin' | 'abogado';
}

export const api = {
  me: () => request<Me>('/me'),
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
