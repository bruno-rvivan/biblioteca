from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.books import router as books_router
from app.api.reading_notes import router as reading_notes_router
from app.api.guideon import router as guideon_router


app = FastAPI()
app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)
app.include_router(books_router, prefix="/books", tags=["books"])
app.include_router(reading_notes_router, prefix="/reading-notes", tags=["reading-notes"])
app.include_router(guideon_router, prefix="/guideon", tags=["guideon"])
