from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def list_books():
    from app.db.session import get_all_books
    livros = get_all_books()
    return livros