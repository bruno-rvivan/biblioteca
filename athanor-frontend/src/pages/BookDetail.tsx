import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, BookOpen, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { booksApi, notesApi } from "../services/api";
import type { Book, NoteType, ReadingNote, ReadingStatus } from "../types";

const statusLabels: Record<ReadingStatus, string> = { to_read: "Quero ler", reading: "Em leitura", compleated: "Concluído", abandoned: "Abandonado" };
const noteLabels: Record<NoteType, string> = { reflection: "Reflexão", question: "Pergunta", quote: "Citação", interpretation: "Interpretação" };
const blankNote = { chapter: "", page: "", note_type: "reflection" as NoteType, content: "" };

export default function BookDetail() {
  const { bookId = "" } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [notes, setNotes] = useState<ReadingNote[]>([]);
  const [error, setError] = useState("");
  const [notesError, setNotesError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(false);
  const [bookSaving, setBookSaving] = useState(false);
  const [bookForm, setBookForm] = useState({ title: "", author: "", description: "", reading_status: "to_read" as ReadingStatus });
  const [noteForm, setNoteForm] = useState(blankNote);
  const [noteSaving, setNoteSaving] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const [bookData, noteData] = await Promise.all([booksApi.get(bookId), notesApi.listForBook(bookId)]);
      setBook(bookData); setNotes(noteData);
      setBookForm({ title: bookData.title, author: bookData.author, description: bookData.description || "", reading_status: bookData.reading_status });
      setNotesError("");
    } catch (e) {
      const message = (e as Error).message;
      // A falha ao carregar as notas não deve esconder um livro que foi encontrado.
      try {
        const bookData = await booksApi.get(bookId);
        setBook(bookData); setBookForm({ title: bookData.title, author: bookData.author, description: bookData.description || "", reading_status: bookData.reading_status });
        setNotesError(message);
      } catch { setError(message); }
    } finally { setLoading(false); }
  };
  useEffect(() => { void loadData(); }, [bookId]);

  const saveBook = async (event: FormEvent) => {
    event.preventDefault(); if (!book) return;
    setBookSaving(true); setActionError("");
    try {
      const updated = await booksApi.update(book.id, {
        title: bookForm.title.trim(), author: bookForm.author.trim(),
        description: bookForm.description.trim() || null, reading_status: bookForm.reading_status,
      });
      setBook(updated); setEditingBook(false);
    } catch (e) { setActionError((e as Error).message); }
    finally { setBookSaving(false); }
  };

  const saveNote = async (event: FormEvent) => {
    event.preventDefault(); setNoteSaving(true); setActionError("");
    try {
      const payload = { chapter: noteForm.chapter.trim(), page: noteForm.page ? Number(noteForm.page) : null, note_type: noteForm.note_type, content: noteForm.content.trim() };
      if (editingNoteId) await notesApi.update(editingNoteId, payload);
      else await notesApi.create({ book_id: bookId, ...payload });
      setNoteForm(blankNote); setEditingNoteId(null); setNotes(await notesApi.listForBook(bookId));
    } catch (e) { setActionError((e as Error).message); }
    finally { setNoteSaving(false); }
  };

  const startEditNote = (note: ReadingNote) => {
    setEditingNoteId(note.id);
    setNoteForm({ chapter: note.chapter, page: note.page === null ? "" : String(note.page), note_type: note.note_type, content: note.content });
    setActionError("");
  };

  const deleteNote = async (id: string) => {
    if (!window.confirm("Excluir esta anotação permanentemente?")) return;
    try { await notesApi.remove(id); setNotes(current => current.filter(note => note.id !== id)); }
    catch (e) { setActionError((e as Error).message); }
  };

  const deleteBook = async () => {
    if (!book || !window.confirm(`Excluir “${book.title}” da biblioteca?`)) return;
    try { await booksApi.remove(book.id); navigate("/library"); }
    catch (e) { setActionError((e as Error).message); }
  };

  if (loading) return <div className="page"><div className="notice">Carregando livro...</div></div>;
  if (error || !book) return <div className="page"><Link className="text-link" to="/library"><ArrowLeft size={16}/> Voltar à biblioteca</Link><div className="notice notice-error">{error || "Livro não encontrado."}</div></div>;

  return <div className="page">
    <Link className="back-link" to="/library"><ArrowLeft size={16}/> Biblioteca</Link>
    <PageHeader eyebrow="DETALHES DA OBRA" title={book.title} description={book.author || "Autor desconhecido"} action={<div className="header-actions"><button className="button" onClick={() => setEditingBook(value => !value)}><Pencil size={14}/> Editar</button><button className="button button-danger" onClick={() => void deleteBook()}><Trash2 size={14}/> Excluir</button></div>} />
    {actionError && <div className="inline-error action-error">{actionError}</div>}
    <div className="detail-layout"><div className="detail-cover">{book.cover_url ? <img src={book.cover_url} alt={`Capa de ${book.title}`}/> : <><BookOpen size={42}/><span>ATHANOR</span></>}</div><div className="detail-panel">
      <div className="eyebrow">SOBRE ESTA LEITURA</div><p>{book.description || "Nenhuma descrição registrada."}</p><div className="divider"/><span className="stat-label">STATUS</span><p>{statusLabels[book.reading_status] || book.reading_status}</p>
      {book.publication_year && <><span className="stat-label">PUBLICAÇÃO</span><p>{book.publication_year}</p></>}
      {book.isbn && <><span className="stat-label">ISBN</span><p>{book.isbn}</p></>}
      {editingBook && <form className="data-form edit-book-form" onSubmit={saveBook}>
        <label>Título<input required maxLength={100} value={bookForm.title} onChange={e => setBookForm({...bookForm,title:e.target.value})}/></label>
        <label>Autor<input required maxLength={100} value={bookForm.author} onChange={e => setBookForm({...bookForm,author:e.target.value})}/></label>
        <label>Status<select value={bookForm.reading_status} onChange={e => setBookForm({...bookForm,reading_status:e.target.value as ReadingStatus})}>{Object.entries(statusLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="field-wide">Descrição<textarea maxLength={500} rows={3} value={bookForm.description} onChange={e => setBookForm({...bookForm,description:e.target.value})}/></label>
        <div className="form-actions field-wide"><button type="button" className="button" onClick={() => setEditingBook(false)}>Cancelar</button><button className="button button-primary" disabled={bookSaving}><Save size={14}/>{bookSaving ? "Salvando..." : "Salvar alterações"}</button></div>
      </form>}
    </div></div>

    <section className="notes-section">
      <div className="notes-section-heading"><div><div className="eyebrow">CADERNO DE LEITURA</div><h2>Anotações e reflexões</h2></div><span className="result-count">{notes.length} REGISTROS</span></div>
      {notesError && <div className="notice notice-error">Não foi possível carregar as notas: {notesError}</div>}
      <form className="editor-panel note-editor" onSubmit={saveNote}>
        <div className="editor-heading"><div><div className="eyebrow gold">{editingNoteId ? "EDITAR REGISTRO" : "REGISTRAR PENSAMENTO"}</div><h2>{editingNoteId ? "Editar anotação" : "Nova anotação"}</h2></div>{editingNoteId && <button type="button" className="icon-button" onClick={() => {setEditingNoteId(null);setNoteForm(blankNote);}} aria-label="Cancelar edição"><X size={18}/></button>}</div>
        <div className="data-form">
          <label>Capítulo / seção<input required maxLength={100} value={noteForm.chapter} onChange={e => setNoteForm({...noteForm,chapter:e.target.value})} placeholder="Ex.: Capítulo III"/></label>
          <label>Página<input type="number" min="1" value={noteForm.page} onChange={e => setNoteForm({...noteForm,page:e.target.value})} placeholder="Opcional"/></label>
          <label>Tipo<select value={noteForm.note_type} onChange={e => setNoteForm({...noteForm,note_type:e.target.value as NoteType})}>{Object.entries(noteLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="field-wide">Conteúdo<textarea required maxLength={500} rows={4} value={noteForm.content} onChange={e => setNoteForm({...noteForm,content:e.target.value})} placeholder="Registre uma ideia, passagem ou pergunta..."/></label>
          <div className="form-actions field-wide"><button className="button button-primary" disabled={noteSaving}><Plus size={14}/>{noteSaving ? "Salvando..." : editingNoteId ? "Salvar anotação" : "Adicionar anotação"}</button></div>
        </div>
      </form>
      {notes.length === 0 ? <div className="empty-state notes-empty"><BookOpen size={26}/><h3>Este caderno ainda está em branco.</h3><p>Registre sua primeira reflexão, pergunta, citação ou interpretação.</p></div> : <div className="notes-list">{notes.map(note => <article className="note-card" key={note.id}><div className="note-card-top"><div><span className="note-type">{noteLabels[note.note_type]}</span><h3>{note.chapter}{note.page ? ` · p. ${note.page}` : ""}</h3></div><div className="note-actions"><button className="icon-button" onClick={() => startEditNote(note)} aria-label="Editar anotação"><Pencil size={15}/></button><button className="icon-button danger-icon" onClick={() => void deleteNote(note.id)} aria-label="Excluir anotação"><Trash2 size={15}/></button></div></div><p>{note.content}</p></article>)}</div>}
    </section>
  </div>;
}
