
from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import Session

from app.db.base import Base
from pathlib import Path
from app.db.database import engine

from app.models.books import Books

from app.services.book_catalog import get_book_isbn, get_book_info_by_isbn

import json

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
