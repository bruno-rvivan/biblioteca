export type ReadingStatus = "to_read" | "reading" | "compleated" | "abandoned";
export type NoteType = "reflection" | "question" | "quote" | "interpretation";

export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  publication_year: number | null;
  cover_url: string | null;
  reading_status: ReadingStatus;
  provider: string | null;
  external_id: string | null;
  created_at: string;
  updated_at: string;
};

export type BookPayload = Omit<Book, "id" | "created_at" | "updated_at">;
export type BookUpdate = Partial<BookPayload>;

export type ReadingNote = {
  id: string;
  book_id: string;
  chapter: string;
  page: number | null;
  note_type: NoteType;
  content: string;
  created_at: string;
  updated_at: string;
};

export type ReadingNotePayload = Pick<ReadingNote, "book_id" | "chapter" | "page" | "note_type" | "content">;
export type ReadingNoteUpdate = Partial<Omit<ReadingNotePayload, "book_id">>;

export type BookCatalogResult = {
  title: string;
  authors: string[];
  publication_year: number | null;
  isbn: string[];
  cover_url: string | null;
  external_id: string | null;
};

export type GuideonSession = {
  session_id: string;
  session_name?: string | null;
  created_at?: number | null;
  updated_at?: number | null;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type GuideonSessionDetail = GuideonSession & { messages: ChatMessage[] };
