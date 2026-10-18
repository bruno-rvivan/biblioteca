
from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import Session

from app.db.base import Base
from pathlib import Path
from app.db.database import engine

from app.models.books import Books

from app.services.book_catalog import get_book_isbn, get_book_info_by_isbn, get_book_info_by_title

import json
import uuid

DB_PATH = Path(__file__).resolve().parent / "books.db"
Base.metadata.create_all(bind=engine)



def add_livro_to_db(book_name: str):
    isbn = get_book_isbn(book_name)
    if isbn:
        livro = get_book_info_by_isbn(isbn)
        if livro:
            with Session(engine) as session:
                new_book = Books(
                    title=livro["title"],
                    author=livro["authors"][0]["name"] if "authors" in livro and len(livro["authors"]) > 0 else "Unknown Author",
                    isbn=isbn,
                    description=None,
                    publication_year=livro['publish_date'],
                    cover_url=livro['cover']['medium'],
                    reading_status="to_read",
                    created_at=func.now(),
                    updated_at=func.now(),
                )
        session.add(new_book)
        session.commit()



def get_all_books():
    with Session(engine) as session:
        livros = session.execute(select(Books)).fetchall()
        livros = [book[0] for book in livros]
        return livros



def get_book_id_by_title(title: str):
    with Session(engine) as session:
        livro = session.execute(select(Books).where(Books.title == title)).scalar_one_or_none()
        if livro:
            return str(livro.id)
        return None



def get_book_by_id(book_id: str):
    if book_id is None:
        return None
    book_id = uuid.UUID(book_id)
    with Session(engine) as session:
        livro = session.execute(select(Books).where(Books.id == book_id)).scalar_one_or_none()
        return livro


def update_book(book_id: str, updated_data: dict):
    if book_id is None:
        return None
    book_id = uuid.UUID(book_id)
    with Session(engine) as session:
        livro = session.execute(select(Books).where(Books.id == book_id)).scalar_one_or_none()
        if livro:
            for key, value in updated_data.items():
                setattr(livro, key, value)
            livro.updated_at = func.now()
            session.commit()
            return livro
        return None















