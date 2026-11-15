import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { booksApi } from "../services/api";
import type { Book } from "../types";

export default function BookDetail() {
  const { bookId = "" } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { booksApi.get(bookId).then(setBook).catch((e: Error) => setError(e.message)); }, [bookId]);
  if (error) return <div className="page"><Link className="text-link" to="/library"><ArrowLeft size={16}/> Voltar à biblioteca</Link><div className="notice notice-error">{error}<p>Confira o contrato do endpoint GET /books/{`{book_id}`}.</p></div></div>;
  if (!book) return <div className="page"><div className="notice">Carregando livro...</div></div>;
  return <div className="page"><Link className="back-link" to="/library"><ArrowLeft size={16}/> Biblioteca</Link><PageHeader eyebrow="DETALHES DA OBRA" title={book.title} description={book.author || "Autor desconhecido"}/><div className="detail-layout"><div className="detail-cover"><BookOpen size={42}/><span>ATHANOR</span></div><div className="detail-panel"><div className="eyebrow">SOBRE ESTA LEITURA</div><p>{book.description || "Nenhuma descrição registrada."}</p><div className="divider"/><span className="stat-label">STATUS</span><p>{book.reading_status || "Não definido"}</p></div></div><section className="notes-placeholder"><div className="eyebrow">CADERNO DE LEITURA</div><h2>Anotações e reflexões</h2><p>A integração das anotações será conectada aos schemas reais do backend.</p></section></div>;
}