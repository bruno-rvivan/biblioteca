from fastapi import APIRouter, HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.db.session import add_reading_note_to_db, get_all_reading_notes
from app.schemas.reading_notes import ReadingNote, ReadingNoteCreate

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
            detail="Erro ao adicionar nota de leitura",
        ) from error
