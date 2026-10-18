from pathlib import Path
from sqlalchemy import create_engine
from app.db.base import Base
import os


DB_PATH = Path(__file__).resolve().parent / "books.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
engine = create_engine(DATABASE_URL)