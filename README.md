# Athanor

**Athanor** é uma biblioteca literária pessoal desenvolvida para organizar leituras, registrar reflexões e aprofundar a relação com os livros por meio de um companheiro de inteligência artificial.

Mais do que um catálogo de livros, o projeto busca oferecer um espaço para acompanhar a jornada literária, preservar ideias e desenvolver interpretações próprias sobre as obras.

O projeto também tem como objetivo explorar, na prática, o desenvolvimento de aplicações com Python, FastAPI, bancos de dados relacionais e agentes de inteligência artificial.

## Funcionalidades

### Biblioteca literária
- Cadastro e organização de livros.
- Acompanhamento do status de leitura.
- Armazenamento de informações como título, autor, ISBN, descrição e capa.
- Consulta de informações bibliográficas por meio da Open Library.

### Caderno de leitura
- Registro de anotações vinculadas a livros.
- Organização por capítulo e página.
- Diferentes categorias de anotações:
  - Reflexões;
  - Perguntas;
  - Citações;
  - Interpretações.

### Guideon — Companheiro literário

O Guideon é um agente de inteligência artificial desenvolvido para conversar sobre as leituras e anotações registradas na biblioteca.

Suas principais propostas são:
- Debater ideias e interpretações literárias.
- Recuperar anotações relevantes durante as conversas.
- Relacionar diferentes reflexões registradas pelo leitor.
- Pesquisar informações externas quando necessário.
- Manter o histórico das conversas.

## Tecnologias

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite / PostgreSQL
- Agno
- Groq
- Open Library API

### Frontend
- React
- TypeScript
- Vite
- React Router
- Lucide React

## Estrutura do projeto

```text
athanor/
│
├── backend/
│   └── app/
│       ├── api/
│       │   ├── books.py
│       │   ├── reading_notes.py
│       │   └── guideon.py
│       │
│       ├── core/
│       │   └── config.py
│       │
│       ├── db/
│       │   ├── base.py
│       │   ├── database.py
│       │   └── session.py
│       │
│       ├── models/
│       │   ├── books.py
│       │   └── reading_notes.py
│       │
│       ├── schemas/
│       │   ├── books.py
│       │   ├── reading_notes.py
│       │   └── guideon.py
│       │
│       ├── services/
│       │   ├── agent.py
│       │   ├── book_catalog.py
│       │   └── note_tools.py
│       │
│       ├── prompts/
│       │   ├── system.md
│       │   ├── method.md
│       │   └── description.md
│       │
│       └── main.py
│
└── athanor-frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        ├── types/
        ├── App.tsx
        └── main.tsx
```

## Instalação e execução

### 1. Clonar o repositório

```bash
git clone https://github.com/bruno-rvivan/biblioteca.git
cd biblioteca
```

### 2. Backend

Entre na pasta do backend:

```bash
cd backend
```

Crie e ative um ambiente virtual:

```bash
python -m venv venv
source venv/bin/activate
```

Instale as dependências do projeto:

```bash
pip install -r requirements.txt
```

Configure as variáveis de ambiente necessárias, incluindo a chave da Groq e a URL do banco de dados.

Exemplo:

```env
DATABASE_URL=sqlite:///./books.db
GROQ_API_KEY=sua_chave_aqui
```

Inicie a aplicação:

```bash
uvicorn app.main:app --reload
```

O backend estará disponível em:

```text
http://127.0.0.1:8000
```

A documentação interativa da API pode ser acessada em:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd athanor-frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` com base no `.env.example`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível normalmente em:

```text
http://localhost:5173
```

## Integração com serviços externos

### Open Library

O Athanor utiliza a Open Library para consultar informações bibliográficas e facilitar o cadastro de livros.

Documentação: https://openlibrary.org/developers/api

### Groq

O Guideon utiliza modelos disponibilizados pela Groq para processar as conversas e gerar respostas.

A chave de API deve ser configurada por variável de ambiente.

Documentação: https://console.groq.com/docs

## Desenvolvimento

O projeto está organizado em duas aplicações independentes:

**Backend:** responsável pelas regras de negócio, persistência de dados, exposição dos endpoints e execução do agente Guideon.

**Frontend:** responsável pela interface, navegação e comunicação com a API.

A separação permite desenvolver e modificar cada camada independentemente.

## Status do projeto

O Athanor está em desenvolvimento.

As principais áreas de evolução são:
- Consolidar a integração entre frontend e backend.
- Completar as operações CRUD de livros e anotações.
- Aprimorar a persistência e recuperação das conversas do Guideon.
- Melhorar a recuperação contextual de anotações pelo agente.
- Refinar a experiência de leitura e organização da biblioteca.

## Objetivo

O Athanor nasceu como um projeto pessoal de aprendizado e como uma tentativa de construir uma ferramenta que torne a leitura uma atividade mais reflexiva.

A proposta é transformar a biblioteca em um espaço de diálogo entre livros, ideias e leitor.
