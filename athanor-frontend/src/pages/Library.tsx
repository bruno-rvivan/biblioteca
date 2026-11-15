import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { BookOpen, Plus, Search, X, Library as LibraryIcon } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { booksApi } from "../services/api";
import type { Book, BookCatalogResult, BookPayload, ReadingStatus } from "../types";

const emptyForm = {
  title: "", author: "", isbn: "", description: "", publication_year: "", cover_url: "", reading_status: "to_read" as ReadingStatus,
};
const statusLabels: Record<ReadingStatus, string> = {
  to_read: "Quero ler", reading: "Em leitura", compleated: "Concluído", abandoned: "Abandonado",
};

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [catalogResults, setCatalogResults] = useState<BookCatalogResult[]>([]);
  const [catalogBusy, setCatalogBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [selectedExternalId, setSelectedExternalId] = useState<string | null>(null);

  const loadBooks = async () => {
    setLoading(true);
    try { setBooks(await booksApi.list()); setError(""); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadBooks(); }, []);

  const filtered = useMemo(() => books.filter(book => `${book.title} ${book.author || ""}`.toLowerCase().includes(query.toLowerCase())), [books, query]);

  const searchCatalog = async (event: FormEvent) => {
    event.preventDefault();
    if (catalogQuery.trim().length < 2) return;
    setCatalogBusy(true); setFormError("");
    try { setCatalogResults(await booksApi.searchCatalog(catalogQuery.trim())); }
    catch (e) { setFormError(`Falha ao consultar Open Library: ${(e as Error).message}`); }
    finally { setCatalogBusy(false); }
  };

  const selectCatalogBook = (item: BookCatalogResult) => {
    setSelectedExternalId(item.external_id || null);
    setForm(current => ({
      ...current,
      title: item.title,
      author: item.authors?.join(", ") || "",
      isbn: item.isbn?.[0] || "",
      publication_year: item.publication_year ? String(item.publication_year) : "",
      cover_url: item.cover_url || "",
    }));
    setCatalogResults([]);
    setFormError("");
  };

  const submitBook = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setFormError("");
    const payload: BookPayload = {
      title: form.title.trim(), author: form.author.trim(), isbn: form.isbn.trim() || null,
      description: form.description.trim() || null,
      publication_year: form.publication_year ? Number(form.publication_year) : null,
      cover_url: form.cover_url.trim() || null, reading_status: form.reading_status,
      provider: selectedExternalId ? "openlibrary" : null,
      external_id: selectedExternalId,
    };
    try {
      await booksApi.create(payload);
      setForm(emptyForm); setSelectedExternalId(null); setShowForm(false); setCatalogResults([]); setCatalogQuery("");
      await loadBooks();
    } catch (e) { setFormError((e as Error).message); }
    finally { setSaving(false); }
  };

  return <div className="page">
    <PageHeader eyebrow="ACERVO PESSOAL" title="Biblioteca" description="Seus livros, leituras e caminhos de pensamento." action={<button className="button button-primary" onClick={() => { setShowForm(value => !value); setFormError(""); }}><Plus size={16}/> {showForm ? "Fechar" : "Novo livro"}</button>} />

    {showForm && <section className="editor-panel">
      <div className="editor-heading"><div><div className="eyebrow gold">ADICIONAR AO ACERVO</div><h2>Novo livro</h2></div><button className="icon-button" onClick={() => setShowForm(false)} aria-label="Fechar"><X size={18}/></button></div>
      <form onSubmit={searchCatalog} className="catalog-search"><input value={catalogQuery} onChange={e => setCatalogQuery(e.target.value)} placeholder="Pesquisar título na Open Library..." minLength={2}/><button className="button" disabled={catalogBusy || catalogQuery.trim().length < 2}><Search size={15}/>{catalogBusy ? "Buscando..." : "Pesquisar catálogo"}</button></form>
      {catalogResults.length > 0 && <div className="catalog-results">{catalogResults.map((item, index) => <button type="button" className="catalog-result" key={`${item.external_id}-${index}`} onClick={() => selectCatalogBook(item)}>{item.cover_url ? <img src={item.cover_url} alt=""/> : <BookOpen size={22}/>}<span><strong>{item.title}</strong><small>{item.authors?.join(", ") || "Autor desconhecido"}{item.publication_year ? ` · ${item.publication_year}` : ""}</small></span><span className="catalog-select">Selecionar</span></button>)}</div>}
      <form onSubmit={submitBook} className="data-form">
        <label>Título<input required maxLength={100} value={form.title} onChange={e => setForm({...form, title:e.target.value})}/></label>
        <label>Autor<input required maxLength={100} value={form.author} onChange={e => setForm({...form, author:e.target.value})}/></label>
        <label>ISBN<input maxLength={13} value={form.isbn} onChange={e => setForm({...form, isbn:e.target.value})}/></label>
        <label>Ano de publicação<input type="number" min="0" max="9999" value={form.publication_year} onChange={e => setForm({...form, publication_year:e.target.value})}/></label>
        <label>Status<select value={form.reading_status} onChange={e => setForm({...form, reading_status:e.target.value as ReadingStatus})}>{Object.entries(statusLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>URL da capa<input maxLength={200} value={form.cover_url} onChange={e => setForm({...form, cover_url:e.target.value})}/></label>
        <label className="field-wide">Descrição<textarea maxLength={500} rows={3} value={form.description} onChange={e => setForm({...form, description:e.target.value})}/></label>
        {formError && <div className="inline-error field-wide">{formError}</div>}
        <div className="form-actions field-wide"><button type="button" className="button" onClick={() => setShowForm(false)}>Cancelar</button><button className="button button-primary" disabled={saving}>{saving ? "Salvando..." : "Adicionar à biblioteca"}</button></div>
      </form>
    </section>}

    <div className="toolbar"><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por título ou autor..."/></div><span className="result-count">{books.length} REGISTROS</span></div>
    {loading ? <div className="notice">Carregando biblioteca...</div> : error ? <div className="notice notice-error"><strong>Não foi possível carregar os livros.</strong><p>{error}</p><button className="button" onClick={() => void loadBooks()}>Tentar novamente</button></div> : filtered.length ? <div className="book-grid">{filtered.map(book => <Link to={`/books/${book.id}`} className="book-card" key={book.id}><div className="book-cover">{book.cover_url ? <img src={book.cover_url} alt={`Capa de ${book.title}`}/> : <><BookOpen size={28}/><span>ATHANOR</span></>}</div><div className="book-info"><h3>{book.title}</h3><p>{book.author || "Autor desconhecido"}</p><span className="book-status">{statusLabels[book.reading_status] || book.reading_status || "NA BIBLIOTECA"}</span></div></Link>)}</div> : <div className="empty-state"><LibraryIcon size={30}/><h3>{query ? "Nenhum livro encontrado." : "Sua biblioteca ainda está vazia."}</h3><p>{query ? "Tente outro termo de busca." : "Adicione um livro manualmente ou pesquise no catálogo Open Library."}</p>{!query && <button className="button button-primary" onClick={() => setShowForm(true)}><Plus size={16}/> Adicionar primeiro livro</button>}</div>}
  </div>;
}
