from fastapi import APIRouter, HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.db.session import create_book, get_all_books
from app.schemas.books import Book, BookCreate

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


