import requests

BASE_URL = "https://openlibrary.org"
HEADERS = {"User-Agent": "Athanor/1.0"}


def get_book_isbn(title: str):
    response = requests.get(
        f"{BASE_URL}/search.json",
        params={"q": title, "limit": 1},
        headers=HEADERS,
        timeout=10,
    )
    response.raise_for_status()
    docs = response.json().get("docs", [])
    if not docs:
        return None
    isbns = docs[0].get("isbn", [])
    return isbns[0] if isbns else None


def get_book_info_by_isbn(isbn: str):
    response = requests.get(
        f"{BASE_URL}/api/books",
        params={"bibkeys": f"ISBN:{isbn}", "format": "json", "jscmd": "data"},
        headers=HEADERS,
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()
    return next(iter(data.values()), None)


def get_book_info_by_title(title: str, limit: int = 10):
    response = requests.get(
        f"{BASE_URL}/search.json",
        params={"q": title, "limit": limit},
        headers=HEADERS,
        timeout=10,
    )
    response.raise_for_status()
    return response.json().get("docs", [])
