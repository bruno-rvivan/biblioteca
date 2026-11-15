from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
import requests

from app.db.session import (
    create_book,
    delete_book_by_id,
    get_all_books,
    get_book_by_id,
    update_book,
)
from app.schemas.books import Book, BookCreate, BookUpdate
from app.schemas.book_catalog import BookCatalogResult
from app.services.book_catalog import get_book_info_by_title

router = APIRouter()


@router.get("/", response_model=list[Book])
def list_books():
    return get_all_books()


@router.post("/", response_model=Book, status_code=status.HTTP_201_CREATED)
def add_book(book_data: BookCreate):
    try:
        return create_book(book_data.model_dump())
    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="ISBN já cadastrado",
        ) from error


@router.get("/{book_id}", response_model=Book)
def get_book(book_id: UUID):
    book = get_book_by_id(book_id)
    if book is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Livro não encontrado.",
        )
    return book


@router.patch("/{book_id}", response_model=Book)
def edit_book(book_id: UUID, book_data: BookUpdate):
    updated_data = book_data.model_dump(exclude_unset=True)
    if not updated_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Informe ao menos um campo para atualizar.",
        )
    if any(updated_data.get(field, object()) is None for field in ("title", "author", "reading_status")):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Título, autor e status de leitura não podem ser nulos.",
        )

    try:
        book = update_book(book_id, updated_data)
    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Não foi possível atualizar o livro. Verifique se o ISBN já está cadastrado.",
        ) from error

    if book is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Livro não encontrado.",
        )
    return book


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_book(book_id: UUID):
    try:
        deleted = delete_book_by_id(book_id)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Livro não encontrado.",
        )
    return None


@router.get("/catalog/search", response_model=list[BookCatalogResult])
def search_book_catalog(
    q: str = Query(min_length=2, max_length=100, description="Título ou termos para buscar no catálogo"),
    limit: int = Query(default=10, ge=1, le=20),
):
    try:
        results = get_book_info_by_title(q, limit=limit)
    except requests.RequestException as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Não foi possível consultar o catálogo Open Library.",
        ) from error

    return [
        {
            "title": item.get("title", "Sem título"),
            "authors": item.get("author_name", []),
            "publication_year": item.get("first_publish_year"),
            "isbn": item.get("isbn", []),
            "cover_url": (
                f"https://covers.openlibrary.org/b/id/{item['cover_i']}-M.jpg"
                if item.get("cover_i") else None
            ),
            "external_id": item.get("key"),
        }
        for item in results
    ]
