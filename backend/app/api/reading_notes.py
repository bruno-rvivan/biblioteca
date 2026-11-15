from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.db.session import (
    add_reading_note_to_db,
    delete_reading_note_by_id,
    get_all_reading_notes,
    get_reading_note_by_id,
    get_reading_notes_by_book_id,
    update_reading_note,
)
from app.schemas.reading_notes import ReadingNote, ReadingNoteCreate, ReadingNoteUpdate

router = APIRouter()


@router.get("/", response_model=list[ReadingNote])
def list_reading_notes():
    return get_all_reading_notes()


@router.post("/", response_model=ReadingNote, status_code=status.HTTP_201_CREATED)
def add_reading_note(reading_note_data: ReadingNoteCreate):
    try:
        return add_reading_note_to_db(**reading_note_data.model_dump())
    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Não foi possível adicionar a nota. Verifique se o livro existe.",
        ) from error


@router.get("/book/{book_id}", response_model=list[ReadingNote])
def list_notes_for_book(book_id: UUID):
    return get_reading_notes_by_book_id(book_id)


@router.get("/{note_id}", response_model=ReadingNote)
def get_reading_note(note_id: UUID):
    note = get_reading_note_by_id(note_id)
    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nota de leitura não encontrada.",
        )
    return note


@router.patch("/{note_id}", response_model=ReadingNote)
def edit_reading_note(note_id: UUID, note_data: ReadingNoteUpdate):
    updated_data = note_data.model_dump(exclude_unset=True)
    if not updated_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Informe ao menos um campo para atualizar.",
        )
    if any(updated_data.get(field, object()) is None for field in ("chapter", "content", "note_type")):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Capítulo, conteúdo e tipo da nota não podem ser nulos.",
        )

    note = update_reading_note(note_id, updated_data)
    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nota de leitura não encontrada.",
        )
    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_reading_note(note_id: UUID):
    deleted = delete_reading_note_by_id(note_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nota de leitura não encontrada.",
        )
    return None
