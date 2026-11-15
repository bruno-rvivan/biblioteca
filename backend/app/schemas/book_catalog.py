from pydantic import BaseModel


class BookCatalogResult(BaseModel):
    title: str
    authors: list[str]
    publication_year: int | None = None
    isbn: list[str]
    cover_url: str | None = None
    external_id: str | None = None
