from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

class ReadingNoteBase(BaseModel):
    chapter: str = Field(max_length=100)
    page: int | None = None
    note_type: Literal["reflection", "question", "quote", "interpretation"] = "reflection"
    content: str = Field(max_length=500)


class ReadingNoteCreate(ReadingNoteBase):
    book_id: UUID


class ReadingNoteUpdate(BaseModel):
    chapter: str | None = Field(default=None, max_length=100)
    page: int | None = None
    note_type: Literal["reflection", "question", "quote", "interpretation"] | None = None
    content: str | None = Field(default=None, max_length=500)


class ReadingNote(ReadingNoteBase):
    id: UUID
    book_id: UUID
    created_at: str
    updated_at: str

    model_config = ConfigDict(from_attributes=True)

