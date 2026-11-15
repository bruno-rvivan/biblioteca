export type Book = {
  id: string;
  title: string;
  author?: string | null;
  reading_status?: string;
  description?: string | null;
  cover_url?: string | null;
};

export type GuideonSession = {
  session_id: string;
  session_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };