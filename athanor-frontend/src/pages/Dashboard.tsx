import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, MessageCircle, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { booksApi, guideonApi } from "../services/api";
import type { Book, GuideonSession } from "../types";

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [sessions, setSessions] = useState<GuideonSession[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.allSettled([booksApi.list(), guideonApi.sessions()])
      .then(([bookResult, sessionResult]) => {
        const errors: string[] = [];
        if (bookResult.status === "fulfilled") setBooks(bookResult.value);
        else errors.push(`biblioteca: ${bookResult.reason instanceof Error ? bookResult.reason.message : "falha ao carregar"}`);
        if (sessionResult.status === "fulfilled") setSessions(sessionResult.value.sessions || []);
        else errors.push(`Guideon: ${sessionResult.reason instanceof Error ? sessionResult.reason.message : "falha ao carregar"}`);
        if (errors.length) setError(errors.join(" · "));
      })
      .finally(() => setLoading(false));
  }, []);
  const readingCount = books.filter(book => book.reading_status === "reading").length;
  const completedCount = books.filter(book => book.reading_status === "compleated").length;
  const dateLabel = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(new Date()).toUpperCase();

  return <div className="page">
    <PageHeader eyebrow={dateLabel} title="Seu espaço de reflexão." description="Uma biblioteca não é feita apenas de livros lidos, mas também das ideias que permanecem." />
    <section className="welcome-panel"><div className="welcome-copy"><span className="eyebrow gold">O FOGO CONTINUA ACESO</span><h2>Leia. Reflita. Questione.</h2><p>Registre suas impressões, conecte ideias e converse com Guideon sobre aquilo que está lendo.</p><Link className="text-link" to="/library">Explorar biblioteca <ArrowUpRight size={16}/></Link></div><div className="ornament"><div className="ornament-ring"/><Sparkles size={36}/><span>ATHANOR</span></div></section>
    <div className="section-heading"><div><div className="eyebrow">PANORAMA</div><h2>Seu percurso</h2></div></div>
    {error && <div className="notice notice-error">Não foi possível carregar todo o panorama: {error}</div>}
    <div className="stats-grid">
      <div className="stat-card"><span className="stat-icon"><BookOpen size={18}/></span><span className="stat-label">LIVROS NA BIBLIOTECA</span><strong>{loading ? "—" : books.length}</strong><small>Obras no seu acervo</small></div>
      <div className="stat-card"><span className="stat-icon"><BookOpen size={18}/></span><span className="stat-label">EM LEITURA</span><strong>{loading ? "—" : readingCount}</strong><small>{completedCount} concluído(s)</small></div>
      <div className="stat-card"><span className="stat-icon"><MessageCircle size={18}/></span><span className="stat-label">CONVERSAS COM GUIDEON</span><strong>{loading ? "—" : sessions.length}</strong><small>Ideias em debate</small></div>
    </div>
    <div className="dashboard-bottom">
      <div className="empty-card"><div className="empty-icon"><BookOpen size={22}/></div><h3>{books.length ? "Continue seu percurso." : "Sua próxima leitura começa aqui."}</h3><p>{books.length ? `${books.length} obra(s) fazem parte do seu acervo.` : "Adicione livros à biblioteca para organizar seu percurso literário."}</p><Link className="button button-primary" to="/library"><Plus size={16}/> {books.length ? "Abrir biblioteca" : "Adicionar livro"}</Link></div>
      <div className="guide-card"><div className="guide-card-top"><span className="eyebrow gold">SEU COMPANHEIRO DE DEBATE</span><Sparkles size={18}/></div><h3>Uma ideia merece ser examinada.</h3><p>Leve suas anotações, dúvidas e interpretações para uma conversa com Guideon.</p><Link className="text-link" to="/guideon">Conversar com Guideon <ArrowUpRight size={16}/></Link></div>
    </div>
  </div>;
}
