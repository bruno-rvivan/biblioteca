from pydantic import BaseModel, Field


class GuideonRequest(BaseModel):
    content: str = Field(
        min_length=1,
        description="Mensagem enviada ao Guideon"
    )


class GuideonResponse(BaseModel):
    content: str
    session_id: str



class GuideonSessionSummary(BaseModel):
    session_id: str
    session_name: str
    created_at: int | None = None
    updated_at: int | None = None


class GuideonSessionsResponse(BaseModel):
    sessions: list[GuideonSessionSummary]



class GuideonMessage(BaseModel):
    role: str
    content: str


class GuideonSessionDetail(BaseModel):
    session_id: str
    session_name: str
    created_at: int | None = None
    updated_at: int | None = None
    messages: list[GuideonMessage]
