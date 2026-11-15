import { BookOpen, Flame, Library, MessageCircle, PanelsTopLeft } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Flame size={21}/></div><div><strong>ATHANOR</strong><span>DIÁRIO LITERÁRIO</span></div></div>
      <div className="nav-label">ESPAÇO DE LEITURA</div>
      <nav>
        <NavLink to="/" end><PanelsTopLeft size={18}/> Visão geral</NavLink>
        <NavLink to="/library"><Library size={18}/> Biblioteca</NavLink>
        <NavLink to="/guideon"><MessageCircle size={18}/> Guideon <span className="nav-dot"/></NavLink>
      </nav>
      <div className="sidebar-bottom"><div className="quote-mark">“</div><p>Um livro é um espelho: se um macaco olha, não vê um apóstolo.</p><span>— GEORG LICHTENBERG</span></div>
      <div className="sidebar-foot"><BookOpen size={14}/> Um lugar para pensar.</div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">SUA BIBLIOTECA <span>/</span> <b>ESPAÇO PESSOAL</b></div><div className="topbar-right"><span className="status-dot"/> <span>ESPAÇO PRIVADO</span></div></header>
      <div className="page-content">{children}</div>
    </main>
  </div>;
}