from agno.agent import Agent
from agno.models.groq import Groq
from agno.tools.websearch import WebSearchTools
from agno.db.sqlite import SqliteDb

from app.services.note_tools import search_reading_notes

from pathlib import Path

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"

system_prompt = (PROMPTS_DIR / "system.md").read_text(encoding="utf-8")

method_prompt = (PROMPTS_DIR / "method.md").read_text(encoding="utf-8")

description = (PROMPTS_DIR / "description.md").read_text(encoding="utf-8")

db = SqliteDb(db_url="sqlite:////home/bruno/Documentos/Projects/biblioteca/backend/data/agent.db")

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


while True:
    user_input = input("Digite sua pergunta (ou 'sair' para encerrar): ")
    if user_input.lower() == "sair":
        break

    guideon.print_response(user_input, stream=True)