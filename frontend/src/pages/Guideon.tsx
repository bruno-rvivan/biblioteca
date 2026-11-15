import { FormEvent, useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Plus, Sparkles } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { guideonApi } from "../services/api";
import type { ChatMessage, GuideonSession } from "../types";

export default function Guideon() {
  const [sessions, setSessions] = useState<GuideonSession[]>([]);
  const [activeId, setActiveId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadSessions = async () => {
    try {
      const result = await guideonApi.sessions();
      setSessions(Array.isArray(result) ? result : result.sessions || []);
    } catch (e) { setError((e as Error).message); }
  };
  useEffect(() => { void loadSessions(); }, []);

  const openSession = async (id: string) => {
    setActiveId(id); setError("");
    try { const data = await guideonApi.history(id); setMessages(data.messages || []); }
    catch (e) { setError((e as Error).message); }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || busy) return;
    setInput(""); setBusy(true); setError("");
    setMessages(current => [...current, { role: "user", content }]);
    try {
      const result = activeId ? await guideonApi.send(activeId, content) : await guideonApi.start(content);
      setActiveId(result.session_id);
      setMessages(current => [...current, { role: "assistant", content: result.content }]);
      await loadSessions();
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };

  const newConversation = () => { setActiveId(""); setMessages([]); setError(""); };
  return <div className="page guideon-page">
    <PageHeader eyebrow="COMPANHEIRO INTELECTUAL" title="Guideon" description="Não um oráculo, mas um interlocutor. Traga uma ideia e examine-a por outros ângulos." />
    <div className="chat-layout">
      <aside className="chat-sidebar"><button className="button button-primary new-chat" onClick={newConversation}><Plus size={16}/> Nova conversa</button><div className="eyebrow session-heading">CONVERSAS ANTERIORES</div>{sessions.map(session => <button key={session.session_id} className={`session-item ${activeId === session.session_id ? "active" : ""}`} onClick={() => void openSession(session.session_id)}><MessageCircle size={15}/><span>{session.session_name || "Nova conversa"}</span></button>)}</aside>
      <section className="chat-main">
        <div className="chat-messages">
          {messages.length === 0 ? <div className="chat-empty"><div className="guideon-symbol"><Sparkles size={27}/></div><div className="eyebrow gold">GUIDEON ESTÁ À DISPOSIÇÃO</div><h2>O que merece ser questionado?</h2><p>Comece com uma passagem, uma dúvida ou uma interpretação. A conversa pode seguir a partir daí.</p></div> : messages.map((message, i) => <div className={`message ${message.role}`} key={i}><div className="message-avatar">{message.role === "assistant" ? <Sparkles size={15}/> : "V"}</div><div><span className="message-author">{message.role === "assistant" ? "GUIDEON" : "VOCÊ"}</span><p>{message.content}</p></div></div>)}
          {busy && <div className="typing">GUIDEON ESTÁ REFLETINDO...</div>}
          {error && <div className="inline-error">{error}</div>}
        </div>
        <form className="chat-composer" onSubmit={submit}><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Escreva sua ideia, pergunta ou reflexão..." rows={2} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void submit(e); } }}/><button className="send-button" disabled={busy || !input.trim()} aria-label="Enviar mensagem"><ArrowUp size={19}/></button><span className="composer-hint">ENTER PARA ENVIAR · SHIFT + ENTER PARA QUEBRAR LINHA</span></form>
      </section>
    </div>
  </div>;
}