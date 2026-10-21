from uuid import UUID
from typing import Literal

import re

from pydantic import BaseModel, ConfigDict, Field, field_validator

ReadingStatus = Literal["to_read", "reading", "compleated", "abandoned"]

class BookBase(BaseModel):
    title: str = Field(max_length=100)
    author: str = Field(max_length=100)
    isbn: str | None = Field(default=None, max_length=13)
    description: str | None = Field(default=None, max_length=500)
    publication_year: int | None = None
    cover_url: str | None = Field(default=None, max_length=200)
    reading_status: ReadingStatus = "to_read"
    provider: str | None = Field(default=None, max_length=50)
    external_id: str | None = Field(default=None, max_length=100)


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=100)
    author: str | None = Field(default=None, max_length=100)
    isbn: str | None = Field(default=None, max_length=13)
    description: str | None = Field(default=None, max_length=500)
    publication_year: int | None = None
    cover_url: str | None = Field(default=None, max_length=200)
    reading_status: ReadingStatus | None = None
    provider: str | None = Field(default=None, max_length=50)
    external_id: str | None = Field(default=None, max_length=100)


class Book(BookBase):
    id: UUID
    created_at: str
    updated_at: str

    model_config = ConfigDict(from_attributes=True)

    @field_validator("publication_year", mode="before")
    @classmethod
    def parse_publication_year(cls, value):
        if isinstance(value, str):
            match = re.search(r"\d{4}", value)
            return int(match.group()) if match else None
        return value