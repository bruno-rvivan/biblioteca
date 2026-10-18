from sqlalchemy import String, Integer, Float, ForeignKey, CheckConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import uuid


class ReadingNotes(Base):
    __tablename__ = "reading_notes"
    __table_args__ = (
        CheckConstraint(
            "note_type IN ('reflection', 'question', 'quote', 'interpretation')",
            name="ck_reading_notes_note_type",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    book_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("books.id"), nullable=False)
    book: Mapped["Books"] = relationship()
    chapter: Mapped[str] = mapped_column(String(100), nullable=False)
    page: Mapped[int] = mapped_column(Integer, nullable=True)
    note_type: Mapped[str] = mapped_column(String(20), nullable=False)
    content: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[str] = mapped_column(String(50), nullable=False)
    updated_at: Mapped[str] = mapped_column(String(50), nullable=False)