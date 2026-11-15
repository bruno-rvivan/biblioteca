import type {
  Book, BookCatalogResult, BookPayload, BookUpdate, GuideonSession,
  GuideonSessionDetail, ReadingNote, ReadingNotePayload, ReadingNoteUpdate,
  ChatMessage,
} from "../types";

const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 204) {
    if (!response.ok) throw new ApiError(`Erro HTTP ${response.status}`, response.status);
    return undefined as T;
  }
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text();
  if (!response.ok) {
    const detail = typeof payload === "string" ? payload : payload?.detail;
    const message = Array.isArray(detail)
      ? detail.map((item: { msg?: string }) => item.msg || "Erro de validação").join("; ")
      : detail || `Erro HTTP ${response.status}`;
    throw new ApiError(String(message), response.status);
  }
  return payload as T;
}

export const booksApi = {
  list: () => api<Book[]>("/books/"),
  get: (id: string) => api<Book>(`/books/${encodeURIComponent(id)}`),
  create: (data: BookPayload) => api<Book>("/books/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: BookUpdate) => api<Book>(`/books/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: string) => api<void>(`/books/${encodeURIComponent(id)}`, { method: "DELETE" }),
  searchCatalog: (query: string, limit = 10) => api<BookCatalogResult[]>(`/books/catalog/search?q=${encodeURIComponent(query)}&limit=${limit}`),
};

export const notesApi = {
  list: () => api<ReadingNote[]>("/reading-notes/"),
  listForBook: (bookId: string) => api<ReadingNote[]>(`/reading-notes/book/${encodeURIComponent(bookId)}`),
  get: (id: string) => api<ReadingNote>(`/reading-notes/${encodeURIComponent(id)}`),
  create: (data: ReadingNotePayload) => api<ReadingNote>("/reading-notes/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: ReadingNoteUpdate) => api<ReadingNote>(`/reading-notes/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: string) => api<void>(`/reading-notes/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export const guideonApi = {
  sessions: () => api<{ sessions: GuideonSession[] }>("/guideon/sessions"),
  history: (id: string) => api<GuideonSessionDetail>(`/guideon/sessions/${encodeURIComponent(id)}`),
  start: (content: string) => api<{ content: string; session_id: string }>("/guideon/sessions", {
    method: "POST", body: JSON.stringify({ content }),
  }),
  send: (id: string, content: string) => api<{ content: string; session_id: string }>(`/guideon/sessions/${encodeURIComponent(id)}/messages`, {
    method: "POST", body: JSON.stringify({ content }),
  }),
};

export type { ChatMessage };
