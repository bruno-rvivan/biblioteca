from agno.tools import tool

from app.db.session import search_reading_notes as search_notes

from agno.tools import tool



@tool
def search_reading_notes(
    search_term: str = "",
    book_id: str = "",
    note_id: str = "",
) -> str:
    """
    Pesquisa notas de leitura registradas na biblioteca pessoal do usuário.

    Args:
        search_term: Palavra ou expressão para procurar no conteúdo das notas.
        book_id: UUID do livro para restringir a pesquisa.
        note_id: UUID de uma nota específica.

    Returns:
        Notas encontradas, incluindo título do livro e conteúdo.
    """
    try:
        notes = search_notes(
            search_term=search_term or None,
            book_id=book_id or None,
            note_id=note_id or None,
        )

    except (ValueError, TypeError) as error:
        return f"Não foi possível realizar a pesquisa: {error}"

    if not notes:
        return "Nenhuma nota encontrada com os critérios informados."

    results = []

    for note in notes:
        page = (
            note["page"]
            if note["page"] is not None
            else "Não informada"
        )

        results.append(
            f"""
Livro: {note['book_title']}
ID do livro: {note['book_id']}
ID da nota: {note['id']}
Capítulo: {note['chapter']}
Página: {page}
Tipo: {note['note_type']}
Conteúdo: {note['content']}
"""
        )

    return "\n---\n".join(results)