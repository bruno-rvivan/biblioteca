import { ArrowUpRight, BookOpen, MessageCircle, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function Dashboard() {
  return <div className="page">
    <PageHeader eyebrow="DOMINGO, 15 DE NOVEMBRO" title="Seu espaço de reflexão." description="Uma biblioteca não é feita apenas de livros lidos, mas também das ideias que permanecem." />
    <section className="welcome-panel">
      <div className="welcome-copy"><span className="eyebrow gold">O FOGO CONTINUA ACESO</span><h2>Leia. Reflita. Questione.</h2><p>Registre suas impressões, conecte ideias e converse com Guideon sobre aquilo que está lendo.</p><Link className="text-link" to="/library">Explorar biblioteca <ArrowUpRight size={16}/></Link></div>
      <div className="ornament"><div className="ornament-ring"/><Sparkles size={36}/><span>ATHANOR</span></div>
    </section>
    <div className="section-heading"><div><div className="eyebrow">PANORAMA</div><h2>Seu percurso</h2></div></div>
    <div className="stats-grid">
      <div className="stat-card"><span className="stat-icon"><BookOpen size={18}/></span><span className="stat-label">LIVROS NA BIBLIOTECA</span><strong>—</strong><small>Conecte sua biblioteca</small></div>
      <div className="stat-card"><span className="stat-icon"><BookOpen size={18}/></span><span className="stat-label">EM LEITURA</span><strong>—</strong><small>Seu progresso atual</small></div>
      <div className="stat-card"><span className="stat-icon"><MessageCircle size={18}/></span><span className="stat-label">CONVERSAS COM GUIDEON</span><strong>—</strong><small>Ideias em debate</small></div>
    </div>
    <div className="dashboard-bottom">
      <div className="empty-card"><div className="empty-icon"><BookOpen size={22}/></div><h3>Sua próxima leitura começa aqui.</h3><p>Adicione livros à biblioteca para organizar seu percurso literário.</p><Link className="button button-primary" to="/library"><Plus size={16}/> Adicionar livro</Link></div>
      <div className="guide-card"><div className="guide-card-top"><span className="eyebrow gold">SEU COMPANHEIRO DE DEBATE</span><Sparkles size={18}/></div><h3>Uma ideia merece ser examinada.</h3><p>Leve suas anotações, dúvidas e interpretações para uma conversa com Guideon.</p><Link className="text-link" to="/guideon">Conversar com Guideon <ArrowUpRight size={16}/></Link></div>
    </div>
  </div>;
}