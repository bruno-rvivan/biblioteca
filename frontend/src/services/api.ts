const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Erro HTTP ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const guideonApi = {
  sessions: () => api<{ sessions?: import("../types").GuideonSession[] } | import("../types").GuideonSession[]>("/guideon/sessions"),
  history: (id: string) => api<{ session_id: string; messages: import("../types").ChatMessage[] }>(`/guideon/sessions/${id}`),
  start: (content: string) => api<{ content: string; session_id: string }>("/guideon/sessions", {
    method: "POST", body: JSON.stringify({ content }),
  }),
  send: (id: string, content: string) => api<{ content: string; session_id: string }>(`/guideon/sessions/${id}/messages`, {
    method: "POST", body: JSON.stringify({ content }),
  }),
};

// Os caminhos e formatos de livros/anotações serão ajustados aos schemas reais do backend.
export const booksApi = {
  list: () => api<import("../types").Book[]>("/books"),
  get: (id: string) => api<import("../types").Book>(`/books/${id}`),
};