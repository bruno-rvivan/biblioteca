from agno.agent import Agent
from agno.models.groq import Groq
from agno.tools.websearch import WebSearchTools
from agno.db.sqlite import SqliteDb

from app.services.note_tools import search_reading_notes

from uuid import uuid4

from pathlib import Path

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"

system_prompt = (PROMPTS_DIR / "system.md").read_text(encoding="utf-8")

method_prompt = (PROMPTS_DIR / "method.md").read_text(encoding="utf-8")

description = (PROMPTS_DIR / "description.md").read_text(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

AGENT_DB_PATH = DATA_DIR / "agent.db"


db = SqliteDb(db_url=f"sqlite:///{AGENT_DB_PATH}")


guideon = Agent(
    model=Groq(id="openai/gpt-oss-120b"),
    description=description,
    instructions=[system_prompt, method_prompt],
    tools=[search_reading_notes, WebSearchTools(backend='duckduckgo')],
    db=db,
    update_memory_on_run=True,
    add_history_to_context=True,
    num_history_runs=5,
    enable_session_summaries=True,
    read_chat_history=True
)


def run_agent(query: str, session_id: str | None = None):
    if session_id is None:
        session_id = str(uuid4())

    response = guideon.run(
        query,
        session_id=session_id,
    )

    return {
        "content": response.content,
        "session_id": response.session_id,
    }



def list_sessions(limit: int = 20, page: int = 1):
    sessions = db.get_sessions(
        limit=limit,
        page=page,
        sort_by="updated_at",
        sort_order="desc",
        include_runs=False,
    )

    return [
        {
            "session_id": session.session_id,
            "session_name": (session.session_data or {}).get(
                "session_name"
            ) or "Nova conversa",
            "created_at": session.created_at,
            "updated_at": session.updated_at,
        }
        for session in sessions
    ]



def get_session_history(session_id: str):
    session = db.get_session(
        session_id=session_id,
        runs_limit=100,
    )

    if session is None:
        return None

    messages = session.get_chat_history()

    return {
        "session_id": session.session_id,
        "session_name": (session.session_data or {}).get(
            "session_name"
        ) or "Nova conversa",
        "created_at": session.created_at,
        "updated_at": session.updated_at,
        "messages": [
            {
                "role": message.role,
                "content": message.content,
            }
            for message in messages
            if message.role in ("user", "assistant")
            and message.content is not None
        ],
    }


