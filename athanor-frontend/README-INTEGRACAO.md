# Athanor — frontend integrado

Frontend React + TypeScript + Vite conectado aos endpoints presentes no backend enviado.

## Executar

1. Extraia esta pasta ao lado da pasta `backend` (ou mantenha-a separada).
2. Na pasta `athanor-frontend`, crie `.env` a partir de `.env.example` se necessário.
3. Configure `VITE_API_URL=http://127.0.0.1:8000`.
4. Execute `npm install` e `npm run dev`.
5. Inicie o backend com `uvicorn app.main:app --reload` a partir da pasta `backend`.

O backend atual permite CORS para `http://localhost:5173` e `http://127.0.0.1:5173`.

## Endpoints utilizados

### Livros (`/books`)
- `GET /books/` — listar livros
- `POST /books/` — cadastrar livro
- `GET /books/{book_id}` — buscar livro
- `PATCH /books/{book_id}` — atualizar livro
- `DELETE /books/{book_id}` — excluir livro
- `GET /books/catalog/search?q=...&limit=10` — pesquisar catálogo Open Library

### Notas (`/reading-notes`)
- `GET /reading-notes/book/{book_id}` — listar notas de um livro
- `POST /reading-notes/` — criar nota
- `GET /reading-notes/{note_id}` — buscar nota
- `PATCH /reading-notes/{note_id}` — atualizar nota
- `DELETE /reading-notes/{note_id}` — excluir nota

### Guideon (`/guideon`)
- `GET /guideon/sessions` — listar conversas
- `POST /guideon/sessions` — iniciar conversa
- `GET /guideon/sessions/{session_id}` — recuperar histórico
- `POST /guideon/sessions/{session_id}/messages` — enviar mensagem

## Observações de contrato

- `reading_status` aceita `to_read`, `reading`, `compleated` e `abandoned`. O valor `compleated` mantém a grafia definida pelo backend.
- Tipos de nota aceitos: `reflection`, `question`, `quote` e `interpretation`.
- `chapter`, `content`, `title` e `author` são obrigatórios nos respectivos formulários.
- A exclusão de um livro que ainda possui notas é bloqueada pelo backend; exclua as notas primeiro.
- A criação a partir da Open Library usa o resultado da pesquisa para preencher o formulário. O usuário ainda confirma e salva o livro no banco local.
- A API do Guideon devolve timestamps numéricos para sessões; a interface não depende de formatação desses campos.
