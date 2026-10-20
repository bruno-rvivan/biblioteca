
from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import Session

from app.db.base import Base
from pathlib import Path
from app.db.database import engine

from app.models.books import Books
from app.models.reading_notes import ReadingNotes

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


#----------------------------------------------------------------NOTAS------------------------------------------------------------


def add_reading_note_to_db(book_id: str, chapter: str, page: int, note_type: str, content: str):
    book_id = uuid.UUID(book_id)
    with Session(engine) as session:
        new_note = ReadingNotes(
            book_id=book_id,
            chapter=chapter,
            page=page,
            note_type=note_type,
            content=content,
            created_at=func.now(),
            updated_at=func.now(),
        )
        session.add(new_note)
        session.commit()



def get_all_reading_notes():
    with Session(engine) as session:
        notas = session.execute(select(ReadingNotes)).fetchall()
        notas = [note[0] for note in notas]
        return notas



def get_reading_note_by_id(note_id: str):
    note_id = uuid.UUID(note_id)
    with Session(engine) as session:
        nota = session.execute(select(ReadingNotes).where(ReadingNotes.id == note_id)).scalar_one_or_none()
        return nota



def get_reading_notes_by_book_id(book_id: str):
    book_id = uuid.UUID(book_id)
    with Session(engine) as session:
        notas = session.execute(select(ReadingNotes).where(ReadingNotes.book_id == book_id)).fetchall()
        notas = [note[0] for note in notas]
        return notas


def delete_reading_note_by_id(note_id: str):
    note_id = uuid.UUID(note_id)
    with Session(engine) as session:
        note = session.execute(select(ReadingNotes).where(ReadingNotes.id == note_id)).scalar_one_or_none()
        if note:
            session.delete(note)
            session.commit()
            return True
        return False









