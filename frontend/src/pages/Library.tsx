import { useEffect, useState } from "react";
import { BookOpen, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { booksApi } from "../services/api";
import type { Book } from "../types";

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    booksApi.list().then(setBooks).catch((e: Error) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const filtered = books.filter(book => `${book.title} ${book.author || ""}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="page">
    <PageHeader eyebrow="ACERVO PESSOAL" title="Biblioteca" description="Seus livros, leituras e caminhos de pensamento." action={<button className="button button-primary" disabled><Plus size={16}/> Novo livro</button>} />
    <div className="toolbar"><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por título ou autor..."/></div><span className="result-count">{books.length} REGISTROS</span></div>
    {loading ? <div className="notice">Carregando biblioteca...</div> : error ? <div className="notice notice-error"><strong>Não foi possível carregar os livros.</strong><p>{error}</p><small>Confira se a API está ativa e se a rota GET /books corresponde ao backend.</small></div> : filtered.length ? <div className="book-grid">{filtered.map(book => <Link to={`/books/${book.id}`} className="book-card" key={book.id}><div className="book-cover"><BookOpen size={28}/><span>ATHANOR</span></div><div className="book-info"><h3>{book.title}</h3><p>{book.author || "Autor desconhecido"}</p><span className="book-status">{book.reading_status || "NA BIBLIOTECA"}</span></div></Link>)}</div> : <div className="empty-state"><BookOpen size={30}/><h3>{query ? "Nenhum livro encontrado." : "Sua biblioteca ainda está vazia."}</h3><p>{query ? "Tente outro termo de busca." : "Quando a integração com seus endpoints estiver ajustada, seus livros aparecerão aqui."}</p></div>}
  </div>;
}