from fastapi import APIRouter, HTTPException, status

from app.schemas.guideon import (
    GuideonRequest,
    GuideonResponse,
    GuideonSessionDetail,
    GuideonSessionsResponse,
)
from app.services.agent import get_session_history, list_sessions, run_agent


router = APIRouter()


@router.post("/sessions", response_model=GuideonResponse)
def create_session(request: GuideonRequest):
    try:
        data = run_agent(
            query=request.content,
        )

        return GuideonResponse(**data)

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao iniciar conversa com o Guideon.",
        ) from error


@router.post(
    "/sessions/{session_id}/messages",
    response_model=GuideonResponse,
)
def send_message(session_id: str, request: GuideonRequest):
    try:
        data = run_agent(
            query=request.content,
            session_id=session_id,
        )

        return GuideonResponse(**data)

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao enviar mensagem ao Guideon.",
        ) from error


@router.get(
    "/sessions",
    response_model=GuideonSessionsResponse,
)
def get_sessions():
    try:
        sessions = list_sessions()

        return GuideonSessionsResponse(
            sessions=sessions
        )

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao listar conversas do Guideon.",
        ) from error



@router.get(
    "/sessions/{session_id}",
    response_model=GuideonSessionDetail,
)
def get_session(session_id: str):
    try:
        data = get_session_history(session_id)

        if data is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversa não encontrada.",
            )

        return GuideonSessionDetail(**data)

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao recuperar conversa do Guideon.",
        ) from error
