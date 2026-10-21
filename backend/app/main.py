from fastapi import FastAPI
from app.api.books import router as books_router
from app.api.reading_notes import router as reading_notes_router


app = FastAPI()
app.include_router(books_router, prefix="/books", tags=["books"])
app.include_router(reading_notes_router, prefix="/reading-notes", tags=["reading-notes"])
