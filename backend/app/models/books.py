from sqlalchemy import String, Integer, Float, ForeignKey, UniqueConstraint, CheckConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
import uuid


class Books(Base):
    __tablename__ = "books"
    __table_args__ = (
        CheckConstraint(
            "reading_status IN ('to_read', 'reading', 'compleated', 'abandoned')",
            name="ck_books_reading_status",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    author: Mapped[str] = mapped_column(String(100), nullable=False)
    isbn: Mapped[str] = mapped_column(String(13), nullable=True, unique=True)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    publication_year: Mapped[int] = mapped_column(Integer, nullable=True)
    cover_url: Mapped[str] = mapped_column(String(200), nullable=True)
    reading_status: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[str] = mapped_column(String(50), nullable=False)
    updated_at: Mapped[str] = mapped_column(String(50), nullable=False)
    provider: Mapped[str] = mapped_column(String(50), nullable=True)
    external_id: Mapped[str] = mapped_column(String(100), nullable=True)